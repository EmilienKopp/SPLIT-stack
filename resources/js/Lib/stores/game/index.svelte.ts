import type { MatchingGame, WordPair } from "$models";

import { router } from "@inertiajs/svelte";

interface GamePair {
  word_pair_id: WordPair['id'];
  sourceSelected?: boolean;
  targetSelected?: boolean;
  correct?: boolean;
}

interface Pick extends WordPair {
  type: 'source' | 'target';
}

type Status = 'playing' | 'just-missed' | 'game-over' | 'just-matched' | 'won';

export class Game {
  #game: MatchingGame;
  score = $state(0);
  missed = $state(0);
  pairs: GamePair[] | undefined = $state([]);
  correctAnswers: Set<WordPair['id']> = $state(new Set());
  firstPick: Pick | null = $state(null);
  secondPick: Pick | null = $state(null);
  status: Status = $state('playing');
  startTime: number = $state(Date.now());
  endTime: number | null = $state(null);
  time = $state(0);


  constructor(gameRow: MatchingGame) {
    this.#game = gameRow;
    this.reset();
    if(!gameRow.word_pairs) return;
    this.pairs = gameRow.word_pairs?.map((pair) => ({
      word_pair_id: pair.id,
      sourceSelected: false,
      targetSelected: false,
      correct: false,
    }));
  }

  pickWordPair(wordPair: WordPair, type: 'source' | 'target') {
    if(!this.firstPick) {
      this.firstPick = { ...wordPair, type };
      return;
    }

    if(this.firstPick.id !== wordPair.id) {
      this.secondPick = { ...wordPair, type };
      this.registerMiss();
    } else if(this.firstPick.type !== type) {
      this.secondPick = { ...wordPair, type };
      this.registerCorrectAnswer(this.firstPick.id);
    }

    this.assessWin();
    
    setTimeout(() => {
      this.resetSelected();
    }, 700);
  }

  registerCorrectAnswer(pair_id: WordPair['id']) {
    this.correctAnswers.add(pair_id);
    this.score = this.correctAnswers.size;
    this.status = 'just-matched';
  }

  registerMiss() {
    this.missed += 1;
    this.status = 'just-missed';
  }

  checkMatch() {
    const match = this.pairs?.find((pair => pair.sourceSelected && pair.targetSelected));
    return match;
  }

  resetSelected() {
    this.firstPick = null;
    this.secondPick = null;
  }

  isSelected(wordPair: WordPair, type: 'source' | 'target') {
    return this.secondPick?.id === wordPair.id && this.secondPick?.type === type
      || this.firstPick?.id === wordPair.id && this.firstPick?.type === type;
  }

  isCorrect(wordPair: WordPair) {
    const correct = this.correctAnswers.has(wordPair.id);
    return correct;
  }

  assessWin() {
    if(this.score === this.pairs?.length) {
      this.status = 'won';
      this.endTime = Date.now();
      this.time = (this.endTime - this.startTime) / 1000;
    }
  }

  reset(status: 'playing' | 'game-over' = 'playing') {
    this.score = 0;
    this.missed = 0;
    this.pairs = undefined;
    this.correctAnswers = new Set();
    this.firstPick = null;
    this.secondPick = null;
    this.status = status;
    this.startTime = Date.now();
    this.endTime = null;
    this.time = 0;
  }

  close() {
    this.reset('game-over');
  }

  saveScore() {
    router.post(route('game.setScore', this.#game.id), {
      score: this.score,
      time: this.time,
    });
  }

}
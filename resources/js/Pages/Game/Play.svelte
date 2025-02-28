<script lang="ts">
  import { confetti } from '@neoconfetti/svelte';
  import WordCard from '$components/Game/WordCard.svelte';
  import AuthenticatedLayout from '$layouts/AuthenticatedLayout.svelte';
  import { Game } from '$lib/stores/game/index.svelte';
  import { shuffle } from '$lib/utils/arrays';
  import type { WordPair } from '$models';
  import { setContext } from 'svelte';
  import { fly } from 'svelte/transition';
  import Button from '$components/Actions/Button.svelte';

  interface PickedWordPair extends WordPair {
    picked: boolean;
  }

  let { game } = $props();

  let reversed = $state(false);
  let GameHandler = $state(new Game(game));

  setContext('GameHandler', GameHandler);
</script>

<AuthenticatedLayout>
  <div class="w-full h-full overflow-hidden relative">
    <div>
      <h1 class="text-2xl font-bold">{game.name}</h1>
      <p>{game.description}</p>
    </div>
    <div
      class="w-11/12 mx-auto bg-white rounded-md p-4 mt-4 grid grid-cols-2 gap-4"
    >
      <h2 class="text-xl font-bold col-span-2">Word Pairs</h2>
      <div class="col-span-2 flex justify-between items-center">
        Score: {GameHandler.score}
      </div>
      <fieldset
        class="flex flex-col items-center gap-4 mt-4 p-4 border-2 border-dashed rounded-md"
      >
        <legend>Source</legend>
        {#each shuffle(game.word_pairs) as word_pair}
          <WordCard {word_pair} type="source" {reversed} />
        {/each}
      </fieldset>
      <fieldset
        class="flex flex-col items-center gap-4 mt-4 p-4 border-2 border-dashed rounded-md"
      >
        <legend>Target</legend>
        {#each shuffle(game.word_pairs) as word_pair}
          <WordCard {word_pair} type="target" {reversed} />
        {/each}
      </fieldset>
    </div>
    {#if GameHandler.status == 'won'}
      <div
        style="position: absolute; left: 50%; top: 30%"
        use:confetti={{
          particleCount: window.matchMedia('(prefers-reduced-motion: reduce)')
            .matches
            ? 0
            : undefined,
          force: 0.7,
          stageWidth: window.innerWidth,
          stageHeight: window.innerHeight,
          colors: ['#ff3e00', '#40b3ff', '#676778'],
        }}
      ></div>
      <div
        class="fixed top-[30%] left-1/2 -translate-x-1/2 text-center bg-slate-200 rounded p-5"
        in:fly={{ y: -100, duration: 300 }}
        out:fly={{ y: 300, duration: 300 }}
      >
        <h1 class="text-2xl font-bold">You won!</h1>
        <p>Score: {GameHandler.score}</p>
        <p>Time: {GameHandler.time}</p>
        <Button onclick={() => GameHandler.close()}>
          Close
        </Button>
        <Button onclick={() => GameHandler.reset()}>
          Play Again
        </Button>
        <Button onclick={() => GameHandler.saveScore()}>
          Save Score
        </Button>
      </div>
    {/if}
  </div>
</AuthenticatedLayout>

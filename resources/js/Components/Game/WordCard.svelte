<script lang="ts">
  import type { Game } from '$lib/stores/game/index.svelte';
  import type { WordPair } from '$models';
  import { getContext } from 'svelte';

  interface Props {
    word_pair: WordPair;
    type: 'source' | 'target';
    reversed?: boolean;
    onclick?: () => void;
    selected?: boolean;
    correct?: boolean;
    justMissed?: boolean;
  }

  let { word_pair, type, reversed, selected, justMissed, correct }: Props =
    $props();

  let GameHandler = getContext<Game>('GameHandler');

  let displayedWord = $derived.by(() => {
    const effectiveType = reversed
      ? type === 'source'
        ? 'target'
        : 'source'
      : type;
    return word_pair[(effectiveType + '_word') as keyof WordPair];
  });

  function handleClick() {
    if (GameHandler) {
      GameHandler.pickWordPair(word_pair, type);
    }
  }

  $effect(() => {
    if (GameHandler) {
      selected = GameHandler.isSelected(word_pair, type);
      correct = GameHandler.isCorrect(word_pair);
      justMissed = GameHandler.status == 'just-missed';
    }
  });
</script>

<button
  onclick={handleClick}
  class="w-32 h-16 bg-slate-100 border border-slate-300
hover:bg-blue-100 hover:border-blue-500 transition-colors duration-300
  rounded-md flex items-center justify-center text-2xl font-bold"
  class:bg-blue-400={selected}
  class:border-blue-800={selected}
  class:bg-green-400={correct}
  class:bg-red-400={selected && GameHandler?.status == 'just-missed'}
>
  {displayedWord}
</button>

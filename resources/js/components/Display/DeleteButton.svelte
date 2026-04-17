<script lang="ts">
  import { createBubbler } from 'svelte/legacy';

  const bubble = createBubbler();
  import { Trash2 } from 'lucide-svelte';
  import { twMerge } from 'tailwind-merge';

  interface Props {
    label: string;
    [key: string]: any
  }

  let { label, ...rest }: Props = $props();
</script>

<button
  class={twMerge('btn btn-error btn-sm btn-outline', rest.class)}
  onclick={bubble('click')}
  title="Delete"
  type="button"
>
  <Trash2 class="w-4 h-4" />
  {label}
</button>

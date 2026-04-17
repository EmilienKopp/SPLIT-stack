<script lang="ts">
  import { createBubbler } from 'svelte/legacy';

  const bubble = createBubbler();
  interface Props {
    checked?: boolean;
    [key: string]: any
  }

  let { checked = $bindable(false), ...rest }: Props = $props();
</script>

<input
  type="checkbox"
  bind:checked
  class="rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500"
  {...rest}
  onclick={bubble('click')}
  onchange={bubble('change')}
  onkeydown={bubble('keydown')}
  onkeyup={bubble('keyup')}
  onkeypress={bubble('keypress')}
  onfocus={bubble('focus')}
/>

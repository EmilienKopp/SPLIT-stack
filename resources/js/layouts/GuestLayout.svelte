<script lang="ts">
  interface Props {
    title?: string;
    children?: import('svelte').Snippet;
  }

  let { title = 'SPLIT-STACK', children }: Props = $props();
</script>

<h1 class="text-2xl font-semibold text-gray-900">{ title }</h1>
<div
  class="flex min-h-screen flex-col items-center bg-gray-100 pt-6 sm:justify-center sm:pt-0"
>
  <div
    class="mt-6 w-full overflow-hidden bg-white px-6 py-4 shadow-md sm:max-w-md sm:rounded-lg"
  >
    {@render children?.()}
  </div>
</div>

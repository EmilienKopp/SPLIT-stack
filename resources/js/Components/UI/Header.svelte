<script lang="ts">
  interface Props {
    title?: string;
    children?: import('svelte').Snippet;
  }

  let { title = '', children }: Props = $props();
</script>

<h2 class="text-xl font-bold text-gray-800 text-center flex items-center justify-between py-4">
  {title}
  {@render children?.()}
</h2>


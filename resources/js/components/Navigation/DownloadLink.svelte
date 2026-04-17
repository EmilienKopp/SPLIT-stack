<script lang="ts">
  interface Props {
    href: string;
    filename: string;
    children?: import('svelte').Snippet;
  }

  let { href, filename, children }: Props = $props();
</script>

<a {href} download={filename} class="btn btn-sm btn-primary">
  {@render children?.()}
</a>
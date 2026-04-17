<script lang="ts">
  import { twMerge } from "tailwind-merge";
  interface Props {
    children?: import('svelte').Snippet;
    [key: string]: any
  }

  let { children, ...rest }: Props = $props();

  const { class: css, ...attributes } = rest;
  
</script>
<button  {...attributes} class={twMerge("btn", css)}>
  {@render children?.()}
</button>
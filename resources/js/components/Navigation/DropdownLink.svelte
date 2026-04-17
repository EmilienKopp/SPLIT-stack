<script lang="ts">
  import { Link } from '@inertiajs/svelte';

  interface Props {
    href: string;
    children?: import('svelte').Snippet;
    [key: string]: any
  }

  let { href, children, ...rest }: Props = $props();
</script>

<Link
  {href}
  class="block w-full px-4 py-2 text-start text-sm leading-5 text-gray-700 transition duration-150 ease-in-out hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
  {...rest}
>
  {@render children?.()}
</Link>

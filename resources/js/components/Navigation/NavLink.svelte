<script lang="ts">
  import { Link } from '@inertiajs/svelte';

  interface Props {
    href: string;
    active?: boolean;
    children?: import('svelte').Snippet;
  }

  let { href, active = false, children }: Props = $props();

  // Compute the class dynamically
  let navClasses = $derived(active
    ? 'inline-flex items-center px-1 pt-1 border-b-2 border-primary text-md font-medium leading-5 text-gray-900 focus:outline-none focus:border-primary transition duration-150 ease-in-out'
    : 'inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-md font-medium leading-5 text-gray-500 hover:text-gray-700 hover:border-gray-300 focus:outline-none focus:text-gray-700 focus:border-gray-300 transition duration-150 ease-in-out');
</script>

<Link {href} class={navClasses}>
  {@render children?.()}
</Link>

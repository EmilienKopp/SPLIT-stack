<script lang="ts">
  import { Link, inertia } from '@inertiajs/svelte';

  interface Props {
    href: string;
    active?: boolean;
    children?: import('svelte').Snippet;
    [key: string]: any
  }

  let { href, active = false, children, ...rest }: Props = $props();
  let classes = $derived(active
    ? 'block w-full ps-3 pe-4 py-2 border-l-4 border-indigo-400 text-start text-base font-medium text-indigo-700 bg-indigo-50 focus:outline-none focus:text-indigo-800 focus:bg-indigo-100 focus:border-indigo-700 transition duration-150 ease-in-out'
    : 'block w-full ps-3 pe-4 py-2 border-l-4 border-transparent text-start text-base font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-50 hover:border-gray-300 focus:outline-none focus:text-gray-800 focus:bg-gray-50 focus:border-gray-300 transition duration-150 ease-in-out');
</script>

{#if rest.method?.toLowerCase() === 'post'}
  <button use:inertia="{{ href: rest.href, method: 'post' }}" type="button">
    {@render children?.()}
  </button>
{:else}
<Link {href} class={classes} {...rest}>
  {@render children?.()}
</Link>
{/if}

<script lang="ts">
  import { Link, inertia } from '@inertiajs/svelte';
  
  interface Props {
    actions?: DropdownAction[];
    trigger?: import('svelte').Snippet;
  }

  let { actions = [], trigger }: Props = $props();
</script>

<details class="dropdown dropdown-bottom">
  <summary class="flex rounded-md items-center cursor-pointer select-none" onclick={() => console.log("Dropdown")}>
    {@render trigger?.()}
  </summary>

  <ul
    class="menu dropdown-content bg-base-100 rounded-box z-[1] w-52 p-2 shadow transition delay-75"
  >
    {#each actions as {href, onclick, text, as}}
      <li>
        {#if as === 'a' || !as}
          <Link {href}>{text}</Link>
        {:else if as === 'button'}
          <button {onclick} use:inertia="{{ href: href, method: 'post' }}" type="button">
            {text}
          </button>
        {:else}
          {text}
        {/if}
      </li>
    {/each}
  </ul>
</details>

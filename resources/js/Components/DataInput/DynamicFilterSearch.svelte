<script lang="ts">
  import Button from '$components/Actions/Button.svelte';
  import Swap from '$components/Actions/Swap.svelte';
  import Input from '$components/DataInput/Input.svelte';
  import { query } from '$lib/stores/global/query.svelte';
  import { onMount } from 'svelte';

  interface Props {
    searchHandler: (query: string) => void;
    clearHandler: () => void;
    q: string;
  }

  let { searchHandler, clearHandler, q = $bindable() }: Props = $props();

  let prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  let dynamicEnabled = $state(!prefersReducedMotion);
  let title = $derived(
    dynamicEnabled ? 'Filter while typing' : 'Filter on Search only'
  );
  let searchParamKey = $state('q');

  onMount(() => {
    q = query.param(searchParamKey) ?? '';
  });

  function search(e: Event) {
    e.preventDefault();
    query.setParam(searchParamKey, q);
    searchHandler(q);
  }

  function clear() {
    q = '';
    query.clearParam(searchParamKey);
    clearHandler();
  }

  function toggled(fn: (e: Event) => void) {
    if (dynamicEnabled) {
      return fn;
    }
    return () => {};
  }
</script>

<form class="flex items-center gap-2" onsubmit={(e: Event) => search(e)}>
  {#if !prefersReducedMotion}
  <Swap
    on="⚡️"
    off="🔄"
    bind:checked={dynamicEnabled}
    {title}
  />
  {/if}
  <Input type="text" name="search" bind:value={q} oninput={toggled(search)} />
  <Button class="btn-ghost" type="button" onclick={clear}>Clear</Button>
  <Button class="btn-outline" onclick={search}>Search</Button>
</form>

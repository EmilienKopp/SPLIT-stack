<script lang="ts">
  import { dot } from '$lib/utils/objects';
  import type { DataHeader } from '$types/common/dataDisplay';

  interface Props {
    headers: DataHeader<any>[];
    data?: Record<string, any>;
    editable?: boolean; //TODO: Implement inline editing
  }

  let { headers, data, editable = false }: Props = $props();
</script>

<style>
  dl {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }

  dt {
    font-weight: bold;
  }
</style>

<dl>
  {#each headers as { key, label, formatter }}
    {@const resolved = dot(data, key)}
    <dt>{label}:</dt>
    {#if resolved === true}
      <dd>Yes</dd>
    {:else if resolved === false}
      <dd>No</dd>
    {:else if resolved !== null && resolved !== undefined}
      <dd>{formatter ? formatter(resolved) : resolved}</dd>
    {:else}
      <dd>-</dd>
    {/if}
  {/each}
</dl>

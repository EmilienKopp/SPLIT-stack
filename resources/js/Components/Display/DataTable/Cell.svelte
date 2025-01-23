<script lang="ts">
  import { self } from 'svelte/legacy';

  import { Highlighter } from '$lib/utils/highlight';
  import { resolveNestedValue } from '$lib/utils/objects';
  import type { DataHeader } from '$types/common/dataDisplay';

  interface Props {
    row: any;
    header: DataHeader<any>;
    searchStrings?: string[];
    onRowClick?: ((row: any) => void) | undefined;
  }

  let {
    row,
    header,
    searchStrings = [],
    onRowClick = undefined
  }: Props = $props();

  let value = $derived(resolveNestedValue(row, header.key));

  function handleClick() {
    if (onRowClick) {
      onRowClick(row);
    }
  }
</script>

<td class="whitespace-nowrap max-w-72 truncate" onclick={self(handleClick)}>
  <div class="flex gap-1 items-center">
    {#if header.icon}
      {@const SvelteComponent = header.icon(row)}
      <span title={value} class={header.iconClass?.(row)}>
        <SvelteComponent class="w-5 h-5" />
      </span>
    {/if}
    {#if !header.iconOnly}
      {#if header.combined}
        {header.combined(row)}
      {:else if value === null || value === undefined}
        -
      {:else}
        {@const formatted = header.formatter ? header.formatter(value) : value}
        {#if searchStrings?.length && typeof formatted === 'string' && header.searchable}
          <p>
            {@html Highlighter.highlightMany(
              formatted,
              searchStrings,
              ['bg-yellow-100', 'bg-blue-100'],
              'exact'
            )}
          </p>
        {:else}
          {formatted}
        {/if}
      {/if}
    {/if}
  </div>
</td>

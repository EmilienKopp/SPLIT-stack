<script lang="ts">
  import { twMerge } from 'tailwind-merge';
  import TableActions from './Action.svelte';
  import TableCell from './Cell.svelte';
  import TableHeader from './Header.svelte';
  import Pagination from './Pagination.svelte';
  import { query } from '$lib/stores/global/query.svelte';
  import type { Paginated } from '$types/pagination';

  let {
    data = undefined,
    paginated = false,
    paginatedData = undefined,
    headers = [],
    onRowClick = undefined,
    onDelete = undefined,
    model = 'user',
    className = '',
    actions = undefined,
    searchStrings = $bindable([]),
  }: Props = $props();

  if (!searchStrings?.length && query.param('search')) {
    searchStrings = [query.param('search')?.toString() || ''];
  }

  let pageIndex = $derived(query.param('page') || 1);

  let hasActions = $derived(Boolean(onDelete || actions?.length));
</script>

<style>
  table {
    border-collapse: separate;
    border-spacing: 0;
    border-radius: 0.75rem;
    overflow: hidden;
  }

  thead th {
    position: sticky;
    top: 0;
    z-index: 10;
  }
</style>

{#if Array.isArray(data) ? data.length === 0 : data?.data?.length === 0}
  <div class="text-center text-gray-500 p-4">No data available</div>
{:else}
  <div class="overflow-x-auto shadow-md rounded-lg">
    <table class="table table-zebra table-sm w-full {className}">
      <thead>
        <TableHeader {headers} {hasActions} />
      </thead>
      <tbody>
        {#each (Array.isArray(data) ? data : (data?.data ?? [])) as row (row?.id)}
          <tr
            class={twMerge(
              'hover:bg-base-300 transition-colors duration-200',
              onRowClick && 'cursor-pointer'
            )}
          >
            {#each headers as header}
              <TableCell {row} {header} {searchStrings} {onRowClick} />
            {/each}

            {#if actions?.length}
              <TableActions {actions} {row} />
            {/if}
          </tr>
        {/each}
      </tbody>
    </table>
  </div>

  {#if paginated && data}
    <Pagination
      paginatedData={data as Paginated<any>}
      pageIndex={Number(pageIndex)}
    />
  {/if}
{/if}

<script lang="ts">
  import { run, self } from 'svelte/legacy';

  import { query } from '$lib/stores';
  import { FilterService } from '$lib/utils/highlight';
  import { dot } from '$lib/utils/objects';
  import { twMerge } from 'tailwind-merge';
  import type { TableAction, TableHeader } from '../../types/components/Table';
  import type { Paginated } from '../../types/pagination';

  interface Props {
    data?: any[] | undefined;
    paginatedData?: Paginated<any> | undefined;
    headers?: TableHeader<any>[];
    onRowClick?: ((row: any) => void) | undefined;
    onDelete?: ((row: any) => void) | undefined;
    model?: 'employer' | 'job' | 'user' | 'application' | 'candidate';
    className?: string;
    actions?: TableAction<any>[] | undefined;
    searchStrings?: string[];
  }

  let {
    data = undefined,
    paginatedData = undefined,
    headers = [],
    onRowClick = undefined,
    onDelete = undefined,
    model = 'user',
    className = '',
    actions = undefined,
    searchStrings = $bindable([])
  }: Props = $props();

  if (!searchStrings.length && $query.param('search')) {
    searchStrings = [$query.param('search')?.toString() || ''];
  }

  let pageIndex;
  run(() => {
    pageIndex = $query.param('page') || 1;
  });

  if (paginatedData && data?.length) {
    throw new Error('Cannot use both dasta and paginatedData props');
  } else if (data !== undefined && paginatedData?.data) {
    throw new Error(
      'Looks like the data prop is paginated. Use "paginatedData" instead.'
    );
  }

  let tableData = $derived(paginatedData ? paginatedData.data : data);

  function handleRowClick(row: any) {
    if (onRowClick) {
      onRowClick(row);
    }
  }

  function handleDelete(row: any) {
    if (onDelete) {
      onDelete(row);
    }
  }
</script>

{#if tableData?.length === 0}
  <div class="text-center text-gray-500 p-4">No data available</div>
{:else}
  <div class="overflow-x-auto shadow-md rounded-lg">
    <table class="table table-zebra table-sm w-full {className}">
      <thead>
        <tr>
          {#each headers as header}
            <th class="bg-primary text-primary-content uppercase font-bold">
              {header.label}
            </th>
          {/each}
          {#if onDelete || actions?.length}
            <th
              class="bg-primary text-primary-content uppercase font-bold text-center"
            >
              Actions
            </th>
          {/if}
        </tr>
      </thead>

      <tbody>
        {#each tableData ?? [] as row, rowIndex}
          <tr
            class={twMerge(
              'hover:bg-base-300 transition-colors duration-200',
              onRowClick && 'cursor-pointer'
            )}
          >
            {#each headers as header}
              {@const value = dot(row, header.key)}
              <td
                class="whitespace-nowrap max-w-72 truncate"
                onclick={self(() => handleRowClick(row))}
              >
                <div class="flex gap-1 items-center">
                  {#if header.icon}
                    {@const SvelteComponent = header.icon(row)}
                    <span title={value} class={header.iconClass(row)}>
                      <SvelteComponent
                        class="w-5 h-5"
                      />
                    </span>
                  {/if}
                  {#if !header.iconOnly}
                    {#if header.combined}
                      {header.combined(row)}
                    {:else if value === null || value === undefined}
                      -
                    {:else}
                      {@const formatted = header.formatter
                        ? header.formatter(value)
                        : value}
                      {#if searchStrings?.length && typeof formatted === 'string' && header.searchable}
                        <p>
                          {@html FilterService.highlightMany(
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
            {/each}
            {#if actions?.length}
              <td class="text-center flex gap-2">
                {#each actions ?? [] as action}
                  {#if !action.hidden?.(row)}
                    <button
                      onclick={() => action.callback(row)}
                      class={twMerge(
                        'mx-1 px-1 hover:underline flex items-center gap-1s',
                        action.css?.(row)
                      )}
                    >
                      {#if action.icon}
                        {@const SvelteComponent_1 = action.icon(row)}
                        <SvelteComponent_1
                          class="w-4 h-4"
                        />
                      {/if}
                      {action.label}
                    </button>
                  {/if}
                {/each}
              </td>
            {/if}
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
  <div class="pagination-container w-full my-2 flex justify-center gap-2">
    {#if paginatedData}
      {#each paginatedData.links as link, index}
        <a
          href={link.url}
          class="btn btn-primary pagination-link"
          class:pagination-end={index === 0 ||
            index === paginatedData.links.length - 1}
          class:active={pageIndex === index &&
            index !== 0 &&
            index !== paginatedData.links.length - 1}
          onclick={() => {
            if (index !== 0 && index !== paginatedData.links.length - 1) {
              pageIndex = index;
            }
          }}
        >
          {@html link.label}
        </a>
      {/each}
    {/if}
  </div>
{/if}

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

  .active {
    @apply btn-outline;
  }

  /* Hide middle pagination items on smaller screens */
  @media (max-width: 768px) {
    .pagination-link:not(.pagination-end) {
      display: none;
    }

    /* Show ellipsis after first item */
    .pagination-link:first-child::after {
      content: '...';
      margin-left: 0.5rem;
      color: #666;
    }
  }
</style>

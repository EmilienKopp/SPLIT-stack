<script lang="ts">
  import { slide } from 'svelte/transition';
  import Recursive from '$components/Recursive.svelte';

  interface Props {
    metadata: Record<string, any> | { key: string; value: any };
    depth: number;
    expanded?: boolean;
  }

  let { metadata, depth = 0, expanded = true }: Props = $props();

  function toggleExpand() {
    expanded = !expanded;
  }

  function getValueColor(value: any): string {
    if (value === null) return "text-gray-400";
    switch (typeof value) {
      case "number": return "text-blue-600";
      case "boolean": return "text-purple-600";
      case "string": return "text-green-600";
      default: return "text-gray-900";
    }
  }

  function formatValue(value: any): string {
    if (value === null) return "null";
    if (Array.isArray(value)) return `Array(${value.length})`;
    if (typeof value === "object") return "Object";
    if (typeof value === "string") return `"${value}"`;
    return String(value);
  }

  function isExpandable(value: any): boolean {
    return value !== null && (typeof value === "object" || Array.isArray(value));
  }
</script>

<div class="font-mono text-sm" style="margin-left: {depth * 1.5}rem">
  {#if depth > 0}
    <button 
      class="flex items-center gap-2 py-1 hover:bg-gray-50 rounded cursor-pointer"
      onclick={isExpandable(metadata.value) ? toggleExpand : undefined}
    >
      {#if isExpandable(metadata.value)}
        <span class="text-gray-400 select-none">
          {expanded ? '▼' : '▶'}
        </span>
      {/if}
      <span class="text-gray-600">{metadata.key || 'root'}:</span>
      {#if !expanded}
        <span class={getValueColor(metadata.value)}>
          {formatValue(metadata.value)}
        </span>
      {/if}
    </button>
  {/if}

  {#if expanded}
    <div transition:slide|local>
      {#if Array.isArray(metadata.value)}
        {#each metadata.value as item, index}
          <Recursive
            metadata={{ key: `[${index}]`, value: item }}
            depth={depth + 1}
          />
        {/each}
      {:else if typeof metadata.value === 'object' && metadata.value !== null}
        {#each Object.entries(metadata.value) as [key, value]}
          <Recursive
            metadata={{ key, value }}
            depth={depth + 1}
            expanded={isExpandable(value) && expanded}
          />
        {/each}
      {:else if depth === 0}
        {#each Object.entries(metadata) as [key, value]}
          <Recursive
            metadata={{ key, value }}
            depth={depth + 1}
            expanded={isExpandable(value) && expanded}
          />
        {/each}
      {:else}
        <span class={getValueColor(metadata.value)}>
          {formatValue(metadata.value)}
        </span>
      {/if}
    </div>
  {/if}
</div>

<style>
  .font-mono {
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  }
</style>

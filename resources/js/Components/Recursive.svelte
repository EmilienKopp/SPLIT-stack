<script lang="ts" module>
  let root: Record<string, any> = $state();
</script>

<script lang="ts">
  import { slide } from 'svelte/transition';
  import { nanoid } from 'nanoid';
  import Recursive from '$components/Recursive.svelte';

  interface Props {
    metadata: Record<string, any> | { key: string; value: any };
    depth?: number;
    expanded?: boolean;
    maxDepth?: number;
    addMetadata?: () => void;
    ancestorPath?: string;
  }

  let {
    metadata,
    depth = 0,
    expanded = true,
    maxDepth = 5,
    addMetadata,
    ancestorPath,
  }: Props = $props();

  let id = nanoid(16);
  let selectedKey = $state('');
  let newEntry: { key: string; value: any } = $state({ key: '', value: '' });
  let selfPath = ancestorPath
    ? `${ancestorPath}.${metadata.key}`
    : metadata.key;

  if (depth === 0) {
    root = metadata;
  }

  function getKeyPaths(obj: Record<string, any>, key: string) {
    let paths = new Map();

    for (const [k, v] of Object.entries(obj)) {
      if (k === key) {
        paths.set(k, v);
      }
      if (typeof v === 'object' && v !== null) {
        const nestedPaths = getKeyPaths(v, key);
        for (const [nestedKey, nestedValue] of nestedPaths) {
          paths.set(`${k}.${nestedKey}`, nestedValue);
        }
      }
    }

    return paths;
  }

  function toggleExpand() {
    expanded = !expanded;
  }

  function getValueColor(value: any): string {
    if (value === null) return 'text-gray-400';
    switch (typeof value) {
      case 'number':
        return 'text-blue-600';
      case 'boolean':
        return 'text-purple-600';
      case 'string':
        return 'text-green-600';
      default:
        return 'text-gray-900';
    }
  }

  function formatValue(value: any): string {
    if (value === null) return 'null';
    if (Array.isArray(value)) return `Array(${value.length})`;
    if (typeof value === 'object') return 'Object';
    if (typeof value === 'string') return `"${value}"`;
    return String(value);
  }

  function isExpandable(value: any): boolean {
    return (
      value !== null && (typeof value === 'object' || Array.isArray(value))
    );
  }

  function insert(e: Event, obj: { key: string; value: any }) {
    e.preventDefault();
    let parsed;
    try {
      parsed = JSON.parse(newEntry.value);
    } catch (error) {
      parsed = newEntry.value;
    }

    const data = { [newEntry.key]: parsed };
    if(!selfPath) {
      console.log("NO SELF PATH");
      root = insertJsonAtPath(newEntry.key, parsed);
      metadata = root;
    } else {
      console.log("SELF PATH",selfPath);
      metadata = insertJsonAtPath(selfPath, data);
    }
  }

  function insertJsonAtPath(dotNotationKey: string, value: any) {
    const keys = dotNotationKey?.split('.');
    let obj = root;
    console.log("KEYS",keys);
    for (let i = 0; i < keys.length - 1; i++) {
      obj = obj[keys[i]];
    }
    if(typeof value === "string") {
      obj[keys[keys.length - 1]] = value;
    } else {
      obj[keys[keys.length - 1]] = { ...obj[keys[keys.length - 1]], ...value };
    }
    return root;
  }

  function handleModalOpen() {
    const dialog = document.getElementById(id) as HTMLDialogElement;
    dialog.showModal();
  }

  function handleModalClose() {
    const dialog = document.getElementById(id) as HTMLDialogElement;
    dialog.close();
  }

  function handleClick(metadata: any) {
    selectedKey = metadata.key;
    if (isExpandable(metadata.value)) {
      toggleExpand();
    }
  }
</script>

<style>
  .font-mono {
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
      'Liberation Mono', 'Courier New', monospace;
  }
</style>

<div class="font-mono text-sm" style="margin-left: {depth * 1.5}rem">
  {#if depth > 0}
    <div
      class="flex items-center gap-2 py-1 hover:bg-gray-50 rounded cursor-row-resize"
      onclick={() => handleClick(metadata)}
      onkeydown={() => handleClick(metadata)}
      tabindex="-1"
      role="button"
    >
      {#if isExpandable(metadata.value)}
        <span class="text-gray-400 select-none">
          {expanded ? '▼' : '▶'}
        </span>
      {/if}
      <span class="text-gray-600">
        {metadata.key || 'root'}:
      </span>
      {#if !expanded}
        <span class={getValueColor(metadata.value)}>
          {formatValue(metadata.value)}
        </span>
      {/if}
    </div>
  {/if}

  {#if expanded && depth < maxDepth}
    <div transition:slide|local>
      {#if Array.isArray(metadata.value)}
        {#each metadata.value as item, index}
          <Recursive
            metadata={{ key: `[${index}]`, value: item }}
            depth={depth + 1}
            {addMetadata}
            ancestorPath={selfPath}
          />
        {/each}
      {:else if typeof metadata.value === 'object' && metadata.value !== null}
        {#each Object.entries(metadata.value) as [key, value]}
          <Recursive
            metadata={{ key, value }}
            depth={depth + 1}
            expanded={isExpandable(value) && expanded}
            {addMetadata}
            ancestorPath={selfPath}
          />
        {/each}
      {:else if depth === 0}
        {#each Object.entries(metadata) as [key, value]}
          <Recursive
            metadata={{ key, value }}
            depth={depth + 1}
            expanded={isExpandable(value) && expanded}
            {addMetadata}
            ancestorPath={selfPath}
          />
        {/each}
      {:else}
        <span class={getValueColor(metadata.value)}>
          {formatValue(metadata.value)}
        </span>
      {/if}
      {#if expanded}
        <button
          onclick={handleModalOpen}
          class="rounded bg-blue-300 w-4 h-4 flex items-center justify-center"
          style="margin-left: {depth * 2.5}rem"
        >
          +
        </button>
      {/if}
    </div>
  {:else if expanded}
    <span class="text-gray-400">...</span>
  {/if}
</div>

<dialog {id} class="p-5 rounded-lg bg-white">
  <form onsubmit={insert}>
    <input type="text" placeholder="Key" bind:value={newEntry.key} />
    <input type="text" placeholder="Value" bind:value={newEntry.value} />
    <button type="submit">Add</button>
    <button type="button" onclick={handleModalClose}>Cancel</button>
  </form>
</dialog>

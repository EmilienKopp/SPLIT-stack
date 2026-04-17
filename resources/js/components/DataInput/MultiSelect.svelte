<script lang="ts">
  import { stopPropagation } from 'svelte/legacy';

  import { createEventDispatcher } from 'svelte';
  
  interface Props {
    options?: Array<{ name: string, value: string | number }>;
    selected?: string[];
    placeholder?: string;
    disabled?: boolean;
    label: string;
    errors?: string[];
    required?: boolean;
  }

  let {
    options = [],
    selected = $bindable([]),
    placeholder = 'Select items...',
    disabled = false,
    label,
    errors = [],
    required = false
  }: Props = $props();

  let isOpen = $state(false);
  let searchText = $state('');
  let inputElement: HTMLDivElement = $state();
  
  const dispatch = createEventDispatcher();
  
  let filteredOptions = $derived(searchText 
    ? options.filter(option => 
        option.name.toLowerCase().includes(searchText.toLowerCase())
      )
    : options);
  
  let selectedLabels = $derived(selected
    ?.map(value => options.find(opt => opt.value === value)?.name)
    ?.filter(Boolean));
  
  function toggleOption(value: string) {
    const index = selected.indexOf(value);
    if (index === -1) {
      selected = [...selected, value];
    } else {
      selected = selected.filter((_, i) => i !== index);
    }
    dispatch('change', { selected });
  }
  
  function removeOption(value: string) {
    selected = selected.filter(v => v !== value);
    dispatch('change', { selected });
  }
  
  function handleClickOutside(event: MouseEvent) {
    if (inputElement && !inputElement.contains(event.target as Node)) {
      isOpen = false;
    }
  }
  
  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      isOpen = false;
    }
  }
</script>

<svelte:window onclick={handleClickOutside} onkeydown={handleKeydown} />

<div class="multiselect w-full" bind:this={inputElement}>
  {#if label}
    <label class="label" for="deezNuts">
      <span class="label-text">{label}</span>
    </label>
  {/if}
  <button type="button"
    class="select-input w-full"
    class:disabled
    onclick={() => !disabled && (isOpen = !isOpen)}
  >
    {#if selectedLabels.length > 0}
      <div class="selected-items">
        {#each selectedLabels as label, i}
          <span class="selected-tag">
            {label}
            <button type="button"
              class="remove-btn"
              onclick={stopPropagation(() => removeOption(selected[i]))}
              disabled={disabled}
            >
              ×
            </button>
          </span>
        {/each}
      </div>
    {:else}
      <span class="placeholder">{placeholder}</span>
    {/if}
    <span class="arrow" class:open={isOpen}>▼</span>
  </button>
  
  {#if isOpen && !disabled}
    <div class="dropdown">
      <input
        type="text"
        class="search-input"
        bind:value={searchText}
        placeholder="Search..."
      />
      <div class="options-list">
        {#each filteredOptions as option}
          <button type="button"
            class="option"
            class:selected={selected.includes(option.value.toString())}
            onclick={stopPropagation(() => toggleOption(option.value.toString()))}
          >
            <input
              type="checkbox"
              checked={selected.includes(option.value.toString())}
              readonly
            />
            {option.name}
          </button>
        {/each}
        {#if filteredOptions.length === 0}
          <div class="no-results">No options found</div>
        {/if}
      </div>
    </div>
  {/if}
</div>

<style>
  .multiselect {
    position: relative;
    width: 100%;
    font-family: inherit;
  }
  
  .select-input {
    border: 1px solid #ccc;
    border-radius: 4px;
    padding: 8px;
    min-height: 40px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
    background: white;
  }
  
  .select-input.disabled {
    background: #f5f5f5;
    cursor: not-allowed;
  }
  
  .selected-items {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
  }
  
  .selected-tag {
    background: #e9ecef;
    border-radius: 3px;
    padding: 2px 8px;
    display: flex;
    align-items: center;
    gap: 4px;
  }
  
  .remove-btn {
    border: none;
    background: none;
    padding: 0;
    font-size: 16px;
    cursor: pointer;
    color: #666;
  }
  
  .remove-btn:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
  
  .placeholder {
    color: #6c757d;
  }
  
  .arrow {
    font-size: 12px;
    transition: transform 0.2s;
  }
  
  .arrow.open {
    transform: rotate(180deg);
  }
  
  .dropdown {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    margin-top: 4px;
    background: white;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    z-index: 1000;
  }
  
  .search-input {
    width: 100%;
    padding: 8px;
    border: none;
    border-bottom: 1px solid #eee;
    outline: none;
  }
  
  .options-list {
    max-height: 200px;
    overflow-y: auto;
  }
  
  .option {
    padding: 8px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  .option:hover {
    background: #f8f9fa;
  }
  
  .option.selected {
    background: #e9ecef;
  }
  
  .no-results {
    padding: 8px;
    color: #6c757d;
    text-align: center;
  }
</style>
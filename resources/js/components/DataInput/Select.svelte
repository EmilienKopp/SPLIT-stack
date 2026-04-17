<script lang="ts">
  import { createBubbler } from 'svelte/legacy';

  const bubble = createBubbler();
  import { createEventDispatcher } from 'svelte';
  import { twMerge } from 'tailwind-merge';
  interface Props {
    label?: string;
    options?: Option[];
    value: any;
    placeholder?: string;
    onchange?: (e: Event) => void;
    [key: string]: any
  }

  let {
    label,
    options = [],
    value = $bindable(),
    placeholder = 'Select something',
    onchange,
    ...rest
  }: Props = $props();

  interface Option {
    value: any;
    name: string;
  }

</script>

<div class="form-control">
  {#if label}
    <label class="label" for={rest.id}>
      <span class="label-text">{label}</span>
    </label>
  {/if}
  <select
    class={twMerge('select select-bordered', rest.class)}
    {...rest}
    bind:value
    onchange={(e) => onchange?.(e)}
  >
    {#if placeholder && !value}
      <option value="" disabled selected>{placeholder}</option>
    {/if}
    {#each options as option}
      <option value={option.value}>{option.name}</option>
    {/each}
  </select>
</div>

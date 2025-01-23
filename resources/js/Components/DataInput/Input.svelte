<script lang="ts">
  import { twMerge } from 'tailwind-merge';
  import InputLabel from './InputLabel.svelte';
  interface Props {
    label?: string;
    name: string;
    required?: boolean;
    value?: string | number | File | null | Date;
    errors?: Record<string, string>;
    type?: 'text' | 'number' | 'file' | 'search' | 'tel' | 'url' | 'email' | 'password' | 'date' | 'time' | 'datetime-local' | 'month' | 'week' | 'color';
    oninput?: (e: Event) => void;
    onchange?: (e: Event) => void;
    [key: string]: any;
  }

  let {
    label = '',
    name,
    required = false,
    value = $bindable(),
    errors = {},
    type = 'text',
    onchange,
    oninput,
    ...rest
  }: Props = $props();
</script>

<div class="form-control w-full">
  {#if label}
    <InputLabel for={rest.id} {required}>{label}</InputLabel>
  {/if}
  <input
    class={twMerge('input input-bordered', rest.class)}
    bind:value
    {onchange}
    {oninput}
    {...rest}
    {type}
  />
  {#if errors && errors[name]}
    <p class="text-error text-xs mt-1">{errors[name]}</p>
  {/if}
</div>

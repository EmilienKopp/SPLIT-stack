<script lang="ts">
  import { twMerge } from 'tailwind-merge';
  import InputLabel from './InputLabel.svelte';

  interface Props {
    label?: string;
    name: string;
    required?: boolean;
    value?: string | number | File | null;
    errors?: Record<string, string>;
    type?: 'password';
    oninput?: (e: Event) => void;
    onchange?: (e: Event) => void;
    [key: string]: any;
  }

  let {
    label = '',
    name,
    required = false,
    value = $bindable(''),
    errors = {},
    type = 'password',
    onchange,
    oninput,
    ...rest
  }: Props = $props();
</script>

<div class="form-control w-full mb-4">
  {#if label}
    <InputLabel for={rest.id} {required}>{label}</InputLabel>
  {/if}
  <input bind:this={inputElement}
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

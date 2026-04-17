<script lang="ts">
    import { createBubbler } from 'svelte/legacy';

    const bubble = createBubbler();
    import { twMerge } from 'tailwind-merge'
    interface Props {
        label?: string;
        required?: boolean;
        value?: string;
        [key: string]: any
    }

    let { label = '', required = false, value = $bindable(''), ...rest }: Props = $props();
</script>

<div class="form-control w-full mb-4">
    {#if label}
    <label class="label" for={rest.id}>
        <span class="label-text flex items-center">
            {label}
            {#if required}
                <span class="text-error
                ml-1">*</span>
            {/if}
        </span>
    </label>
    {/if}
    <textarea
        class={twMerge('textarea textarea-bordered', rest.class)}
        bind:value
        onchange={bubble('change')}
        oninput={bubble('input')}
        {...rest}
    ></textarea>
</div>
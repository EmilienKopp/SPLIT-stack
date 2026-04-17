<script lang="ts">
    import { twMerge } from "tailwind-merge";

    interface Props {
        htmlFor?: string;
        required?: boolean;
        [key: string]: any;
    }

    let { children, required, for: htmlFor, ...rest }: Props = $props();
</script>

<label class={twMerge("label", rest.class)} for={htmlFor} {...rest}>
    <span class="label-text flex items-center">
        {@render children?.()}
        {#if required}
            <span class="text-error ml-1">*</span>
        {/if}
    </span>
</label>

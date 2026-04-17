<script lang="ts">
    import { twMerge } from 'tailwind-merge';
  interface Props {
    title?: string;
    description?: string;
    children?: import('svelte').Snippet;
    [key: string]: any
  }

  let { title = '', description = '', children, ...rest }: Props = $props();
  </script>
  
  <fieldset {...rest} class={twMerge("p-6 bg-base-100 border border-primary rounded-lg", rest.class)}>
    <legend class="md:text-lg font-semibold text-primary">
      {title}
    </legend>
    {#if description}
      <p class="mt-1 text-xs sm:text-sm text-gray-600">{description}</p>
    {/if}
    <div class="mt-4">
      {@render children?.()}
    </div>
  </fieldset>
  
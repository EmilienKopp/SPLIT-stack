<script lang="ts">
  import clsx from 'clsx';
  import { twMerge } from 'tailwind-merge';

  interface Props {
    variant?: string;
    children?: import('svelte').Snippet;
    href?: string;
    onclick?: (e: MouseEvent) => void;
    [key: string]: any;
  }

  let {
    variant = 'primary',
    children,
    onclick,
    href,
    ...rest
  }: Props = $props();
</script>

{#if href}
  <a
    {href}
    class={twMerge(
      'btn',
      clsx({
        'btn-error': variant === 'danger',
        'btn-primary': variant === 'primary',
        'btn-secondary': variant === 'secondary',
        'btn-accent': variant === 'accent',
        'btn-outline': variant === 'outline',
        'btn-link': variant === 'link',
      }),
      rest.class
    )}
  >
    {@render children?.()}
  </a>
{:else}
  <button
    {...rest}
    {onclick}
    class={twMerge(
      'btn',
      clsx({
        'btn-error': variant === 'danger',
        'btn-primary': variant === 'primary',
        'btn-secondary': variant === 'secondary',
        'btn-accent': variant === 'accent',
        'btn-outline': variant === 'outline',
        'btn-link': variant === 'link',
      }),
      rest.class
    )}
  >
    {@render children?.()}
  </button>
{/if}

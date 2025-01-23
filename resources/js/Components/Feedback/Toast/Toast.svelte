<script lang="ts">
    import { Link, page } from '@inertiajs/svelte';
    import { onDestroy, onMount } from 'svelte';
    import { fly } from 'svelte/transition';
    import { toaster } from './ToastHandler.svelte';
  
    interface Props {
      href?: string | undefined;
      linkText?: string | undefined;
      yOffsetRem?: number;
      xOffsetRem?: number;
      show?: boolean;
      link?: import('svelte').Snippet;
    }
  
    let {
      href = undefined,
      linkText = undefined,
      yOffsetRem = 12,
      xOffsetRem = 12,
      show = $bindable(toaster.showing),
      link,
    }: Props = $props();
  
    let position:
      | 'top-right'
      | 'none'
      | 'top-left'
      | 'bottom-left'
      | 'bottom-right'
      | undefined = toaster.options?.position ?? 'top-right';
  
    const yOffset = position?.split('-')[0] + '-' + yOffsetRem;
    const xOffset = position?.split('-')[1] + '-' + xOffsetRem;
    const alertClasses: any = {
      success: 'alert-success',
      error: 'alert-error',
      info: 'alert-info',
    };
  
    onMount(() => {
      if ($page.props.flash) {
        toaster.fromFlash($page.props.flash);
      } else { 
          toaster.hide();
      }
    });
  
    onDestroy(() => {
      toaster.hide();
    });
  
    const textColors: any = {
      success: 'text-green-500',
      error: 'text-red-500',
      info: 'text-blue-500',
    };
  </script>
  
  {#if toaster.showing}
    <div
      class="toast toast-top toast-end z-[999] mt-16"
      in:fly={{ x: 100 }}
      out:fly={{ x: 100 }}
    >
      <div role="alert" class="alert {alertClasses[toaster.type]}">
        {#if toaster.type == 'success'}
          <!-- CheckCircleFill -->
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            class="bi bi-check-circle-fill bg-inherit"
            viewBox="0 0 16 16"
          >
            <path
              d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"
            />
          </svg>
        {:else if toaster.type == 'error'}
          <!-- Fire -->
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            class="bi bi-fire bg-inherit"
            viewBox="0 0 16 16"
          >
            <path
              d="M8 16c3.314 0 6-2 6-5.5 0-1.5-.5-4-2.5-6 .25 1.5-1.25 2-1.25 2C11 4 9 .5 6 0c.357 2 .5 4-2 6-1.25 1-2 2.729-2 4.5C2 14 4.686 16 8 16m0-1c-1.657 0-3-1-3-2.75 0-.75.25-2 1.25-3C6.125 10 7 10.5 7 10.5c-.375-1.25.5-3.25 2-3.5-.179 1-.25 2 1 3 .625.5 1 1.364 1 2.25C11 14 9.657 15 8 15"
            />
          </svg>
        {:else if toaster.type == 'info'}
          <!-- InfoSquareFill -->
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            class="bi bi-info-square-fill bg-inherit"
            viewBox="0 0 16 16"
          >
            <path
              d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm8.93 4.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533zM8 5.5a1 1 0 1 0 0-2 1 1 0 0 0 0 2"
            />
          </svg>
        {/if}
        {@html toaster.message}
        <br />
        {#if href}
          <Link {href}>{linkText ?? href}</Link>
        {/if}
      </div>
      {@render link?.()}
    </div>
  {/if}
  
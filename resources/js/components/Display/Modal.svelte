<script lang="ts">
  interface Props {
    isOpen?: boolean;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    children?: import('svelte').Snippet;
  }

  let { isOpen = false, size = 'md', children }: Props = $props();

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl'
  };

</script>

{#if isOpen}
  <div 
    class="modal modal-open"
    role="dialog"
    aria-modal="true"
  >
    <div class="modal-backdrop bg-black/50"></div>
    <div class="modal-box {sizeClasses[size]} relative">
      {@render children?.()}
    </div>
  </div>
{/if}

<style>
  .modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
</style>
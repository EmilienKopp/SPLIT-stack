<script lang="ts">
  interface Props {
    variant?: Variants;
  }

  let { variant = 'primary' }: Props = $props();

  const classes: Record<Variants,string> = {
    'primary': 'text-primary',
    'secondary': 'text-secondary',
    'warning': 'text-warning',
    'danger': 'text-warning',
    'error': 'text-error',
    'info': 'text-info',
    'success': 'text-success',
    'accent': 'text-accent',
    'neutral': 'text-neutral',
    'ghost': 'text-ghost',
  }
</script>

<span class="loading loading-spinner {classes[variant]}"></span>
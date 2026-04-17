<script lang="ts">
  interface Props {
    checked?: boolean;
    [key: string]: any
  }

  let { checked = $bindable(false), ...rest }: Props = $props();
</script>

<input type="checkbox" class="checkbox" {...rest} bind:checked/>
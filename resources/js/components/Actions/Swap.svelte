<script lang="ts">
  interface Props {
    on: string;
    off: string;
    checked: boolean;
    title?: string;
  }

  let { on, off, checked = $bindable(), title }: Props = $props();
</script>

<label class="swap swap-flip">
  <!-- this hidden checkbox controls the state -->
  <input type="checkbox" bind:checked class="hidden" />

  <div class="swap-on" {title}>{on}</div>
  <div class="swap-off" {title}>{off}</div>
</label>
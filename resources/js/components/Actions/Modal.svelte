
<script lang="ts">
  interface Props {
    id?: string;
    show?: boolean;
    title?: import('svelte').Snippet;
    children?: import('svelte').Snippet;
    onclose?: (e?: Event) => void;
  }

  let dialog: HTMLDialogElement;

  let {
    id,
    show = false,
    title,
    children
  }: Props = $props();

  export function close () {
    dialog.close();
  }
</script>

{#if show}
  <dialog class="modal" {id} bind:this={dialog}>
    <div class="modal-box">
      <h3 class="text-lg font-bold">
          {@render title?.()}
      </h3>
      <p class="py-4">
          {@render children?.()}
      </p>
    </div>

    <!-- This never displays -->
    <form method="dialog" class="modal-backdrop">
      <button onclick={close}>X</button>
    </form>
  </dialog>
{/if}
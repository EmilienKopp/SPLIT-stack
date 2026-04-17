<script lang="ts">
  import { twMerge } from "tailwind-merge";
  interface Props {
    title?: string;
  }

  let { title = '' }: Props = $props();
</script>

<h2 class="text-xl font-bold text-gray-800 text-center py-4">
  {title}
</h2>


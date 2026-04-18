<script lang="ts">
  import Button from '$components/Actions/Button.svelte';
  import { toaster } from '../lib/stores/global/toaster.svelte';
  import AuthenticatedLayout from '../layouts/AuthenticatedLayout.svelte';
  import DataGrid from '$components/Display/DataGrid/DataGrid.svelte';

</script>

<svelte:head>
  <title>Dashboard</title>
</svelte:head>

<AuthenticatedLayout>
  {#snippet header()}
    <h2  class="text-xl font-semibold leading-tight text-gray-800">
      Dashboard
    </h2>
  {/snippet}

  <div class="py-12 w-full">
    <div class="mx-auto max-w-7xl sm:px-6 lg:px-8 w-full">
      <div class="overflow-hidden bg-white shadow-sm sm:rounded-lg w-full">
        <div class="p-6 text-gray-900 flex items-center justify-between w-full">
          You're logged in! 🎉
          <Button variant="secondary" onclick={() => toaster.info('🍞 Toasted!')}>
            Toast me!
          </Button>

        </div>
        <DataGrid />
      </div>
    </div>
  </div>
</AuthenticatedLayout>

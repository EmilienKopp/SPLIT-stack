<script lang="ts">
  import Recursive from '$components/Recursive.svelte';
  import AuthenticatedLayout from '$layouts/AuthenticatedLayout.svelte';
  import { router } from '@inertiajs/svelte';

  let { project } = $props();
  let metadata = $derived(project.metadata ?? {});
  
  let newEntry: { key: string; value: string } = $state({ key: '', value: '' });

  function addMetadata() {
    
    let parsed;
    try {
      parsed = JSON.parse(newEntry.value);
    } catch (error) {
      parsed = newEntry.value;
    }
    const data = {[newEntry.key]: parsed};
    router.post(route('project.metadata', project.id), data);
    newEntry = { key: '', value: '' };
  }
</script>

<AuthenticatedLayout>
  <div class="mx-auto w-11/12 bg-white p-4 rounded-lg shadow-md">
    <section id="info">
      <h1 class="font-bold text-lg">Project</h1>
      <dl>
        <dt>Description:</dt>
        <dd>{project.description}</dd>
      </dl>
    </section>

    <section id="metadata" class="mt-6">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-lg font-semibold">Metadata</h2>
        <div class="flex gap-2">
          <input 
            type="text" 
            placeholder="Key" 
            bind:value={newEntry.key}
            class="px-3 py-1 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <input 
            type="text" 
            placeholder="Value" 
            bind:value={newEntry.value}
            class="px-3 py-1 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <button 
            onclick={addMetadata}
            class="px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Add
          </button>
        </div>
      </div>
      
      <div class="bg-gray-50 p-4 rounded-lg border">
        <Recursive {metadata} />
      </div>
    </section>
  </div>
</AuthenticatedLayout>

<style>
  section dl {
    display: grid;
    grid-template-columns: 1fr 6fr;
    gap: 0.5rem;
  }

  section dt {
    font-weight: bold;
  }

  section dd {
    margin: 0;
  }
</style>

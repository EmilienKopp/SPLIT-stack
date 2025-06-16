<script lang="ts">
  import Button from '$components/Actions/Button.svelte';
  import AuthenticatedLayout from '$layouts/AuthenticatedLayout.svelte';
  import { ProjectBase } from '$lib/models/Project';
  import { Project } from '$lib/models/Project.svelte';
  import { toaster } from '$lib/stores/global/toaster.svelte';
  import { translucid } from '$lib/translucid.svelte';
  import { router } from '@inertiajs/svelte';
  import { onMount, untrack } from 'svelte';

  let { projects: initialProjects } = $props();
  let editing: Record<number, boolean> = $state({});
  let projects = $state();

  projects = translucid
    .table('projects')
    .registerForDelete()
    .watchAll(initialProjects);

  function createProject() {
    router.post(
      '/project',
      {
        name: 'My new project',
        type: 'other',
        organization_id: 1,
        status: 'active',
      },
      { preserveState: false }
    );
  }

  function deleteProject(id: number) {
    router.delete(`/project/${id}`);
  }

  function updateProject(id: number, text?: string) {
    router.patch(
      route('project.update', id),
      {
        description: text || Math.random().toString(36).substring(7),
      },
      { only: [] }
    );
  }

  function whisper() {
    window.Echo.private(`translucid`).whisper('typing', {
      name: 'John Doe',
    });
  }

  $inspect(translucid.updates, translucid.registeredDeletes);
</script>

<svelte:head>
  <title>Dashboard</title>
</svelte:head>

<AuthenticatedLayout>
  {#snippet header()}
    <h2 class="text-xl font-semibold leading-tight text-gray-800">Dashboard</h2>
  {/snippet}

  <div class="py-12 w-full">
    <div class="mx-auto max-w-7xl sm:px-6 lg:px-8 w-full">
      <div class="overflow-hidden bg-white shadow-sm sm:rounded-lg w-full">
        <div class="p-6 text-gray-900 flex items-center justify-between w-full">
          You're logged in! 🎉
          <Button
            variant="secondary"
            onclick={() => toaster.info('🍞 Toasted!')}
          >
            Toast me!
          </Button>
        </div>
        <div
          class="p-6 bg-gray-100 text-gray-900 flex items-center justify-between w-full"
        >
          <button onclick={createProject}> New </button>
          <!-- <button onclick={whisper}> Whisper </button> -->
        </div>
        <table class="table table-xs table-zebra w-full bg-white rounded-lg">
          <tbody>
            {#each projects as project (project.id)}
              <tr>
                <td>
                  {project.id}
                </td>
                <td>
                  {project.name}
                </td>
                <td>
                  {#if editing[project.id]}
                    <input
                      type="text"
                      bind:value={project.description}
                      onblur={() => {
                        updateProject(project.id, project.description);
                        editing[project.id] = false;
                      }}
                      onkeydown={(e) => {
                        if (e.key === 'Enter') {
                          updateProject(project.id, project.description);
                          editing[project.id] = false;
                        }
                      }}
                      class="input input-bordered w-full"
                      placeholder="Description"
                    />
                  {:else}
                    {project.description}
                  {/if}
                </td>
                <td>
                  <button
                    class="mx-2 p-1 bg-slate-200 hover:bg-slate-300 rounded-md"
                    onclick={() => (editing[project.id] = true)}
                  >
                    Edit
                  </button>
                  <button
                    class="mx-2 p-1 bg-slate-200 hover:bg-slate-300 rounded-md"
                    onclick={() => deleteProject(project.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    </div>
  </div></AuthenticatedLayout
>

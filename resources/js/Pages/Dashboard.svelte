<script lang="ts">
  import Button from '$components/Actions/Button.svelte';
  import AuthenticatedLayout from '$layouts/AuthenticatedLayout.svelte';
  import { ProjectBase } from '$lib/models/Project';
  import { Project } from '$lib/models/Project.svelte';
  import { toaster } from '$lib/stores/global/toaster.svelte';
  import { router } from '@inertiajs/svelte';
  import { onMount } from 'svelte';

  onMount(() => {
    const channel = window.Echo.private('translucid');

    channel.listen('.translucid.created', (event: any) => {
      console.log('Received created event:', event);
    });
  });

  let { projects } = $props();

  projects.forEach((project: ProjectBase) => {
    project = new Project(project).translucid();
  });

  function createProject() {
    router.post('/project', {
      name: 'My new project',
      type: 'other',
      organization_id: 1,
      status: 'active',
    });
  }

  function deleteProject(id: number) {
    router.delete(`/project/${id}`);
  }

  function whisper() {
    window.Echo.private(`translucid`).whisper('typing', {
      name: 'John Doe',
    });
  }

  $inspect(projects);
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
          <button onclick={createProject}> Emit event </button>
          <button onclick={whisper}> Whisper </button>
        </div>
        <ul>
          {#each projects as project}
            <li>{project.name}
              <button onclick={() => deleteProject(project.id) }>Delete</button>
            </li>
          {/each}
        </ul>
      </div>
    </div>
  </div></AuthenticatedLayout
>

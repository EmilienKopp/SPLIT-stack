<script lang="ts">
  import DynamicFilterSearch from '$components/DataInput/DynamicFilterSearch.svelte';
  import { DataTable } from '$components/Display/DataTable';
  import Header from '$components/UI/Header.svelte';

  import AuthenticatedLayout from '$layouts/AuthenticatedLayout.svelte';
  import { ProjectContext } from '$lib/domains/Project/context';
  import { RoleContext } from '$lib/stores/global/roleContext.svelte';
  import type { Project } from '$models';

  interface Props {
    projects: Project[];
  }

  let { projects }: Props = $props();

  let context = $derived(new ProjectContext(RoleContext.selected));
  let headers = $derived(context.strategy.headers());
  let actions = $derived(context.strategy.actions());

  let q = $state('');
  let filteredProjects = $state(projects);

  /**
   * Search handler
   * @param q - search query
   * @usage - to get highlighting:
   *    - set `searchable: true` in the strategy headers
   *    - bind the query string state to the DynamicFilterSearch component `q` prop
   *    - pass the query string state to the DataTable component as `searchString` [string]
   */
  let searchHandler = (q: string) => {
    filteredProjects = projects.filter((project) =>
      project.name.toLowerCase().includes(q.toLowerCase())
    );
  };

  let clearHandler = () => {};
</script>

<AuthenticatedLayout>
  <Header>
    <h1>Projects</h1>
    <div class="flex items-center gap-2 mx-auto">
      <DynamicFilterSearch {searchHandler} {clearHandler} bind:q />
    </div>
  </Header>

  <DataTable {headers} {actions} data={filteredProjects} searchStrings={[q]} />
</AuthenticatedLayout>

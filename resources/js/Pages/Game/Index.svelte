<script lang="ts">
  import Button from "$components/Actions/Button.svelte";
  import Table from "$components/Display/Table.svelte";
  import AuthenticatedLayout from "$layouts/AuthenticatedLayout.svelte";
  import { MatchingGameContext } from "$lib/domains/MatchingGame/context";
  import { RoleContext } from "$lib/stores/global/roleContext.svelte";

  
  let { games } = $props();

  let context = $derived(new MatchingGameContext(RoleContext.selected));
  let headers = $derived(context.strategy.headers());
  let actions = $derived(context.strategy.actions());

</script>


<AuthenticatedLayout>
  <Button href={route('game.create')} class="my-4">Create</Button>
  <Table {headers} {actions} data={games} />
</AuthenticatedLayout>
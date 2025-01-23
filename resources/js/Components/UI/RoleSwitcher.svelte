<script lang="ts">
  import Select from '$components/DataInput/Select.svelte';
  import { asSelectOptions } from '$lib/utils/formatting';
  import { getAllUserRoles, getUserRoleName } from '$lib/inertia';
  import { RoleContext } from '$lib/stores/global/roleContext.svelte';

  RoleContext.selected = getUserRoleName();
  RoleContext.available = getAllUserRoles();
  $inspect(RoleContext.selected);
</script>

<div class="form-control w-full max-w-xs">
  <Select
    name="role"
    bind:value={RoleContext.selected}
    options={asSelectOptions(RoleContext.available)}
    class="select-primary select w-full bg-white shadow-sm transition-all hover:shadow-md"
  />
</div>

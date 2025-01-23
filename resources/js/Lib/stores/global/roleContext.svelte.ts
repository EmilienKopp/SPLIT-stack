import { getAllUserRoles } from "$lib/inertia";

interface RoleContext {
  selected: string;
  available: string[];
}

export const RoleContext: RoleContext = $state({
  selected: 'guest',
  available: [],
});

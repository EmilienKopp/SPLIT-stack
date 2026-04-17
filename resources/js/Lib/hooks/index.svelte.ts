import { page } from '@inertiajs/svelte';

export function useUser() {
  return page.props.auth.user;
}
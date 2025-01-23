import { useForm } from '@inertiajs/svelte';
import { get, Readable } from 'svelte/store';
import type { InertiaForm } from './types';
import { page } from '@inertiajs/svelte';

export type * from './types';

export function superUseForm<T extends object>(
  obj?: Partial<T>
): Readable<InertiaForm<T>> {
  return useForm(obj as any);
}

export function hookSuccess<T extends object>(
  form: InertiaForm<T>,
  callback: () => void
): void {
  form.recentlySuccessful && callback();
}

/**
 * @returns The first role of the user
 */
export function getUserRoleName(): string {
  const role = (get(page) as any)?.props.auth.user.roles?.[0];
  return role?.name ?? 'guest';
}

/**
 * @returns Array of user roles except the default role
 */
export function getAllUserRoles(): string[] {
  return (
    (get(page) as any)
      ?.props.auth.user.roles?.map((role: any) => role.name)
      .filter((r: string) => r != 'user') ?? []
  );
}

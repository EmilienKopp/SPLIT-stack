import { useForm } from '@inertiajs/svelte';
import { Readable } from 'svelte/store';
import type { InertiaForm } from './types';

export type * from './types';

export function superUseForm<T extends object>(obj: T): Readable<InertiaForm<T>> {
  return useForm(obj);
}

export function hookSuccess<T extends object>(form: InertiaForm<T>, callback: () => void): void {
  form.recentlySuccessful && callback();
}


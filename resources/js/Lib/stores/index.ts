import { Readable, derived, writable } from 'svelte/store';

import { asSelectOptions } from '$lib/utils/formatting';
import { page } from '@inertiajs/svelte';
import { type Toast, type Toastable, toastable } from './toast';

type Selectables = {
  [key: string]: { value: string; label: string; name: string }[];
};

/**
 * Authenticated user from Inertia
 */
export const user = derived([page], ([$page]: any) => {
  return $page.props.auth.user;
});

/**
 * Easy access to the Inertia page props
 */
export const props = derived([page], ([$page]: any) => {
  return $page.props;
});

/**
 * Holds all the enums from the backend as a Record of string[]
 */
export const enums: Readable<Record<string, string[]>> = derived(
  [page],
  ([$page]: any) => {
    return $page.props.enums;
  }
);

/**
 * Holds an object with select options {value,label,name} for each enum
 */
export const selectables: Readable<Selectables> = derived(
  [enums],
  ([$enums]: [Record<string, string[]>]) => {
    const kvArray = Object.entries($enums).map(([key, value]) => {
      const options = asSelectOptions(value, 'name', 'name');
      return [key, options];
    });
    return Object.fromEntries(kvArray);
  }
);

/**
 * Consistency helper for constants
 */
export const constants: Readable<Record<string, string[]>> = derived(
  [page],
  ([$page]: any) => {
    return $page.props.constants;
  }
);

export const roles: Readable<string[]> = derived(
  [page],
  ([$page]: any) => {
    return $page.props.roles;
  }
);

/**
 * Provides methods to show toast messages
 * @usage toast.info('What is the answer to life, the universe, and everything?');
 * @usage toast.success('42');
 * @usage toast.error('Never gonna give you up');
 * @warning ⚠️ Needs the `<Toast />` component to be present in the layout
 */
export const toast: Toastable<Toast> = toastable();

export const url = writable(new URL(window.location.href), (set) => {
  const update = () => {
    set(new URL(window.location.href));
  };
  window.addEventListener('popstate', update);
  return () => window.removeEventListener('popstate', update);
});

export const query = derived([url], ([$url]: [URL]) => {
  const searchParamsObject = Object.fromEntries($url.searchParams.entries());
  return {
    ...searchParamsObject,
    param(key:string,value?: string | number) {
      if(value) {
        $url.searchParams.set(key, value.toString());
      }
      
      let newValue: string | number | null = $url.searchParams.get(key);
      // Coerce to number if possible:
      if(newValue && !isNaN(Number(newValue))) {
        newValue = Number(newValue);
      }
      return newValue;
    }
  }
});
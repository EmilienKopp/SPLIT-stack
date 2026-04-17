import { writable } from 'svelte/store';

export type Toast = {
  show?: boolean;
  position?:
    | 'top-right'
    | 'top-left'
    | 'bottom-right'
    | 'bottom-left'
    | 'none'
    | undefined;
  message?: string;
  color?: 'blue' | 'red' | 'green';
  duration: number;
  type?: 'success' | 'error' | 'info';
  class?: string;
};

type ToastOptions = {
  color?: 'blue' | 'red' | 'green' | undefined;
  duration?: number | undefined;
  position?:
    | 'top-right'
    | 'top-left'
    | 'bottom-right'
    | 'bottom-left'
    | 'none'
    | undefined;
  class?: string | undefined;
  type?: 'success' | 'error' | 'info';
};

export interface Toastable<T> {
  subscribe: (callback: any) => void;
  set: (data: T) => void;
  update: (data: T) => void;
  show: (
    message: string,
    type: 'success' | 'error' | 'info',
    options?: ToastOptions
  ) => void;
  hide: (
    message?: string | undefined,
    color?: 'green' | 'red' | 'blue',
    duration?: number,
    position?:
      | 'top-right'
      | 'top-left'
      | 'bottom-right'
      | 'bottom-left'
      | 'none'
      | undefined
  ) => void;
  success: (
    message: string,
    options?: {
      color: 'green' | 'red' | 'blue';
      duration: number;
      position:
        | 'top-right'
        | 'top-left'
        | 'bottom-right'
        | 'bottom-left'
        | 'none'
        | undefined;
      class: string;
    }
  ) => void;
  error: (
    message: string,
    options?: {
      color: 'green' | 'red' | 'blue';
      duration: number;
      position:
        | 'top-right'
        | 'top-left'
        | 'bottom-right'
        | 'bottom-left'
        | 'none'
        | undefined;
      class: string;
    }
  ) => void;
  info: (
    message: string,
    options?: {
      color: 'green' | 'red' | 'blue';
      duration: number;
      position:
        | 'top-right'
        | 'top-left'
        | 'bottom-right'
        | 'bottom-left'
        | 'none'
        | undefined;
      class: string;
    }
  ) => void;
}

export const toastable = (): Toastable<Toast> => {
  const { subscribe, set, update } = writable({});

  return {
    show: (
      message: string,
      type: 'success' | 'error' | 'info',
      options: ToastOptions = {
        color: 'green',
        duration: 3000,
        position: 'top-right',
        class: '',
      }
    ) => {
      switch (type) {
        case 'success':
          options.color = 'green';
          break;
        case 'error':
          options.color = 'red';
          break;
        case 'info':
          options.color = 'blue';
          break;
      }
      set({ show: true, type, message, options });
    },
    hide: () => {
      set({ show: false });
    },
    subscribe: (callback: any) => {
      return subscribe(callback);
    },
    set: (value: any) => {
      set(value);
    },
    update: (updater: any) => {
      update((value: any) => {
        const newValue = updater(value);
        set(newValue);
        return newValue;
      });
    },
    success: (
      message: string,
      options: {
        color: 'green' | 'red' | 'blue';
        duration: number;
        position:
          | 'top-right'
          | 'top-left'
          | 'bottom-right'
          | 'bottom-left'
          | 'none'
          | undefined;
        class: string;
      } = {
        color: 'green',
        duration: 3000,
        position: 'top-right',
        class: '',
      }
    ) => {
      set({ show: true, type: 'success', message, options });
    },
    error: (
      message: string,
      options: {
        color: 'green' | 'red' | 'blue';
        duration: number;
        position:
          | 'top-right'
          | 'top-left'
          | 'bottom-right'
          | 'bottom-left'
          | 'none'
          | undefined;
        class: string;
      } = {
        color: 'red',
        duration: 3000,
        position: 'top-right',
        class: '',
      }
    ) => {
      set({ show: true, type: 'error', message, options });
    },
    info: (
      message: string,
      options: {
        color: 'green' | 'red' | 'blue';
        duration: number;
        position:
          | 'top-right'
          | 'top-left'
          | 'bottom-right'
          | 'bottom-left'
          | 'none'
          | undefined;
        class: string;
      } = {
        color: 'blue',
        duration: 3000,
        position: 'top-right',
        class: '',
      }
    ) => {
      set({ show: true, type: 'info', message, options });
    },
  };
};

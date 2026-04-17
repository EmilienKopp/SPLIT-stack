import type { ToastOptions } from "$types/common/toast";

export const DEFAULT_TOAST_OPTIONS: ToastOptions = {
  color: 'blue',
  duration: 3000,
  position: 'top-right',
  class: '',
};

export const SUCCESS_TOAST_OPTIONS: ToastOptions = {
  color: 'green',
  ...DEFAULT_TOAST_OPTIONS,
};

export const ERROR_TOAST_OPTIONS: ToastOptions = {
  color: 'red',
  ...DEFAULT_TOAST_OPTIONS,
};

export const INFO_TOAST_OPTIONS: ToastOptions = {
  color: 'blue',
  ...DEFAULT_TOAST_OPTIONS,
};

import { DEFAULT_TOAST_OPTIONS, ERROR_TOAST_OPTIONS, INFO_TOAST_OPTIONS, SUCCESS_TOAST_OPTIONS } from '$lib/config/toast';
import type { ToastOptions, ToastType } from '$types/common/toast';

class ToastHandler {
  #show = $state(false);
  message = $state('');
  type = $state<ToastType>('info');
  options = $state<ToastOptions>({
    ...DEFAULT_TOAST_OPTIONS,
  });

  constructor() {}

  public get showing() {
    return this.#show;
  }

  public show(
    message: string,
    type: ToastType,
    options: Partial<ToastOptions> = {}
  ) {
    this.options = options;
    this.message = message;
    this.type = type;
    this.#show = true;
    setTimeout(() => {
      this.hide();
    }, this.options.duration);
  }

  /**
   * Displays a toast notification with the specified message and options.
   * Assumes the backed returns only one of the possible toast types as flash.
   * @param {string} message - The message to display in the toast notification.
   * @param {ToastType} type - The type of toast notification to display.
   * @param {Partial<ToastOptions>} [options] - Optional settings to customize the toast notification.
   * @param {string} [options.color='blue'] - The color of the toast notification.
   * @param {number} [options.duration=3000] - The duration in milliseconds for which the toast notification is displayed.
   * @param {string} [options.position='top-right'] - The position on the screen where the toast notification appears.
   */
  public fromFlash(flashData: Record<ToastType, string>) {
    setTimeout(() => {
      const entries = Object.entries(flashData);
      if (entries.length === 0) return;
      const firstEntry = entries.find(([type, message]) => message?.length);
      if (!firstEntry) return;
      const [type, message] = firstEntry;
      this.show(message, type as ToastType, { duration: 5000 });
    }, 500);
  }

  /**
   * Displays a success toast notification with the specified message and options.
   *
   * @param {string} message - The message to display in the toast notification.
   * @param {Partial<ToastOptions>} [options] - Optional settings to customize the toast notification.
   * @param {string} [options.color='green'] - The color of the toast notification.
   * @param {number} [options.duration=3000] - The duration in milliseconds for which the toast notification is displayed.
   * @param {string} [options.position='top-right'] - The position on the screen where the toast notification appears.
   */
  public success(message: string, options?: Partial<ToastOptions>) {
    options = {
      ...DEFAULT_TOAST_OPTIONS,
      ...SUCCESS_TOAST_OPTIONS,
      ...options,
    };
    this.show(message, 'success', { color: 'green', ...options });
  }

  /**
   * Displays an error toast notification with the specified message and options.
   *
   * @param message - The message to display in the toast notification.
   * @param options - Optional settings to customize the toast notification.
   *                   - `color`: The color of the toast notification (default: 'red').
   *                   - `duration`: The duration the toast notification is displayed in milliseconds (default: 3000).
   *                   - `position`: The position of the toast notification on the screen (default: 'top-right').
   */
  public error(message: string, options?: Partial<ToastOptions>) {
    options = {
      ...DEFAULT_TOAST_OPTIONS,
      ...ERROR_TOAST_OPTIONS,
      ...options,
    };
    this.show(message, 'error', { color: 'red', ...options });
  }

  /**
   * Displays an informational toast message.
   *
   * @param message - The message to be displayed in the toast.
   * @param options - Optional settings to customize the toast appearance and behavior.
   *   - color: The color of the toast. Defaults to 'blue'.
   *   - duration: The duration the toast will be visible in milliseconds. Defaults to 3000.
   *   - position: The position where the toast will appear on the screen. Defaults to 'top-right'.
   */
  public info(message: string, options?: Partial<ToastOptions>) {
    options = {
      ...DEFAULT_TOAST_OPTIONS,
      ...INFO_TOAST_OPTIONS,
      ...options,
    };
    this.show(message, 'info', { color: 'blue', ...options });
  }

  /**
   * Hides the toast notification.
   */
  public hide() {
    this.message = '';
    this.#show = false;
  }
}

function createToastHandler() {
  return new ToastHandler();
}

/**
 * The toast handler singleton.
 * This can be used to display toast notifications throughout the application.
 *
 * @constant
 * @type {ToastHandler}
 * @member {boolean} showing - Whether the toast is currently showing.
 * @member {string} message - The message to display in the toast.
 * @member {ToastType} type - The type of toast to display.
 *
 * @method {success} - Display a success toast.
 * @method {error} - Display an error toast.
 * @method {info} - Display an info toast.
 */
export const toaster = createToastHandler();

export type ToastPosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'none';
export type ToastType = 'success' | 'error' | 'info';
export type ToastColor = 'blue' | 'red' | 'green';

export interface ToastOptions {
    color?: ToastColor;
    duration?: number;
    position?: ToastPosition;
    class?: string;
    animations?: {
        enter?: string;
        exit?: string;
    };
}

export interface ToastState {
    show: boolean;
    message: string;
    type: ToastType;
    options: ToastOptions;
}
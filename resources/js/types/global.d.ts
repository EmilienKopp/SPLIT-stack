import { ToastType } from '$components/Feedback/Toast';
import { PageProps as InertiaPageProps } from '@inertiajs/core';
import { AxiosInstance } from 'axios';
import type { Echo } from 'laravel-echo';
import { route as ziggyRoute } from 'ziggy-js';
import { PageProps as AppPageProps } from './';

declare global {
    interface Window {
        axios: AxiosInstance;
        Echo: Echo;
    }

    /* eslint-disable no-var */
    var route: typeof ziggyRoute;
}



declare module '@inertiajs/core' {
    interface PageProps extends InertiaPageProps, AppPageProps {
        flash: Record<ToastType, string>;
    }
}

import '../css/app.css';
import './bootstrap';

import { createInertiaApp } from '@inertiajs/svelte';
import { setupProgress } from '@inertiajs/core';
import { mount } from 'svelte';

setupProgress({ delay: 150, color: '#29d' });

createInertiaApp({
  resolve: name => {
    const pages = import.meta.glob('./Pages/**/*.svelte', { eager: true })
    return pages[`./Pages/${name}.svelte`]
  },
  setup({ el, App, props }) {
    mount(App, { target: el, props })
  },
})
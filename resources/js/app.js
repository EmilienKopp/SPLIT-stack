import '../css/app.css';
import './bootstrap';

import { createInertiaApp } from '@inertiajs/svelte';
import { mount } from 'svelte';

createInertiaApp({
  resolve: name => {
    const pages = import.meta.glob('./Pages/**/*.svelte', { eager: true })
    return pages[`./Pages/${name}.svelte`]
  },
  progress: {
    delay: 150,
    color: '#29d',
    
  },
  setup({ el, App, props }) {
    mount(App, { target: el, props })
  },
})
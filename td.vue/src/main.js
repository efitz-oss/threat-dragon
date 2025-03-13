import { createApp } from 'vue';
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';

import App from './App.vue';
import router from './router/index.js';
import i18n from './i18n/index.js';

// Import PrimeVue core and services
import PrimeVue from 'primevue/config';
import ToastService from 'primevue/toastservice';
import { registerPrimeVueComponents } from '@/plugins/primevue';

// Import our custom stylesheets instead of default PrimeVue themes
// The order is important: variables should be loaded first, then other styles
import '@/styles/primevue-variables.scss'; // Color and layout variables
import '@/styles/scss-includes.scss'; // Math utilities and functions
import '@/styles/fonts.scss'; // Typography
import '@/styles/icons.scss'; // Icon styling
import '@/styles/primevue-theme.scss'; // Component theming

// Import optimized FontAwesome icons
import { FontAwesomeIcon, registerFontAwesome } from '@/icons';

// Create the Pinia store
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

// Implement route prefetching for improved performance
const prefetchRouteComponents = () => {
    // Prefetch components for routes with preload: true
    router
        .getRoutes()
        .filter((route) => route.meta?.preload)
        .forEach((route) => {
            // If the component is a function (lazy loaded), execute it to load the chunk
            if (typeof route.components?.default === 'function') {
                route.components.default();
            }
        });

    // Prefetch next likely routes based on current route
    const prefetchAdjacentRoutes = () => {
        const currentRoute = router.currentRoute.value;
        const adjacentRoutes = [
            // Common navigation paths from current route
            router.resolve('/dashboard'),
            router.resolve('/demo/select'),
        ];

        // Preload components for these adjacent routes
        adjacentRoutes.forEach((resolvedRoute) => {
            if (
                resolvedRoute.matched.length &&
                resolvedRoute.matched[0].components?.default &&
                typeof resolvedRoute.matched[0].components.default === 'function'
            ) {
                resolvedRoute.matched[0].components.default();
            }
        });
    };

    // Setup prefetching when idle
    if ('requestIdleCallback' in window) {
        window.requestIdleCallback(prefetchAdjacentRoutes, { timeout: 2000 });
    } else {
        setTimeout(prefetchAdjacentRoutes, 1000);
    }
};

// Create the app
const app = createApp(App);
console.log('App created');

// Register FontAwesome component with optimized icons
registerFontAwesome(app);
console.log('FontAwesome registered');

// Use plugins - order matters!
try {
    // Initialize Pinia first
    app.use(pinia);
    console.log('Pinia registered');
    
    // Then register router (which uses pinia)
    app.use(router);
    console.log('Router registered');
    
    // Initialize UI components after router
    app.use(PrimeVue, {
        ripple: true,
        inputStyle: 'filled',
    });
    console.log('PrimeVue plugin registered');
    
    app.use(ToastService);
    console.log('ToastService registered');
    
    app.use(i18n);
    console.log('i18n registered');
} catch (error) {
    console.error('Error registering plugins:', error);
}

// Register optimized PrimeVue components asynchronously
// This is now async but won't block app mounting
registerPrimeVueComponents(app).catch((err) => {
    console.error('Error registering PrimeVue components:', err);
});

// Initial route prefetch after app is mounted
(async () => {
    try {
        console.log('Waiting for router to be ready');
        await router.isReady();
        console.log('Router is ready');

        // Mount the app
        console.log('Mounting app to #app element');
        app.mount('#app');
        console.log('App mounted successfully');

        // Start prefetching route components in the background
        if ('requestIdleCallback' in window) {
            window.requestIdleCallback(prefetchRouteComponents, { timeout: 1500 });
        } else {
            setTimeout(prefetchRouteComponents, 800);
        }
        console.log('Route prefetching scheduled');
    } catch (error) {
        console.error('Error initializing the application:', error);
    }
})();
console.log('App initialization process started');
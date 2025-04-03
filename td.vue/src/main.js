import { createApp } from 'vue'; // Vue 3 syntax
import App from './App.vue';
import i18nFactory from './i18n/index.js';
import router from './router/index.js';
import { store } from './store/index.js';
import bootstrapVueNext from './plugins/bootstrap-vue-next'; // Bootstrap-Vue-Next plugin for Vue 3
import fontAwesome from './plugins/fontawesome-vue'; // FontAwesome plugin
import { toastNotificationPlugin } from './plugins/toast-notification.js';
import Tooltip from 'primevue/tooltip';
import { isElectronMode } from './utils/environment';
import configActions from './store/actions/config.js';
import 'passive-events-support/dist/index.js'; // Add support for passive event listeners

// Check if we're in web-only mode
const isWebOnly = process.env.VUE_APP_WEB_ONLY === 'true';

// Create Vue app
const app = createApp(App);

// Attach plugins and dependencies
app.use(router); // Vue Router
app.use(store); // Vuex Store
app.use(i18nFactory.get()); // i18n (Internationalization)
app.use(bootstrapVueNext); // Bootstrap-Vue-Next plugin
app.use(fontAwesome); // FontAwesome plugin

// Initialize toast notification plugin
app.use(toastNotificationPlugin, {
    position: 'top-right',
    duration: 3000
});

app.directive('tooltip', Tooltip);

// Mount the app
app.mount('#app');

// Log the build mode
if (isWebOnly) {
    console.log('Running in web-only mode');
}

// Fetch config (this will set appropriate values for desktop/web modes)
store.dispatch(configActions.fetch).then(() => {
    // Only import and initialize Google Sign-In in web mode and if Google auth is enabled
    if ((!isElectronMode() || isWebOnly) && store.state.config?.config?.googleEnabled) {
        console.log('Google auth is enabled, initializing Google Sign-In plugin');
        import('vue3-google-signin').then((GoogleSignInModule) => {
            const GoogleSignInPlugin = GoogleSignInModule.default;
            app.use(GoogleSignInPlugin, {
                clientId: process.env.VUE_APP_GOOGLE_CLIENT_ID
            });
            console.log('Google Sign-In plugin initialized');
        });
    } else {
        console.log(
            'Google auth is not enabled or running in desktop mode, skipping Google Sign-In plugin'
        );
    }
});

import { createApp } from 'vue'; // Vue 3 syntax
import App from './App.vue';
import i18nFactory from './i18n/index.js';
import router from './router/index.js';
import { store } from './store/index.js';
import bootstrapVueNext from './plugins/bootstrap-vue-next'; // Bootstrap-Vue-Next plugin for Vue 3
import fontAwesome from './plugins/fontawesome-vue'; // FontAwesome plugin
import GoogleSignInPlugin from 'vue3-google-signin';
import ToastPlugin from 'vue-toast-notification';  //updated Toast notifications setup
import 'vue-toast-notification/dist/theme-default.css'; // Import toast styles
import Tooltip from 'primevue/tooltip';


const app = createApp(App);

// Attach plugins and dependencies
app.use(router); // Vue Router
app.use(store); // Vuex Store
app.use(i18nFactory.get()); // i18n (Internationalization)
app.use(bootstrapVueNext); // Bootstrap-Vue-Next plugin
app.use(fontAwesome); // FontAwesome plugin
app.use(GoogleSignInPlugin, {
    clientId: process.env.VUE_APP_GOOGLE_CLIENT_ID,
});

// Initialize toast plugin and make it globally available
app.use(ToastPlugin, {
    position: 'top-right',
    duration: 3000
});

// Make toast globally accessible for use outside of components
window.$toast = app.config.globalProperties.$toast;

app.directive('tooltip', Tooltip);

// Mount the app
app.mount('#app');
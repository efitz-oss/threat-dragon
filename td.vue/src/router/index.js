import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router';
import HomePage from '../views/HomePage.vue';
import { gitRoutes } from './git.js';
import { localRoutes } from './local.js';
import { desktopRoutes } from './desktop.js';
import { googleRoutes } from './google.js';
import OAuthCallback from '../views/OAuthCallback.vue';
import ToSPage from '../views/ToSPage.vue';
import PrivacyPage from '../views/PrivacyPage.vue';

const routes = [
    {
        path: '/oauth-return',
        name: 'OAuthCallback',
        component: OAuthCallback
    },
    {
        path: '/',
        name: 'HomePage',
        component: HomePage
    },
    {
        path: '/dashboard',
        name: 'MainDashboard',
        component: () =>
            import(/* webpackChunkName: "main-dashboard" */ '../views/MainDashboard.vue')
    },
    {
        path: '/tos',
        name: 'ToSPage',
        component: ToSPage
    },
    {
        path: '/privacy',
        name: 'PrivacyPage',
        component: PrivacyPage
    },
    {
        path: '/demo/select',
        name: 'DemoSelect',
        component: () =>
            import(/* webpackChunkName: "demo-select" */ '../views/demo/SelectDemoModel.vue')
    },
    ...desktopRoutes,
    ...gitRoutes,
    ...localRoutes,
    ...googleRoutes
];

// Use hash history for Electron (desktop) mode, web history for web mode
const isElectron =
    typeof window !== 'undefined' && (window.electronAPI?.isElectron || window.isElectronMode);
const historyMode = isElectron ? createWebHashHistory() : createWebHistory();
console.log(
    'Router using',
    isElectron ? 'hash history (Electron mode)' : 'web history (browser mode)'
);

const router = createRouter({
    history: historyMode,
    routes
});

// Navigation guard to ensure provider is available in the route params
// and to handle legacy route compatibility
router.beforeEach((to, from, next) => {
    // If this is a legacy route with /google/google/ pattern, redirect to new route format
    if (to.path.startsWith('/google/google/')) {
        const newPath = to.path.replace('/google/google/', '/drive/');
        console.log(`Redirecting legacy route ${to.path} to ${newPath}`);
        next({
            path: newPath, 
            params: to.params,
            query: to.query,
            replace: true
        });
        return;
    }

    // If the route has provider metadata but no provider param, add it
    if (to.meta.provider && !to.params.provider) {
        const newParams = { ...to.params, provider: to.meta.provider };
        next({
            ...to,
            params: newParams,
            replace: true
        });
    } else {
        next();
    }
});

export default router;

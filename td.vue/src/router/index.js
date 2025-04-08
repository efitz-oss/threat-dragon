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
    // Add debug logging to help diagnose routing issues
    console.debug(`Router navigating from "${from.fullPath}" to "${to.fullPath}" with params:`, to.params);

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

    // Special handling for local provider routes to avoid provider param issues
    // This prevents infinite redirection when using demo models
    const localRouteNames = ['localThreatModel', 'localDiagramEdit', 'localThreatModelEdit', 'localReport'];
    if (localRouteNames.includes(to.name) || to.path.startsWith('/models/')) {
        // Don't try to inject provider for local routes
        next();
        return;
    }
    
    // Special handling for Google Drive routes
    if (to.meta.provider === 'google') {
        // Check for required 'folder' parameter
        if (to.path.includes('/drive/') && !to.path.startsWith('/drive/folder') && !to.path.startsWith('/drive/new')
            && !to.path.startsWith('/drive/save') && !to.params.folder) {
            console.warn('Missing required folder parameter for Google Drive route:', to.path);
            // Redirect to folder selection
            next({ name: 'googleFolder' });
            return;
        }
    }

    // If the route has provider metadata but no provider param, add it
    if (to.meta.provider && !to.params.provider) {
        // For regular routes, add the provider param from the meta
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

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
    // Enhanced debug logging to help diagnose routing issues
    console.log(`ROUTE DEBUG: from=${from.fullPath} to=${to.fullPath}`);
    console.log(`  params=${JSON.stringify(to.params)}, meta=${JSON.stringify(to.meta)}`);
    console.log(`  name=${to.name}, path=${to.path}`);
    
    // If this is a demo selection page, preserve provider state
    if (to.name === 'DemoSelect') {
        console.log('Navigating to demo selection page with current provider state');
        next();
        return;
    }

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
        console.log('Local route detected, skipping provider injection:', to.name);
        // Don't try to inject provider for local routes
        next();
        return;
    }
    
    // Provider-specific route parameter validation
    if (to.meta.provider === 'google') {
        // For Google routes: Check for required 'folder' parameter
        if (to.path.includes('/drive/') && 
            !to.path.startsWith('/drive/folder') && 
            !to.path.startsWith('/drive/new') &&
            !to.path.startsWith('/drive/save') && 
            !to.params.folder) {
            console.warn('Missing required folder parameter for Google Drive route:', to.path);
            // Redirect to folder selection
            next({ name: 'googleFolder' });
            return;
        }
    } else if (to.meta.provider === 'git' && to.path.includes('/repository/')) {
        // For Git routes: Ensure repository parameter exists
        if (!to.params.repository) {
            console.warn('Missing required repository parameter for Git route:', to.path);
            // Redirect to repository selection
            next({ name: 'gitRepository', params: { provider: to.params.provider || 'github' }});
            return;
        } else if (to.path.includes('/branch/') && !to.params.branch) {
            console.warn('Missing required branch parameter for Git route:', to.path);
            // Redirect to branch selection
            next({ 
                name: 'gitBranch', 
                params: { 
                    provider: to.params.provider || 'github',
                    repository: to.params.repository
                }
            });
            return;
        }
    }

    // Check if this is a provider-specific route that needs special handling
    if (to.meta.provider) {
        // Only store the provider in the Vuex store instead of trying to add it to route params
        // This avoids the Vue Router warning about discarded parameters
        const store = window._vueApp?.$store;
        if (store && to.meta.provider) {
            console.log(`Setting provider in store: ${to.meta.provider}`);
            try {
                // Dispatch action to select provider - make sure this action exists in your store
                store.dispatch('PROVIDER_SELECTED', to.meta.provider);
            } catch (error) {
                console.error('Failed to set provider in store:', error);
            }
        }
    }
    
    // Continue with the navigation
    next();
});

export default router;

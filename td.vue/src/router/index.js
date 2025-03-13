import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { providerNames } from '@/service/provider/providers.js';

import { gitRoutes } from './git.js';
import { localRoutes } from './local.js';
import { desktopRoutes } from './desktop.js';
import { googleRoutes } from './google.js';

// Define which routes require authentication
const publicPages = ['/', '/oauth-return'];
const isPublicPage = (path) => {
    return publicPages.some((publicPath) => path === publicPath || path.startsWith('/demo'));
};

// Core routes with lazy loading for better code splitting
const routes = [
    {
        path: '/',
        name: 'HomePage',
        component: () => import('../views/HomePage.vue'),
        // Pre-fetch the home page route for faster initial load
        meta: { preload: true, public: true },
    },
    {
        path: '/dashboard',
        name: 'MainDashboard',
        component: () => import('../views/MainDashboard.vue'),
        meta: { preload: true, requiresAuth: true },
    },
    {
        path: '/oauth-return',
        name: 'OAuthReturn',
        component: () => import('../views/OauthReturn.vue'),
        meta: { public: true },
    },
    {
        path: '/demo/select',
        name: 'DemoSelect',
        component: () => import('../views/demo/SelectDemoModel.vue'),
        meta: { public: true },
    },
    {
        path: '/import',
        name: 'ImportModel',
        component: () => import('../views/ImportModel.vue'),
        meta: { requiresAuth: true },
    },
    ...desktopRoutes,
    ...gitRoutes,
    ...localRoutes,
    ...googleRoutes,
];

// Create router instance
const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL || '/public/'),
    routes,
    // Add scrollBehavior for a better UX when navigating between routes
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            // Return to the previous scroll position when using back/forward browser buttons
            return savedPosition;
        } else {
            // Otherwise scroll to the top of the page
            return { top: 0 };
        }
    },
});

// Authentication guard
router.beforeEach((to, from, next) => {
    // Check if the route requires authentication
    if (to.matched.some((record) => record.meta.requiresAuth)) {
        // Try to read from sessionStorage first which is more reliable
        let isAuthenticated = false;
        
        try {
            const authData = sessionStorage.getItem('td.pinia.auth');
            if (authData) {
                const parsed = JSON.parse(authData);
                isAuthenticated = !!parsed.user?.username;
            }
        } catch (e) {
            console.error('Error parsing auth data from session storage', e);
        }
        
        // If not authenticated, redirect to login
        if (!isAuthenticated) {
            next({ path: '/' });
        } else {
            next(); // User is authenticated, proceed
        }
    } else {
        // Route doesn't require auth, allow all
        next();
    }
});

// Implement route-based code splitting with prefetching for better performance
router.beforeResolve(async (to, from, next) => {
    // Look for required component chunks that haven't been loaded yet
    const components = [];
    const matched = router.resolve(to).matched;

    for (const record of matched) {
        if (record.components) {
            for (const key in record.components) {
                const component = record.components[key];
                if (typeof component === 'function' && !component.__prefetched) {
                    // Mark as prefetched to avoid duplicate loads
                    component.__prefetched = true;
                    components.push(component());
                }
            }
        }
    }

    // If we have components to prefetch, load them before navigating
    if (components.length) {
        try {
            await Promise.all(components);
            next();
        } catch (err) {
            console.error('Error prefetching components:', err);
            next();
        }
    } else {
        next();
    }
});

export default router;

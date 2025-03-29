import axios from 'axios';
import { AUTH_SET_JWT } from '@/store/actions/auth.js';
import i18n from '@/i18n/index.js';
import { LOADER_FINISHED, LOADER_STARTED } from '@/store/actions/loader.js';
import router from '@/router/index.js';
import { store } from '@/store/index.js'; // Direct import of the store instance

// Translation helper that works in both composable and non-composable contexts
const getTranslation = (key) => {
    try {
        // Try direct i18n access first (Vue 3 way)
        if (typeof i18n.t === 'function') {
            return i18n.t(key);
        }
        // Fall back to get() for backward compatibility
        if (typeof i18n.get === 'function') {
            return i18n.get().t(key);
        }
    } catch (err) {
        console.warn('Translation error:', err);
    }
    
    // Return key as fallback
    return key;
};

// Create a toast function that works globally using the app-level instance
const createToast = () => {
    try {
        // Access the globally registered toast instance
        if (window.$toast) {
            return window.$toast;
        }
    } catch (err) {
        // Fallback for tests and non-browser contexts
        console.warn('Toast not available in this context, using mock');
    }
    
    // Fallback mock implementation
    return {
        success: (msg) => console.log('Toast success:', msg),
        error: (msg) => console.log('Toast error:', msg),
        warning: (msg) => console.log('Toast warning:', msg),
        info: (msg) => console.log('Toast info:', msg)
    };
};

// Use a function to get the toast to avoid composition API issues outside of setup()
const getToast = () => createToast();

const createClient = () => {
    const client = axios.create();
    client.defaults.headers.common.Accept = 'application/json';
    client.defaults.headers.post['Content-Type'] = 'application/json';
    client.interceptors.request.use((config) => {
        store.dispatch(LOADER_STARTED);

        if (store.state.auth.jwt) {
            config.headers.authorization = `Bearer ${store.state.auth.jwt}`;
        }

        return config;
    }, (err) => {
        console.error('Request error:',err);
        store.dispatch(LOADER_FINISHED);
        return Promise.reject(err);
    });

    client.interceptors.response.use((resp) => {
        store.dispatch(LOADER_FINISHED);
        return resp;
    }, async (err) => {
        const logAndExit = () => {
            console.error('Request error:',err);
            store.dispatch(LOADER_FINISHED);
            return Promise.reject(err);
        };

        if (err.response.status !== 401) {
            return logAndExit();
        }

        const refreshToken = store.state.auth.refreshToken;
        if (!refreshToken) {
            return logAndExit();
        }

        try {
            const response = await axios.post('/api/token/refresh', { refreshToken });
            const tokens = response.data.data;
            store.dispatch(AUTH_SET_JWT, tokens);
            err.config.headers.authorization = `Bearer ${tokens.accessToken}`;
            const retryResp = await axios.request(err.config);
            store.dispatch(LOADER_FINISHED);
            return retryResp;
        } catch (retryError) {
            console.warn('Error retrying after refresh token update');
            console.warn(retryError);
            getToast().info(getTranslation('auth.sessionExpired'));
            router.push({ name: 'HomePage' });
            return await logAndExit();
        }
    });

    return client;
};

export default {
    createClient,
    get: createClient // Adjusted to return the client directly
};
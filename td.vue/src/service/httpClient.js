import axios from 'axios';
import { AUTH_SET_JWT } from '@/store/actions/auth.js';
import i18n from '@/i18n/index.js';
import { LOADER_FINISHED, LOADER_STARTED } from '@/store/actions/loader.js';
import router from '@/router/index.js';
import { store } from '@/store/index.js'; // Direct import of the store instance

import { tc } from '@/i18n/index.js';
import { useToast } from '@/plugins/toast-notification.js';

// Get translation using the standardized helper
const getTranslation = (key) => tc(key);

// Get toast using the standardized helper
const getToast = () => useToast();

// Determine the correct base URL based on environment
const getBaseUrl = () => {
  // Check if we're in development mode
  const isDev = process.env.NODE_ENV === 'development';
  
  // If in development, use http protocol for API requests to avoid SSL issues
  if (isDev) {
    const port = window.location.port ? `:${window.location.port}` : '';
    return `http://${window.location.hostname}${port}`;
  }
  
  // In production, use relative URLs to inherit the protocol from the page
  return '';
};

const createClient = () => {
    const baseURL = getBaseUrl();
    console.log(`Creating HTTP client with base URL: ${baseURL}`);
    
    const client = axios.create({
        baseURL
    });
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
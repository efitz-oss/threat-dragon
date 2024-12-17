import axios from 'axios';
import Vue from 'vue';
import { AUTH_SET_JWT } from '@/store/actions/auth.js';
import i18n from '@/i18n/index.js';
import { LOADER_FINISHED, LOADER_STARTED } from '@/store/actions/loader.js';
import router from '@/router/index.js';
import storeFactory from '@/store/index.js';

let cachedClient = null;

const get = () => {
    if (!cachedClient) {
        cachedClient = createClient();
    }
    return cachedClient;
};

const createClient = () => {
    const client = axios.create();
    
    // Set default headers
    client.defaults.headers.common.Accept = 'application/json';
    client.defaults.headers.post['Content-Type'] = 'application/json';

    // Request interceptor
    client.interceptors.request.use(
        (config) => {
            const store = storeFactory.get();
            store.dispatch(LOADER_STARTED);

            if (store.state.auth.jwt) {
                config.headers.authorization = `Bearer ${store.state.auth.jwt}`;
            }
            return config;
        },
        (error) => {
            const store = storeFactory.get();
            store.dispatch(LOADER_FINISHED);
            return Promise.reject(error);
        }
    );

    // Response interceptor
   // Response interceptor
   client.interceptors.response.use(
    (response) => {
        const store = storeFactory.get();
        store.dispatch(LOADER_FINISHED);
        return response;
    },
    async (error) => {
        const store = storeFactory.get();
        const refreshToken = store.state.auth.refreshToken;

        console.log('Starting error handling...');

        if (!refreshToken) {
            console.log('No refresh token found');
            store.dispatch(LOADER_FINISHED);
            return Promise.reject(error);
        }

        try {
            console.log('Attempting to refresh token...');
            
            const response = await fetch('/api/token/refresh', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${refreshToken}`
                },
                body: JSON.stringify({ refreshToken })
            });
    
            if (!response.ok) {
                throw new Error('Failed to refresh token');
            }

            // Log the entire response to inspect its structure
            const res = await response.json();
            console.log('Token refresh response:..', res);
            console.log('accessToken from refresh response:', res.data.accessToken);
            
            // Access tokens from the correct structure
            const tokens = {
                accessToken: response.data.data.accessToken,
                refreshToken: response.data.data.refreshToken
            };

            // Log the tokens object to see what we have
            console.log('Tokens object:', tokens);

            // Verify tokens exist
            if (!tokens.accessToken || !tokens.refreshToken) {
                throw new Error('Missing tokens in response');
            }

            console.log('Dispatching tokens to store...');
            await store.dispatch(AUTH_SET_JWT, tokens);
            console.log("Dispatched tokens", AUTH_SET_JWT, tokens);

            // Update the failed request config with new token
            console.log ("reaching here ----")
            error.config.headers.authorization = `Bearer ${tokens.accessToken}`;
            console.log("Dispatched tokens.jwt..", tokens.accessToken);
            
            // Retry the original request
            console.log ("now here ----")
            const retryResponse = await fetch(error.config.url, {
                method: error.config.method,
                headers: {
                    ...error.config.headers,
                    Authorization: `Bearer ${tokens.accessToken}`
                },
                body: error.config.data ? JSON.stringify(error.config.data) : undefined
            });
            console.log ("now here too ----")
            const retryData = await retryResponse.json();
            console.log("retryResp..........>", retryData);
            store.dispatch(LOADER_FINISHED);
            return retryData;

        } catch (refreshError) {
            console.error('Refresh token error:', refreshError);
            // Check if the error indicates that the refresh token is expired
            if (refreshError.response && refreshError.response.status === 401) {
                console.log('Refresh token expired or invalid');
                Vue.$toast.info(i18n.get().t('auth.sessionExpired'));
                router.get().push({ name: 'HomePage' }); // Redirect to login page
            } else {
                Vue.$toast.error(i18n.get().t('auth.refreshTokenError'));
            }
            return Promise.reject(error);

        } finally {
            store.dispatch(LOADER_FINISHED);
        }
    }
);

    return client;
};

export default {
    get,
    createClient // exposed for testing only
};
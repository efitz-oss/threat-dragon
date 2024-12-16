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
            
            const response = await axios.post(
                '/api/token/refresh',
                { refreshToken },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${refreshToken}`
                    }
                }
            );

            console.log('Token refresh response:', response.data);
            
            // Handle the token response
            const tokens = {
                jwt: response.data.accessToken,        // Changed this
                refreshToken: response.data.refreshToken  // Changed this
            };
            console.log ( "tokens------------> ", tokens)

            // Verify tokens exist
            if (!tokens.jwt || !tokens.refreshToken) {
                throw new Error('Missing tokens in response');
            }

            console.log('Dispatching tokens to store...');
            await store.dispatch(AUTH_SET_JWT, tokens);

            // Update the failed request config with new token
            error.config.headers.authorization = `Bearer ${tokens.jwt}`;  // Changed this
            
            // Retry the original request
            const retryResponse = await axios.request(error.config);
            store.dispatch(LOADER_FINISHED);
            return retryResponse;

        } catch (refreshError) {
            console.error('Refresh token error:', refreshError);
            Vue.$toast.info(i18n.get().t('auth.sessionExpired'));
            router.get().push({ name: 'HomePage' });
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
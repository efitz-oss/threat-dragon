import axios from 'axios';
import Vue from 'vue';

import { AUTH_SET_JWT } from '@/store/actions/auth.js';
import i18n from '@/i18n/index.js';
import { LOADER_FINISHED, LOADER_STARTED } from '@/store/actions/loader.js';
import router from '@/router/index.js';
import storeFactory from '@/store/index.js';

let cachedClient = null;

const get = () => {
    if (cachedClient === null) {
        cachedClient = createClient();
    }

    return cachedClient;
};

const createClient = () => {
    const client = axios.create();
    client.defaults.headers.common.Accept = 'application/json';
    client.defaults.headers.post['Content-Type'] = 'application/json';
    console.log('--------aham aham aham--------');
    client.interceptors.request.use((config) => {
        const store = storeFactory.get();
        store.dispatch(LOADER_STARTED);

        if (store.state.auth.jwt) {
            config.headers.authorization = `Bearer ${store.state.auth.jwt}`;
        }
        console.log('--------config config config--------',config);
        return config;
    }, (err) => {
        console.log('--------error error error--------');
        console.error(err);
        const store = storeFactory.get();
        store.dispatch(LOADER_FINISHED);
        return Promise.reject(err);
    });

    // Any status within 2xx lies here
    client.interceptors.response.use((resp) => {
        console.log('--------here i am--------');
        const store = storeFactory.get();
        store.dispatch(LOADER_FINISHED);
        console.log('--------resp resp resp--------', resp);
        return resp;
    }, async (err) => {
        const store = storeFactory.get();
    
        const logAndExit = () => {
            console.error('Error in interceptor:', err);
            store.dispatch(LOADER_FINISHED);
            return Promise.reject(err);
        };
    
        const refreshToken = store.state.auth.refreshToken;
        console.log('--------refreshToken--------', refreshToken);
        
        if (!refreshToken) {
            console.log('No refresh token available');
            return logAndExit();
        }
    
        try {
            console.log('Attempting to refresh token...');
            const response = await axios.post(
                '/api/token/refresh',
                { refreshToken },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${refreshToken}`,
                    }
                }
            );
    
            console.log('Token refresh response:', response.data);
            const tokens = response.data;
            
            await store.dispatch(AUTH_SET_JWT, tokens);
            
            // Update the failed request config with new token
            err.config.headers.authorization = `Bearer ${tokens.accessToken}`;
            
            // Retry the original request
            try {
                const retryResp = await axios.request(err.config);
                console.log('Retry successful:', retryResp);
                store.dispatch(LOADER_FINISHED);
                return retryResp;
            } catch (retryError) {
                console.error('Retry request failed:', retryError);
                return logAndExit();
            }
    
        } catch (refreshError) {
            console.error('Token refresh failed:', refreshError.response?.data || refreshError.message);
            Vue.$toast.info(i18n.get().t('auth.sessionExpired'));
            router.get().push({ name: 'HomePage' });
            return logAndExit();
        } finally {
            store.dispatch(LOADER_FINISHED);
        }
    });

    console.log( "client---------------", client)
    return client;
};

export default {
    createClient, // exposed for testing only
    get
};

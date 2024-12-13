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
        console.log('--------now here i am--------');
        store.dispatch(LOADER_FINISHED);
        console.log('--------resp resp resp--------', resp);
        return resp;
    }, async (err) => {
        const store = storeFactory.get();

        // const logAndExit = () => {
        //     console.log('--------logAndExit--------');
        //     console.error(err);
        //     console.error('logAndExit---------e:---------', err.response);
        //     store.dispatch(LOADER_FINISHED);
        //     return Promise.reject(err);
        // };

        // if (err.response.status !== 401) {
        //     console.log('--------logAndExit-err--------',err.response?.data);
        //     console.error('Error details:-------------', err);  // Detailed error log
        // console.error('Error Response:---------1', err.response); 
        // console.error('Error Response:---------2', err.response?.message); 
        // console.error('Error Response:---------3', err.response?.body);
        //     return logAndExit();
        // }

        const refreshToken = store.state.auth.refreshToken;
        console.log('--------refreshToken--------', refreshToken);
        if (!refreshToken) {
            console.log('--------refreshToken-error--------', refreshToken);
            return;
        }

        // Do not use this axios instance for the refresh token
        // Should this request fail and we use the same instance,
        // we could be stuck in an infinite loop
        try {
            console.log('--------did i reach here -------with token-', refreshToken);
            // const response = await axios.post('/api/token/refresh', { refreshToken });
            const response = await axios.post(
                '/api/token/refresh',
                { refreshToken }, // Check if this is how the backend expects it
                {
                    headers: {
                        'Content-Type': 'application/json',
                        // Authorization: `Bearer ${refreshToken}`, // Remove if unnecessary
                    },
                }
            );
            console.log('Response:', response.data);
            console.log('--------andh here too... --------');
            const tokens = response.data;
            console.log('--------did i get this token...1 --------tokens', tokens);
            // console.log('--------did i get this token... --------', tokens);
            store.dispatch(AUTH_SET_JWT, tokens);
            console.log('--------did i get this token...2 --------AUTH_SET_JWT', AUTH_SET_JWT);
            err.config.headers.authorization = `Bearer ${tokens.accessToken}`;
            const retryResp = await axios.request(err.config);
            console.log('--------did i get this token...2 --------', retryResp);
            store.dispatch(LOADER_FINISHED);
            console.log('--------retryResp retryResp retryResp--------LOADER_FINISHED', LOADER_FINISHED);
            return retryResp;
        } catch (error) {
            console.error('Token refresh failed:', error.response?.data || error.message);
            console.log('--------Error retrying Error retrying rError retrying--------', retryResp);
            console.warn('Error retrying after refresh token update');
            
            Vue.$toast.info(i18n.get().t('auth.sessionExpired'));
            router.get().push({ name: 'HomePage' });
            return await logAndExit();
        }
    });

    console.log( "client---------------", client)
    return client;
};

export default {
    createClient, // exposed for testing only
    get
};

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
        const store = storeFactory.get();
        store.dispatch(LOADER_FINISHED);
        console.log('--------resp resp resp--------', resp);
        return resp;
    }, async (err) => {
        const store = storeFactory.get();

        // const logAndExit = () => {
        //     console.error(err);
        //     store.dispatch(LOADER_FINISHED);
        //     return Promise.reject(err);
        // };

        if (err.response.status !== 401) {
            return logAndExit();
        }

        const refreshToken = store.state.auth.refreshToken;
        if (!refreshToken) {
            return;
        }

        // Do not use this axios instance for the refresh token
        // Should this request fail and we use the same instance,
        // we could be stuck in an infinite loop
        // try {
        //     const response = await axios.post('/api/token/refresh', { refreshToken });
        //     const tokens = response.data.data;
        //     store.dispatch(AUTH_SET_JWT, tokens);
        //     err.config.headers.authorization = `Bearer ${tokens.accessToken}`;
        //     const retryResp = await axios.request(err.config);
        //     store.dispatch(LOADER_FINISHED);
        //     console.log('--------retryResp retryResp retryResp--------', retryResp);
        //     return retryResp;
        // } catch (retryError) {
        //     console.log('--------Error retrying Error retrying rError retrying--------', retryResp);
        //     console.warn('Error retrying after refresh token update');
        //     console.warn(retryError);
        //     Vue.$toast.info(i18n.get().t('auth.sessionExpired'));
        //     router.get().push({ name: 'HomePage' });
        //     return await logAndExit();
        // }
    });

    console.log( "client---------------", client)
    return client;
};

export default {
    createClient, // exposed for testing only
    get
};

import axios from 'axios';
import Vue from 'vue';

import { AUTH_SET_JWT } from '@/store/actions/auth.js';
import i18n from '@/i18n/index.js';
import { LOADER_FINISHED, LOADER_STARTED } from '@/store/actions/loader.js';
import router from '@/router/index.js';
import storeFactory from '@/store/index.js';

let cachedClient = null;

const BASE_API_URL = process.env.APP_HOSTNAME || ''; // Use env variable for API base URL

const get = () => {
    if (cachedClient === null) {
        cachedClient = createClient();
    }
    return cachedClient;
};

const refreshAccessToken = async (refreshToken) => {
    const response = await axios.post(`${BASE_API_URL}/api/token/refresh`, { refreshToken });
    return response.data.data;
};

const createClient = () => {
    const client = axios.create({
        baseURL: BASE_API_URL,
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
    });

    client.interceptors.request.use((config) => {
        const store = storeFactory.get();
        store.dispatch(LOADER_STARTED);

        const token = store.state.auth.jwt;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    }, (error) => {
        console.error('[Request Error]', error);
        storeFactory.get().dispatch(LOADER_FINISHED);
        return Promise.reject(error);
    });

    client.interceptors.response.use((response) => {
        storeFactory.get().dispatch(LOADER_FINISHED);
        return response;
    }, async (error) => {
        const store = storeFactory.get();
        const { response } = error;

        if (!response || response.status !== 401) {
            store.dispatch(LOADER_FINISHED);
            console.error('[Response Error]', error);
            return Promise.reject(error);
        }

        const { refreshToken } = store.state.auth;
        if (!refreshToken) {
            Vue.$toast.info(i18n.get().t('auth.sessionExpired'));
            router.get().push({ name: 'HomePage' });
            store.dispatch(LOADER_FINISHED);
            return Promise.reject(error);
        }

        try {
            const tokens = await refreshAccessToken(refreshToken);
            store.dispatch(AUTH_SET_JWT, tokens);

            error.config.headers.Authorization = `Bearer ${tokens.accessToken}`;
            return client.request(error.config); // Retry original request
        } catch (refreshError) {
            console.error('[Token Refresh Error]', refreshError);
            Vue.$toast.info(i18n.get().t('auth.sessionExpired'));
            router.get().push({ name: 'HomePage' });
            store.dispatch(LOADER_FINISHED);
            return Promise.reject(refreshError);
        }
    });

    return client;
};

export default {
    createClient,
    get,
};

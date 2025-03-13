import axios from 'axios';
import { useToast } from 'primevue/usetoast';
import { useAuthStore } from '@/stores/auth';
import i18n from '@/i18n/index.js';
import { useLoaderStore } from '@/stores/loader';
import router from '@/router/index.js';

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

    client.interceptors.request.use(
        (config) => {
            const loaderStore = useLoaderStore();
            loaderStore.startLoading();

            const authStore = useAuthStore();
            if (authStore.jwt) {
                config.headers.authorization = `Bearer ${authStore.jwt}`;
            }

            return config;
        },
        (err) => {
            console.error(err);
            const loaderStore = useLoaderStore();
            loaderStore.finishLoading();
            return Promise.reject(err);
        }
    );

    // Any status within 2xx lies here
    client.interceptors.response.use(
        (resp) => {
            const loaderStore = useLoaderStore();
            loaderStore.finishLoading();
            return resp;
        },
        async (err) => {
            const loaderStore = useLoaderStore();
            const authStore = useAuthStore();

            const logAndExit = () => {
                console.error(err);
                loaderStore.finishLoading();
                return Promise.reject(err);
            };

            if (err.response.status !== 401) {
                return logAndExit();
            }

            const refreshToken = authStore.refreshToken;
            if (!refreshToken) {
                return logAndExit();
            }

            // Do not use this axios instance for the refresh token
            // Should this request fail and we use the same instance,
            // we could be stuck in an infinite loop
            try {
                const response = await axios.post('/api/token/refresh', { refreshToken });
                const tokens = response.data.data;
                authStore.setJwt(tokens);
                err.config.headers.authorization = `Bearer ${tokens.accessToken}`;
                const retryResp = await axios.request(err.config);
                loaderStore.finishLoading();
                return retryResp;
            } catch (retryError) {
                console.warn('Error retrying after refresh token update');
                console.warn(retryError);
                const toast = useToast();
                toast.add({ severity: 'info', summary: i18n.global.t('auth.sessionExpired') });
                router.push({ name: 'HomePage' });
                return await logAndExit();
            }
        }
    );

    return client;
};

export default {
    createClient, // exposed for testing only
    get,
};

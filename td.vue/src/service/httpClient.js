import axios from 'axios';
import Vue from 'vue';
import { AUTH_SET_JWT } from '@/store/actions/auth.js';
import i18n from '@/i18n/index.js';
import { LOADER_FINISHED, LOADER_STARTED } from '@/store/actions/loader.js';
import router from '@/router/index.js';
import storeFactory from '@/store/index.js';
import jwtDecode from 'jwt-decode';

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
   // Make sure to install this package

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
   
           // Check if the JWT is expired
           const jwt = store.state.auth.jwt; // Get the current JWT from the store
           if (jwt) {
               const decodedToken = jwtDecode(jwt);
               const currentTime = Date.now() / 1000; // Current time in seconds
   
               // If the token is expired, attempt to refresh it
               if (decodedToken.exp < currentTime) {
                   console.log('JWT is expired, attempting to refresh token...');
                   try {
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
   
                       // Access tokens from the correct structure
                       const tokens = {
                           accessToken: response.data.data.accessToken,
                           refreshToken: response.data.data.refreshToken
                       };
   
                       // Verify tokens exist
                       if (!tokens.accessToken || !tokens.refreshToken) {
                           throw new Error('Missing tokens in response');
                       }
   
                       console.log('Dispatching tokens to store...');
                       await store.dispatch(AUTH_SET_JWT, tokens);
   
                       // Update the failed request config with new token
                       error.config.headers.authorization = `Bearer ${tokens.accessToken}`;
                       console.log("Dispatched tokens.jwt..", tokens.accessToken);
                       
                       // Retry the original request
                       const retryResp = await axios.request(error.config);
                       console.log("retryResp..........>", retryResp);
                       store.dispatch(LOADER_FINISHED);
                       return retryResp;
   
                   } catch (refreshError) {
                       console.error('Refresh token error:', refreshError);
                       Vue.$toast.info(i18n.get().t('auth.sessionExpired'));
                       router.get().push({ name: 'HomePage' }); // Redirect to login page
                       return Promise.reject(error);
                   }
               }
           }
   
           // If the token is not expired, proceed with the original error handling
           console.error('Error during request:', error);
           store.dispatch(LOADER_FINISHED);
           return Promise.reject(error);
       }
   );
    return client;
};

export default {
    get,
    createClient // exposed for testing only
};
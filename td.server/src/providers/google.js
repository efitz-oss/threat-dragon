/**
 * @name google
 * @description Identity provider for Google OAuth
 */
import axios from 'axios';
import env from '../env/Env.js';
import loggerHelper from '../helpers/logger.helper.js';

const name = 'google';

/**
 * Determines if the Google provider is configured
 * @returns {Boolean}
 */
const isConfigured = () => Boolean(env.get().config.GOOGLE_CLIENT_ID);

/**
 * Gets the Google OAuth Login URL
 * @returns {String}
 */
const getOauthRedirectUrl = () => {
    const scope = 'openid email profile https://www.googleapis.com/auth/drive.file';
    const redirectUri = env.get().config.GOOGLE_REDIRECT_URI;
    const clientId = env.get().config.GOOGLE_CLIENT_ID;
    return `https://accounts.google.com/o/oauth2/auth?response_type=code&scope=${scope}&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}`;
};

/**
 * Gets the return URL for our application, returning from Google
 * @param {string} code
 * @returns {String}
 */
const getOauthReturnUrl = (code) => {
    let returnUrl = `/#/oauth-return?code=${code}`;
    if (env.get().config.NODE_ENV === 'development') {
        returnUrl = `http://localhost:8080${returnUrl}`;
    }
    return returnUrl;
};

/**
 * Finishes the OAuth login, issues a JWT
 * @param {String} code
 * @returns {String} jwt
 */
const completeLoginAsync = async (code) => {
        // Use the proper logger
        const googleLogger = loggerHelper.get('providers/google.js');
        googleLogger.info('=========== GOOGLE OAUTH TOKEN EXCHANGE START ===========');
        googleLogger.info('Starting Google completeLoginAsync with code:', code ? `${code.substring(0, 10)}...` : 'none');
        googleLogger.info(`Authorization code length: ${code?.length || 0}`);
 
        const url = `https://oauth2.googleapis.com/token`;
        googleLogger.info(`Token exchange URL: ${url}`);
        
        // Log configuration details
        googleLogger.info(`NODE_ENV: ${env.get().config.NODE_ENV}`);
        googleLogger.info(`Using redirect URI: ${env.get().config.GOOGLE_REDIRECT_URI}`);
        googleLogger.info(`Google client ID configured: ${Boolean(env.get().config.GOOGLE_CLIENT_ID)}`);
        googleLogger.info(`Google client ID length: ${env.get().config.GOOGLE_CLIENT_ID?.length || 0}`);
        googleLogger.info(`Google client secret configured: ${Boolean(env.get().config.GOOGLE_CLIENT_SECRET)}`);
        googleLogger.info(`Google client secret length: ${env.get().config.GOOGLE_CLIENT_SECRET?.length || 0}`);
        
        // Validate required configuration
        if (!env.get().config.GOOGLE_CLIENT_ID) {
            const error = new Error('Google OAuth client ID is not configured');
            googleLogger.error(error.message);
            throw error;
        }
        
        if (!env.get().config.GOOGLE_CLIENT_SECRET) {
            const error = new Error('Google OAuth client secret is not configured');
            googleLogger.error(error.message);
            throw error;
        }
        
        if (!env.get().config.GOOGLE_REDIRECT_URI) {
            const error = new Error('Google OAuth redirect URI is not configured');
            googleLogger.error(error.message);
            throw error;
        }
        
        const body = {
            client_id: env.get().config.GOOGLE_CLIENT_ID,
            client_secret: env.get().config.GOOGLE_CLIENT_SECRET,
            code,
            grant_type: 'authorization_code',
            redirect_uri: env.get().config.GOOGLE_REDIRECT_URI
        };
        
        googleLogger.info('Request body prepared with code and required parameters');
        
        const options = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        };
        
        try {
            googleLogger.info('Sending token request to Google OAuth endpoint');
            googleLogger.info(`Request URL: ${url}`);
            googleLogger.info(`Request method: POST`);
            googleLogger.info(`Request headers: ${JSON.stringify(options.headers)}`);
            
            const providerResp = await axios.post(url, new URLSearchParams(body), options);
            
            googleLogger.info('Received token response from Google');
            googleLogger.info(`Response status: ${providerResp.status}`);
            googleLogger.info(`Response has access_token: ${Boolean(providerResp.data?.access_token)}`);
            googleLogger.info(`Response has refresh_token: ${Boolean(providerResp.data?.refresh_token)}`);
            googleLogger.info(`Response has id_token: ${Boolean(providerResp.data?.id_token)}`);
            googleLogger.info(`Response has token_type: ${providerResp.data?.token_type || 'none'}`);
            googleLogger.info(`Response has expires_in: ${providerResp.data?.expires_in || 'none'}`);
            
            if (!providerResp.data || !providerResp.data.access_token) {
                googleLogger.error('No access token in Google response:', JSON.stringify(providerResp.data || {}));
                throw new Error('No access token received from Google');
            }
            
            googleLogger.info('Successfully obtained access token, fetching user info');
            const tokenInfoUrl = `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${providerResp.data.access_token}`;
            googleLogger.info(`User info URL: ${tokenInfoUrl}`);
            
            try {
                const userInfo = await axios.get(tokenInfoUrl);
                googleLogger.info('Successfully fetched user info');
                googleLogger.info(`User info status: ${userInfo.status}`);
                googleLogger.info(`User info has name: ${Boolean(userInfo.data?.name)}`);
                googleLogger.info(`User info has email: ${Boolean(userInfo.data?.email)}`);
                googleLogger.info(`User info has picture: ${Boolean(userInfo.data?.picture)}`);
                
                const user = {
                    username: userInfo.data.name,
                    email: userInfo.data.email,
                    picture: userInfo.data.picture
                };
                
                googleLogger.info(`Created user object with username: ${user.username}`);
                googleLogger.info(`Created user object with email: ${user.email}`);
                googleLogger.info('=========== GOOGLE OAUTH TOKEN EXCHANGE COMPLETE ===========');
                
                return {
                    user,
                    opts: providerResp.data
                };
            } catch (userInfoError) {
                googleLogger.error('Error fetching user info from Google:', userInfoError.message);
                if (userInfoError.response) {
                    googleLogger.error('User info response status:', userInfoError.response.status);
                    googleLogger.error('User info response data:', JSON.stringify(userInfoError.response.data || {}));
                }
                throw new Error(`Failed to fetch user info: ${userInfoError.message}`);
            }
        } catch (error) {
            googleLogger.error('Error in Google OAuth flow:', error.message);
            googleLogger.error('Error stack:', error.stack);
            
            if (error.response) {
                googleLogger.error('Response status:', error.response.status);
                googleLogger.error('Response data:', JSON.stringify(error.response.data || {}));
                googleLogger.error('Response headers:', JSON.stringify(error.response.headers || {}));
            } else if (error.request) {
                googleLogger.error('No response received from Google. Request details:');
                googleLogger.error('Request method: POST');
                googleLogger.error(`Request URL: ${url}`);
            }
            
            googleLogger.error('=========== GOOGLE OAUTH TOKEN EXCHANGE FAILED ===========');
            throw error;
        }
};

export default {
    completeLoginAsync,
    getOauthReturnUrl,
    getOauthRedirectUrl,
    isConfigured,
    name
};
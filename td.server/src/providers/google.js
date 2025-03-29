/**
 * @name google
 * @description Identity provider for Google OAuth
 */
import axios from 'axios';
import env from '../env/Env.js';

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
        const logger = console;
        logger.log('Starting Google completeLoginAsync with code:', code ? `${code.substring(0, 10)}...` : 'none');
 
        const url = `https://oauth2.googleapis.com/token`;
        const body = {
            client_id: env.get().config.GOOGLE_CLIENT_ID,
            client_secret: env.get().config.GOOGLE_CLIENT_SECRET,
            code,
            grant_type: 'authorization_code',
            redirect_uri: env.get().config.GOOGLE_REDIRECT_URI
        };
        const options = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        };

        logger.log('Using redirect URI:', env.get().config.GOOGLE_REDIRECT_URI);
        logger.log('Google client ID length:', env.get().config.GOOGLE_CLIENT_ID?.length || 0);
        logger.log('Google client secret length:', env.get().config.GOOGLE_CLIENT_SECRET?.length || 0);
        
        try {
            logger.log('Sending token request to Google OAuth endpoint');
            const providerResp = await axios.post(url, new URLSearchParams(body), options);
            logger.log('Received token response from Google');
            
            if (providerResp.data.access_token) {
                logger.log('Successfully obtained access token, fetching user info');
                const tokenInfoUrl = `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${providerResp.data.access_token}`;
                const userInfo = await axios.get(tokenInfoUrl);
                logger.log('Successfully fetched user info');
                
                const user = {
                    username: userInfo.data.name,
                    email: userInfo.data.email,
                    picture: userInfo.data.picture
                };
                
                logger.log('Returning user info for:', user.username);
                return {
                    user,
                    opts: providerResp.data
                };
            } else {
                logger.error('No access token in Google response:', JSON.stringify(providerResp.data));
                throw new Error('No access token received from Google');
            }
        } catch (error) {
            logger.error('Error in Google OAuth flow:', error.message);
            if (error.response) {
                logger.error('Response status:', error.response.status);
                logger.error('Response data:', JSON.stringify(error.response.data));
            }
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
import api from './api.js';
import logger from '@/utils/logger.js';

// Create a context-specific logger
const log = logger.getLogger('api:login');

const loginAsync = (provider) => api.getAsync(`/api/login/${provider}`);

const completeLoginAsync = async (provider, code) => {
    log.info('Making completeLoginAsync request', { endpoint: `/api/oauth/${provider}/completeLogin` });

    // Ensure code is valid before making the API call
    if (!code) {
        log.error('completeLoginAsync: No authorization code provided');
        throw new Error('No authorization code provided');
    }

    // Don't log the full code for security
    log.info('Authorization code validation', {
        codePresent: Boolean(code),
        codeLength: code.length
    });

    try {
        log.debug('API request details', {
            baseUrl: window.location.origin,
            endpoint: `/api/oauth/${provider}/completeLogin`
        });
        const url = `/api/oauth/${provider}/completeLogin`;

        // Make the API call with explicit content type headers
        log.debug('Sending request', {
            method: 'POST',
            payload: { code: 'REDACTED' }
        });

        const response = await api.postAsync(url, { code });

        // API service already handles status codes and parsing
        log.debug('Response received from API service');

        // Standard response format should include data property
        const data = response.data;

        // Log success but not the actual tokens for security
        log.info('Response data validation', {
            hasData: Boolean(data),
            dataType: typeof data,
            accessTokenPresent: Boolean(data?.accessToken),
            refreshTokenPresent: Boolean(data?.refreshToken)
        });

        // Validate response format
        if (!data || !data.accessToken || !data.refreshToken) {
            log.error('Invalid response format, missing tokens', {
                hasData: Boolean(data),
                hasAccessToken: Boolean(data?.accessToken),
                hasRefreshToken: Boolean(data?.refreshToken),
                responseKeys: data ? Object.keys(data) : []
            });
            throw new Error('Invalid server response format (missing token data)');
        }

        return data; // Expecting { accessToken, refreshToken }
    } catch (error) {
        log.error('Error in completeLoginAsync API call', {
            message: error.message,
            ...(error.response ? {
                status: error.response.status,
                statusText: error.response.statusText,
                headers: error.response.headers,
                data: error.response.data
            } : {}),
            ...(error.request ? {
                requestSent: true,
                method: 'POST',
                url: `/api/oauth/${provider}/completeLogin`
            } : {})
        });
        throw error;
    }
};

const logoutAsync = (refreshToken) => api.postAsync('/api/logout', { refreshToken });

export default {
    completeLoginAsync,
    loginAsync,
    logoutAsync
};

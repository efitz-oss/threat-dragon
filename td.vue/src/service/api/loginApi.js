import api from './api.js';

const loginAsync = (provider) => api.getAsync(`/api/login/${provider}`);

const completeLoginAsync = async (provider, code) => {
    console.log(`Making completeLoginAsync request to /api/oauth/${provider}/completeLogin`);
    
    // Ensure code is valid before making the API call
    if (!code) {
        console.error('completeLoginAsync: No authorization code provided');
        throw new Error('No authorization code provided');
    }
    
    // Don't log the full code for security
    console.log('Authorization code present:', Boolean(code));
    
    try {
        // Make the API call with explicit content type headers
        const response = await api.postAsync(`/api/oauth/${provider}/completeLogin`, { code });
        // Log success but not the actual tokens for security
        console.log('completeLoginAsync response received with tokens:', 
            response && response.data ? {
                accessTokenPresent: Boolean(response.data.accessToken),
                refreshTokenPresent: Boolean(response.data.refreshToken)
            } : 'no data');
        
        // Validate response format
        if (!response || !response.data || !response.data.accessToken || !response.data.refreshToken) {
            console.error('completeLoginAsync: Invalid response format, missing tokens', response);
            throw new Error('Invalid server response format');
        }
        
        return response.data; // Expecting { accessToken, refreshToken }
    } catch (error) {
        console.error('Error in completeLoginAsync API call:', error);
        console.error('Error details:', error.response?.data || error.message);
        throw error;
    }
};

const logoutAsync = (refreshToken) => api.postAsync('/api/logout', { refreshToken });

export default {
    completeLoginAsync,
    loginAsync,
    logoutAsync
};

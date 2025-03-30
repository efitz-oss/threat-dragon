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
    console.log('Authorization code length:', code.length);
    
    try {
        console.log('API base URL:', window.location.origin);
        const url = `/api/oauth/${provider}/completeLogin`;
        console.log('Full request URL:', window.location.origin + url);
        
        // Make the API call with explicit content type headers
        console.log('Sending POST with payload:', { code: 'REDACTED' });
        
        const response = await api.postAsync(url, { code });
        
        // Log success but not the actual tokens for security
        console.log('completeLoginAsync response received:', {
            status: response?.status,
            statusText: response?.statusText,
            hasData: Boolean(response?.data),
            dataType: response?.data ? typeof response.data : 'none',
            accessTokenPresent: response?.data?.accessToken ? 'yes' : 'no',
            refreshTokenPresent: response?.data?.refreshToken ? 'yes' : 'no'
        });
        
        // Validate response format
        if (!response || !response.data || !response.data.accessToken || !response.data.refreshToken) {
            console.error('completeLoginAsync: Invalid response format, missing tokens', {
                hasResponse: Boolean(response),
                hasData: Boolean(response?.data),
                hasAccessToken: Boolean(response?.data?.accessToken),
                hasRefreshToken: Boolean(response?.data?.refreshToken)
            });
            throw new Error('Invalid server response format');
        }
        
        return response.data; // Expecting { accessToken, refreshToken }
    } catch (error) {
        console.error('Error in completeLoginAsync API call:', error.message);
        if (error.response) {
            console.error('Response status:', error.response.status);
            console.error('Response status text:', error.response.statusText);
            console.error('Response headers:', JSON.stringify(error.response.headers));
            console.error('Response data:', error.response.data);
        } else if (error.request) {
            console.error('No response received. Request details:', {
                method: 'POST',
                url: `/api/oauth/${provider}/completeLogin`
            });
        }
        throw error;
    }
};

const logoutAsync = (refreshToken) => api.postAsync('/api/logout', { refreshToken });

export default {
    completeLoginAsync,
    loginAsync,
    logoutAsync
};

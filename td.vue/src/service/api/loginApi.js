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
        
        // Make direct fetch call for debugging
        console.log('Using direct fetch for more control and debugging');
        
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ code })
        });
        
        console.log('Raw response status:', response.status);
        console.log('Raw response status text:', response.statusText);
        console.log('Raw response headers:', [...response.headers.entries()].map(([key, value]) => `${key}: ${value}`).join(', '));
        
        // Parse response JSON
        const responseData = await response.json();
        console.log('Response parsed successfully');
        
        // Check for API error format
        if (responseData.error) {
            console.error('Error returned from API:', responseData.error);
            throw new Error(responseData.error);
        }
        
        // Standard response format should include data property
        const data = responseData.data || responseData;
        
        // Log success but not the actual tokens for security
        console.log('completeLoginAsync response data:', {
            hasData: Boolean(data),
            dataType: typeof data,
            accessTokenPresent: Boolean(data?.accessToken),
            refreshTokenPresent: Boolean(data?.refreshToken)
        });
        
        // Validate response format
        if (!data || !data.accessToken || !data.refreshToken) {
            console.error('completeLoginAsync: Invalid response format, missing tokens', {
                hasData: Boolean(data),
                hasAccessToken: Boolean(data?.accessToken),
                hasRefreshToken: Boolean(data?.refreshToken),
                responseKeys: data ? Object.keys(data) : []
            });
            throw new Error('Invalid server response format (missing token data)');
        }
        
        return data; // Expecting { accessToken, refreshToken }
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

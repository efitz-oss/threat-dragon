import api from './api.js';

const loginAsync = (provider) => api.getAsync(`/api/login/${provider}`);

const completeLoginAsync = async (provider, code) => {
    console.log(`Making completeLoginAsync request to /api/oauth/${provider}/completeLogin`);
    const response = await api.postAsync(`/api/oauth/${provider}/completeLogin`, { code });
    console.log('completeLoginAsync response received:', response);
    
    // Validate response format
    if (!response.data || !response.data.accessToken || !response.data.refreshToken) {
        console.error('completeLoginAsync: Invalid response format, missing tokens', response);
        throw new Error('Invalid server response format');
    }
    
    return response.data; // Expecting { accessToken, refreshToken }
};

const logoutAsync = (refreshToken) => api.postAsync('/api/logout', { refreshToken });

export default {
    completeLoginAsync,
    loginAsync,
    logoutAsync
};

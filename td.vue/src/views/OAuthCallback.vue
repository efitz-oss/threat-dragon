<template>
  <div>Processing OAuth callback...</div>
</template>

<script>
import { useStore } from 'vuex'; // Import the Vuex store
import { onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import loginAPI from '@/service/api/loginApi.js';

export default {
    setup() {
        const store = useStore(); // Initialize the store
        const router = useRouter();
        const route = useRoute();

        onMounted(async () => {
            console.log('OAuthCallback.vue mounted');
            
            // Instead of using search params which might be empty, 
            // check if the URL has a hash fragment and extract code from there
            let code;
            if (window.location.hash && window.location.hash.includes('?code=')) {
                const hashParams = new URLSearchParams(window.location.hash.split('?')[1]);
                code = hashParams.get('code');
                console.log('Found code in hash fragment:', code ? 'Yes (redacted for security)' : 'none');
            } else {
                code = new URLSearchParams(window.location.search).get('code');
                console.log('Found code in search params:', code ? 'Yes (redacted for security)' : 'none');
            }
            
            // Assume Google provider when we're in the OAuth callback with a code
            // This is a fallback in case the provider isn't in the store
            let provider = store.state.provider.selected; 
            
            console.log('Provider from store:', provider);
            if (!provider) {
                // We know we're coming from a Google login flow based on the recent changes
                console.warn('Missing provider in Vuex store. Defaulting to "google"');
                provider = 'google';
                
                // Set the provider in the store to ensure consistency
                store.dispatch('PROVIDER_SELECTED', 'google');
            }

            if (code) {
                try {
                    console.log('Completing login with provider:', provider, 'and code: [REDACTED]');
                    // Send the provider and authorization code to the backend
                    console.log('About to call completeLoginAsync with provider:', provider);
                    const response = await loginAPI.completeLoginAsync(provider, code);
                    console.log('Login completed successfully, tokens received:', {
                        accessToken: response && response.accessToken ? 'present (redacted)' : 'missing',
                        refreshToken: response && response.refreshToken ? 'present (redacted)' : 'missing'
                    });

                    // Dispatch the AUTH_SET_JWT action to set the tokens in the store
                    store.dispatch('AUTH_SET_JWT', response); 
                    console.log('JWT set in store, redirecting to dashboard');

                    // Redirect to a secure page or dashboard
                    console.log('About to redirect to MainDashboard...');
                    router.push({ name: 'MainDashboard' })
                      .then(() => console.log('Navigation to MainDashboard complete'))
                      .catch(navError => console.error('Navigation error:', navError));
                } catch (error) {
                    console.error('Error completing login:', error);
                    console.error('Error details:', error.response?.data || error.message);
                    
                    // Provide more specific error message
                    let errorMessage = 'Login failed. ';
                    
                    if (error.message.includes('No authorization code')) {
                        errorMessage += 'No authorization code was received from Google.';
                    } else if (error.message.includes('Invalid server response')) {
                        errorMessage += 'Server returned an invalid response.';
                    } else if (error.response && error.response.status) {
                        errorMessage += `Server returned error code ${error.response.status}.`;
                    } else {
                        errorMessage += 'Please try again.';
                    }
                    
                    alert(errorMessage);
                    
                    // Clear provider to force fresh login
                    store.dispatch('PROVIDER_CLEAR');
                    router.push({ name: 'HomePage' });
                }
            } else {
                console.error('Authorization code not found.');
                router.push({ name: 'HomePage' });
            }
        });
    },
};
</script>

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
            const code = new URLSearchParams(window.location.search).get('code');
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
                    console.log('Completing login with provider:', provider, 'and code:', code.substring(0, 5) + '...');
                    // Send the provider and authorization code to the backend
                    console.log('About to call completeLoginAsync with provider:', provider);
                    const response = await loginAPI.completeLoginAsync(provider, code);
                    console.log('Login completed successfully, received response:', JSON.stringify(response));

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
                    // Stay on the callback page but display an error message
                    alert('Login failed. Please try again.');
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

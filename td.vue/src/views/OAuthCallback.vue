<template>
  <div class="oauth-callback-container">
    <h3>Processing OAuth callback...</h3>
    <div v-if="authCode" class="manual-login-section">
      <p>If automatic login is not working, you can try manual login:</p>
      <button @click="manualLogin" class="btn btn-primary">
        Complete Login Manually
      </button>
      <div v-if="errorMessage" class="alert alert-danger mt-3">
        {{ errorMessage }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.oauth-callback-container {
  max-width: 600px;
  margin: 40px auto;
  padding: 20px;
  text-align: center;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  background-color: white;
}

.manual-login-section {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #eee;
}
</style>

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
        
        // Track the authorization code to enable manual login button
        let authCode = '';
        // Track error message for display
        let errorMessage = '';

        onMounted(async () => {
            console.log('OAuthCallback.vue mounted');
            
            // Log full URL for debugging (no auth codes will be exposed)
            console.log('OAuthCallback mounted with URL:', window.location.href.replace(/code=[^&]+/, 'code=REDACTED'));
            console.log('Hash fragment:', window.location.hash.replace(/code=[^&]+/, 'code=REDACTED'));
            
            // Instead of using search params which might be empty, 
            // check if the URL has a hash fragment and extract code from there
            let code;
            
            // Try extracting from hash fragment
            if (window.location.hash) {
                console.log('Checking hash fragment for code...');
                
                // Special handling for the SPA redirect format with '#/'
                if (window.location.hash.includes('#/oauth-return?code=')) {
                    console.log('Found oauth-return pattern in hash');
                    const parts = window.location.hash.split('#/oauth-return?');
                    if (parts.length > 1) {
                        const hashParams = new URLSearchParams(parts[1]);
                        code = hashParams.get('code');
                        console.log('Extracted code from hash oauth-return:', code ? 'Yes (redacted for security)' : 'none');
                    }
                } 
                // Also check for simpler hash fragment
                else if (window.location.hash.includes('?code=')) {
                    console.log('Found ?code= pattern in hash');
                    const hashParams = new URLSearchParams(window.location.hash.split('?')[1]);
                    code = hashParams.get('code');
                    console.log('Extracted code from hash with ?code=:', code ? 'Yes (redacted for security)' : 'none');
                } 
                // Handle case where hash contains just the code
                else if (window.location.hash.startsWith('#code=')) {
                    console.log('Found #code= pattern');
                    const hashParams = new URLSearchParams(window.location.hash.substring(1));
                    code = hashParams.get('code');
                    console.log('Extracted code from #code=:', code ? 'Yes (redacted for security)' : 'none');
                }
            }
            
            // Fall back to search parameters if hash doesn't contain code
            if (!code) {
                console.log('No code found in hash, checking search params...');
                code = new URLSearchParams(window.location.search).get('code');
                console.log('Found code in search params:', code ? 'Yes (redacted for security)' : 'none');
            }
            
            // Save the code for the manual login button
            authCode = code;
            
            // Get provider info
            console.log('Store state available:', Boolean(store && store.state));
            console.log('Provider in store:', store?.state?.provider ? JSON.stringify(store.state.provider) : 'null');
            
            // Assume Google provider when we're in the OAuth callback with a code
            // This is a fallback in case the provider isn't in the store
            let provider = store.state?.provider?.selected || null;
            
            console.log('Provider from store:', provider);
            
            // Hard-code to Google for this flow
            // This ensures we don't need to rely on store state persistence
            console.warn('Setting provider to "google" for OAuth callback');
            provider = 'google';
            
            // Set the provider in the store to ensure consistency
            store.dispatch('PROVIDER_SELECTED', 'google');

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
                    errorMessage = 'Login failed. ';
                    
                    if (error.message.includes('No authorization code')) {
                        errorMessage += 'No authorization code was received from Google.';
                    } else if (error.message.includes('Invalid server response')) {
                        errorMessage += 'Server returned an invalid response.';
                    } else if (error.response && error.response.status) {
                        errorMessage += `Server returned error code ${error.response.status}.`;
                    } else {
                        errorMessage += 'Please try again or use the manual login button.';
                    }
                    
                    // Don't redirect to homepage - show the manual login button instead
                    console.log('Login failed, displaying manual login button');
                }
            } else {
                console.error('Authorization code not found.');
                router.push({ name: 'HomePage' });
            }
        });
        
        // Manual login function for the fallback button
        const manualLogin = async () => {
            try {
                console.log('Manual login initiated');
                
                // Hard-code to Google for this flow
                const provider = 'google';
                
                // Set the provider in the store
                console.log('Setting provider to google');
                store.dispatch('PROVIDER_SELECTED', 'google');
                
                // Reset error message
                errorMessage = '';
                
                // Only proceed if we have an authorization code
                if (!authCode) {
                    errorMessage = 'No authorization code available.';
                    return;
                }
                
                console.log('Making manual login API call');
                const response = await loginAPI.completeLoginAsync(provider, authCode);
                
                console.log('Manual login successful, setting JWT');
                store.dispatch('AUTH_SET_JWT', response);
                
                // Navigate to dashboard
                console.log('Redirecting to dashboard');
                router.push({ name: 'MainDashboard' });
            } catch (error) {
                console.error('Manual login failed:', error);
                
                // Set error message for display
                errorMessage = 'Manual login failed: ' + (error.response?.data?.message || error.message);
            }
        };
        
        return {
            authCode,
            errorMessage,
            manualLogin
        };
    },
};
</script>

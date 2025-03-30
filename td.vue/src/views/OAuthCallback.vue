<template>
  <div class="oauth-callback-container">
    <h3>{{ statusMessage }}</h3>
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
import { useStore } from 'vuex';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import loginAPI from '@/service/api/loginApi.js';

export default {
    setup() {
        const store = useStore();
        const router = useRouter();
        
        // Create reactive references for the component state
        const authCode = ref('');
        const errorMessage = ref('');
        const statusMessage = ref('Processing OAuth callback...');
        
        const extractAuthorizationCode = () => {
            let code = null;
            
            // First check the URL hash for an authorization code
            const hash = window.location.hash;
            console.log('URL hash:', hash ? hash.replace(/code=[^&]+/, 'code=REDACTED') : 'none');
            
            if (hash) {
                // Try format: #/oauth-return?code=xyz
                if (hash.includes('#/oauth-return?code=')) {
                    const parts = hash.split('#/oauth-return?');
                    if (parts.length > 1) {
                        const params = new URLSearchParams(parts[1]);
                        code = params.get('code');
                    }
                }
                // Try format: #code=xyz or #?code=xyz
                else if (hash.includes('code=')) {
                    const hashContent = hash.startsWith('#?') 
                        ? hash.substring(2) 
                        : (hash.startsWith('#') ? hash.substring(1) : hash);
                    
                    const params = new URLSearchParams(hashContent);
                    code = params.get('code');
                }
            }
            
            // If no code in hash, check search params
            if (!code) {
                const search = window.location.search;
                console.log('URL search:', search ? search.replace(/code=[^&]+/, 'code=REDACTED') : 'none');
                
                if (search) {
                    const params = new URLSearchParams(search);
                    code = params.get('code');
                }
            }
            
            console.log('Authorization code found:', Boolean(code));
            if (code) {
                console.log('Code length:', code.length);
            }
            
            return code;
        };
        
        const completeLogin = async (code) => {
            try {
                statusMessage.value = 'Completing login...';
                
                // Always use google as the provider for OAuth callback
                const provider = 'google';
                store.dispatch('PROVIDER_SELECTED', provider);
                
                // Complete the login process with the authorization code
                console.log(`Completing login with provider: ${provider}`);
                const response = await loginAPI.completeLoginAsync(provider, code);
                
                // Store the JWT tokens
                console.log('Login completed successfully, storing tokens');
                store.dispatch('AUTH_SET_JWT', response);
                
                // Redirect to dashboard
                statusMessage.value = 'Login successful, redirecting...';
                router.push({ name: 'MainDashboard' });
                
                return true;
            } catch (error) {
                console.error('Login error:', error);
                
                let errorMsg = 'Login failed. ';
                if (error.message.includes('No authorization code')) {
                    errorMsg += 'No authorization code was received.';
                } else if (error.message.includes('Invalid server response')) {
                    errorMsg += 'Server returned an invalid response.';
                } else if (error.response && error.response.status) {
                    errorMsg += `Server returned error code ${error.response.status}.`;
                } else {
                    errorMsg += 'Please try the manual login button below.';
                }
                
                errorMessage.value = errorMsg;
                statusMessage.value = 'Automatic login failed';
                
                return false;
            }
        };
        
        onMounted(async () => {
            console.log('OAuthCallback component mounted');
            
            // Extract authorization code from URL
            const code = extractAuthorizationCode();
            
            // Store the code for potential manual login
            authCode.value = code;
            
            if (code) {
                // Attempt automatic login
                await completeLogin(code);
            } else {
                console.error('No authorization code found in URL');
                errorMessage.value = 'No authorization code found in URL.';
                statusMessage.value = 'Login failed';
            }
        });
        
        const manualLogin = async () => {
            if (!authCode.value) {
                errorMessage.value = 'No authorization code available for manual login.';
                return;
            }
            
            // Clear previous error
            errorMessage.value = '';
            
            // Attempt login with stored code
            await completeLogin(authCode.value);
        };
        
        return {
            authCode,
            errorMessage,
            statusMessage,
            manualLogin
        };
    }
};
</script>
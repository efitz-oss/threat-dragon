<template>
  <div class="oauth-callback-container">
    <h3>{{ statusMessage }}</h3>
    <div v-if="paused && !completed" class="pause-section">
      <p>The OAuth process is paused so you can check the console logs.</p>
      <button @click="resumeProcess" class="btn btn-primary">
        Continue Login Process
      </button>
    </div>
    <div v-if="!completed && authCode" class="manual-login-section">
      <p>If automatic login is not working, you can try manual login:</p>
      <button @click="manualLogin" class="btn btn-primary">
        Complete Login Manually
      </button>
    </div>
    <div v-if="errorMessage" class="alert alert-danger mt-3">
      {{ errorMessage }}
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

.manual-login-section, .pause-section {
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
        const statusMessage = ref('OAuth callback paused for debugging');
        const paused = ref(true);
        const completed = ref(false);
        
        const extractAuthorizationCode = () => {
            let code = null;
            
            // Log the full URL (with code redacted for security)
            const fullUrl = window.location.href.replace(/code=[^&]+/, 'code=REDACTED');
            console.log(`Current URL: ${fullUrl}`);
            
            // First check the URL hash for an authorization code
            const hash = window.location.hash;
            console.log('URL hash fragment:', hash ? hash.replace(/code=[^&]+/, 'code=REDACTED') : 'none');
            
            if (hash) {
                // Try format: #/oauth-return?code=xyz
                if (hash.includes('#/oauth-return?code=')) {
                    console.log('Found oauth-return pattern in hash');
                    const parts = hash.split('#/oauth-return?');
                    if (parts.length > 1) {
                        const params = new URLSearchParams(parts[1]);
                        code = params.get('code');
                    }
                }
                // Try format: #code=xyz or #?code=xyz
                else if (hash.includes('code=')) {
                    console.log('Found code= pattern in hash');
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
                console.log('URL search params:', search ? search.replace(/code=[^&]+/, 'code=REDACTED') : 'none');
                
                if (search) {
                    const params = new URLSearchParams(search);
                    code = params.get('code');
                }
            }
            
            console.log(`Authorization code found: ${Boolean(code)}`);
            if (code) {
                console.log(`Code length: ${code.length}`);
            }
            
            return code;
        };
        
        const completeLogin = async (code) => {
            try {
                statusMessage.value = 'Completing login...';
                
                // Always use google as the provider for OAuth callback
                const provider = 'google';
                console.log(`Setting provider to: ${provider}`);
                store.dispatch('PROVIDER_SELECTED', provider);
                
                // Complete the login process with the authorization code
                console.log(`Completing login with provider: ${provider}`);
                console.log(`Making API call to: /api/oauth/${provider}/completeLogin`);
                
                const response = await loginAPI.completeLoginAsync(provider, code);
                
                console.log('Login completed successfully, response received');
                console.log('Response contains tokens:', {
                    accessToken: Boolean(response?.accessToken),
                    refreshToken: Boolean(response?.refreshToken)
                });
                
                // Store the JWT tokens
                console.log('Storing tokens in Vuex store');
                store.dispatch('AUTH_SET_JWT', response);
                
                // Redirect to dashboard
                statusMessage.value = 'Login successful, redirecting...';
                completed.value = true;
                
                console.log('Redirecting to dashboard');
                router.push({ name: 'MainDashboard' });
                
                return true;
            } catch (error) {
                console.error('Login error:', error);
                console.error('Error details:', error.response?.data || error.message);
                
                let errorMsg = 'Login failed. ';
                if (error.message.includes('No authorization code')) {
                    errorMsg += 'No authorization code was received.';
                } else if (error.message.includes('Invalid server response')) {
                    errorMsg += 'Server returned an invalid response.';
                } else if (error.response && error.response.status) {
                    errorMsg += `Server returned error code ${error.response.status}.`;
                } else {
                    errorMsg += 'Please try the manual login button.';
                }
                
                errorMessage.value = errorMsg;
                statusMessage.value = 'Automatic login failed';
                
                return false;
            }
        };
        
        const resumeProcess = async () => {
            paused.value = false;
            statusMessage.value = 'Resuming OAuth process...';
            
            if (authCode.value) {
                // Attempt automatic login
                await completeLogin(authCode.value);
            } else {
                console.error('No authorization code found in URL');
                errorMessage.value = 'No authorization code found in URL.';
                statusMessage.value = 'Login failed';
            }
        };
        
        onMounted(async () => {
            console.log('OAuthCallback component mounted');
            
            // Extract authorization code from URL
            const code = extractAuthorizationCode();
            
            // Store the code for later use
            authCode.value = code;
            
            // Don't auto-complete - wait for user to click button
            if (!code) {
                console.error('No authorization code found in URL');
                errorMessage.value = 'No authorization code found in URL.';
                statusMessage.value = 'Login failed';
                paused.value = false;
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
            paused,
            completed,
            manualLogin,
            resumeProcess
        };
    }
};
</script>
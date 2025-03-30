<template>
  <div class="oauth-container">
    <div class="card">
      <div class="card-body text-center">
        <h3>{{ statusMessage }}</h3>
        <div v-if="errorOccurred" class="mt-4 alert alert-danger">
          <p><strong>Error:</strong> {{ errorMessage }}</p>
          <p>Please close this page and try again.</p>
        </div>
        <div v-if="debugInfo.length > 0" class="mt-4 debug-section">
          <h5>Debug Information</h5>
          <pre class="debug-info">{{ debugInfo.join('\n') }}</pre>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import loginAPI from '@/service/api/loginApi.js';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { onMounted, ref } from 'vue';

export default {
  setup() {
    const router = useRouter();
    const store = useStore();
    const statusMessage = ref('Processing login...');
    const errorMessage = ref('');
    const errorOccurred = ref(false);
    const debugInfo = ref([]);

    const log = (message) => {
      console.log(message);
      debugInfo.value.push(`[${new Date().toISOString()}] ${message}`);
    };

    const handleOAuthCallback = async () => {
      try {
        log('OAuth callback page loaded');
        
        // Using history mode, we should always get the code from search params
        let code = null;
        
        // Check search params for code (history mode)
        if (window.location.search) {
          log(`Checking search params: ${window.location.search.replace(/code=[^&]+/, 'code=REDACTED')}`);
          const params = new URLSearchParams(window.location.search);
          code = params.get('code');
          if (code) {
            log('Found code in search params');
          }
        }
        
        // Fallback to check hash for code (hash mode)
        if (!code && window.location.hash) {
          log(`Found hash: ${window.location.hash.replace(/code=[^&]+/, 'code=REDACTED')}`);
          
          // Check for code in hash fragment
          if (window.location.hash.includes('#/oauth-return?code=')) {
            log('Found code in hash fragment');
            const parts = window.location.hash.split('#/oauth-return?');
            if (parts.length > 1) {
              const params = new URLSearchParams(parts[1]);
              code = params.get('code');
            }
          }
        }
        
        if (!code) {
          log('No authorization code found in URL');
          throw new Error('No authorization code found');
        }
        
        log(`Authorization code found, length: ${code.length}`);
        
        // Get the provider from store or determine from URL
        let provider = store.state?.provider?.selected;
        if (!provider) {
          log('No provider found in store, attempting to determine from URL');
          // Extract provider from URL if present
          const urlProvider = window.location.pathname.split('/').filter(p => p)[0];
          provider = urlProvider || 'unknown';
        }
        log(`Using provider: ${provider}`);
        
        // Set provider in store
        log('Setting provider in store');
        store.dispatch('PROVIDER_SELECTED', provider);
        
        // Call the API to complete login
        log(`Calling completeLoginAsync for provider: ${provider}`);
        const response = await loginAPI.completeLoginAsync(provider, code);
        
        log(`Login completed successfully`);
        log(`Received tokens: accessToken=${response.accessToken ? 'present' : 'missing'}, refreshToken=${response.refreshToken ? 'present' : 'missing'}`);
        
        // Store JWT tokens
        log('Storing tokens in Vuex store');
        store.dispatch('AUTH_SET_JWT', response);
        
        // Update status
        statusMessage.value = 'Login successful! Redirecting...';
        
        // Redirect to dashboard
        log('Redirecting to dashboard');
        setTimeout(() => {
          router.push({ name: 'MainDashboard' });
        }, 1000); // Small delay for user to see success message
        
      } catch (error) {
        log(`Error occurred: ${error.message}`);
        
        if (error.response) {
          log(`Response status: ${error.response.status}`);
          log(`Response data: ${JSON.stringify(error.response.data || {})}`);
        }
        
        errorOccurred.value = true;
        errorMessage.value = error.message;
        statusMessage.value = 'Login failed';
      }
    };

    onMounted(() => {
      // Process OAuth callback immediately
      log('OAuth callback component mounted');
      handleOAuthCallback();
    });

    return {
      statusMessage,
      errorMessage,
      errorOccurred,
      debugInfo
    };
  }
};
</script>

<style scoped>
.oauth-container {
  max-width: 600px;
  margin: 50px auto;
  padding: 20px;
}

.debug-section {
  margin-top: 30px;
  text-align: left;
  border-top: 1px solid #eee;
  padding-top: 20px;
}

.debug-info {
  background-color: #f8f9fa;
  padding: 15px;
  border-radius: 5px;
  font-size: 12px;
  max-height: 300px;
  overflow-y: auto;
  white-space: pre-wrap;
  word-break: break-all;
}
</style>
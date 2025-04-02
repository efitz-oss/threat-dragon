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
      // Only add to debug display, no console logging in production
      debugInfo.value.push(`[${new Date().toISOString()}] ${message}`);
    };

    const handleOAuthCallback = async () => {
      try {
        log('OAuth callback page loaded');
        
        // We'll look for the code in multiple places to support different router modes and redirect patterns
        let code = null;
        
        // First check URL search params (standard approach with history mode)
        if (window.location.search) {
          log(`Checking search params: ${window.location.search.replace(/code=[^&]+/, 'code=REDACTED')}`);
          const params = new URLSearchParams(window.location.search);
          code = params.get('code');
          if (code) {
            log('Found code in search params');
          }
        }
        
        // If not found, check the full URL path for oauth-return pattern (for some redirects)
        if (!code && window.location.pathname.includes('/oauth-return')) {
          log('Found oauth-return in pathname, checking query string');
          // The code might be in query params but pathname includes the route
          const fullPath = window.location.pathname + window.location.search;
          const match = fullPath.match(/\/oauth-return\?code=([^&]+)/);
          if (match && match[1]) {
            code = match[1];
            log('Found code in pathname + search pattern');
          }
        }
        
        // Fallback to check hash for code (hash mode or older redirects)
        if (!code && window.location.hash) {
          log(`Found hash: ${window.location.hash.replace(/code=[^&]+/, 'code=REDACTED')}`);
          
          // Check for code in hash fragment with hashtag navigation
          if (window.location.hash.includes('#/oauth-return?code=')) {
            log('Found code in hash fragment with hashtag navigation');
            const parts = window.location.hash.split('#/oauth-return?');
            if (parts.length > 1) {
              const params = new URLSearchParams(parts[1]);
              code = params.get('code');
            }
          } else if (window.location.hash.includes('code=')) {
            // Direct hash parameter without route
            log('Found code directly in hash params');
            const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ''));
            code = hashParams.get('code');
          }
        }
        
        if (!code) {
          log('No authorization code found in URL');
          log(`Full URL: ${window.location.href.replace(/code=[^&]+/, 'code=REDACTED')}`);
          throw new Error('No authorization code found');
        }
        
        log(`Authorization code found, length: ${code.length}`);
        
        // Get the provider from store or determine from URL
        let provider = store.state?.provider?.selected;
        if (!provider) {
          log('No provider found in store, defaulting to google');
          provider = 'google';
          // Set provider in store
          log('Setting provider in store');
          store.dispatch('PROVIDER_SELECTED', provider);
        }
        log(`Using provider: ${provider}`);
        
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
        router.push({ name: 'MainDashboard' });
        
        // Small delay for visual feedback
        setTimeout(() => {}, 1000);
        
      } catch (error) {
        // Log errors both to console.error (for tests) and to debug display
        console.error(`OAuth callback error: ${error.message}`);
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
<script setup>
import { ref, onMounted } from "vue";
import { useStore } from "vuex";
import { useToast } from "vue-toast-notification";
import api from '@/service/api/api.js';

const store = useStore();
const toast = useToast();

// Ensure environment variables are defined
const apiKey = process.env.VUE_APP_GOOGLE_API_KEY || '';
let accessToken = ref(null);
let isLoading = ref(false);

// Get the Google access token from the server
const getGoogleAccessToken = async () => {
  try {
    isLoading.value = true;

    console.log('Requesting Google token with JWT:', store.state.auth.jwt ? 'JWT exists' : 'No JWT found');
    
    // Check if we're actually authenticated
    if (!store.state.auth.jwt) {
      toast.error('You need to sign in with Google before using Google Drive');
      return null;
    }
    
    // Try multiple endpoints, starting with the most specific
    const endpoints = [
      '/api/custom-google-token-access',
      '/custom-google-token-access',
      '/google-token-access'
    ];
    
    let response = null;
    let lastError = null;
    
    // Try each endpoint until one works
    for (const endpoint of endpoints) {
      console.log(`Trying to fetch Google token from endpoint: ${endpoint}`);
      try {
        response = await fetch(endpoint, {
          headers: {
            'Authorization': `Bearer ${store.state.auth.jwt}`
          }
        });
        console.log ("response,,,", response)
        
        if (response.ok) {
          console.log(`Successfully accessed endpoint: ${endpoint}`);
          break;
        } else {
          console.warn(`Endpoint ${endpoint} returned status: ${response.status}`);
          lastError = new Error(`Server returned ${response.status} from ${endpoint}`);
        }
      } catch (err) {
        console.warn(`Error accessing endpoint ${endpoint}:`, err);
        lastError = err;
      }
    }
    
    if (!response || !response.ok) {
      throw lastError || new Error('All endpoints failed');
    }
    
    const data = await response.json();
     console.log ("data...response////", data.data.accessToken)
    console.log('Token endpoint response:', data.status === 200 ? 'Success' : 'Failed');
    
    if (!data.data || !data.data.accessToken) {
      console.error('No access token in response:', data);
      throw new Error('No access token in response');
    }
    const token1 = data.data.accessToken
    
    return token1;
  } catch (error) {
    console.error('Error fetching Google access token:', error);
    toast.error('Failed to get access to Google Drive. Please try again or sign in again.');
    return null;
  } finally {
    isLoading.value = false;
  }
};

// Added google picker api
const loadPickerAPI = () => {
  if (typeof gapi !== 'undefined') {
    gapi.load("picker", { callback: () => console.log('Google Picker API loaded') });
  } else {
    console.error("Google API not loaded");
  }
};

const handleAuth = async () => {
  try {
    isLoading.value = true;
    // Get the access token from our server instead of requesting a new one
    const token = await getGoogleAccessToken();
    console.log ("token here", token)
    
    if (!token) {
      console.error('Failed to get Google access token');
      return;
    }
    accessToken.value = token;
    createPicker();
  } catch (error) {
    console.error('Error during Google authorization:', error);
    toast.error('Failed to authenticate with Google Drive');
  } finally {
    isLoading.value = false;
  }
};

const createPicker = () => {
  if (!accessToken.value) {
    console.error('No access token available for Google Picker');
    return;
  }
  
  if (typeof google === 'undefined' || !google.picker) {
    console.error('Google Picker API not loaded');
    toast.error('Google Picker API failed to load');
    return;
  }

  try {
    const picker = new google.picker.PickerBuilder()
      .addView(google.picker.ViewId.DOCS)
      .setOAuthToken(accessToken.value)
      .setDeveloperKey(apiKey)
      .setCallback(pickerCallback)
      .build();
    picker.setVisible(true);
  } catch (error) {
    console.error('Error creating Google Picker:', error);
    toast.error('Failed to open Google Drive picker');
  }
};

const pickerCallback = async (data) => {
  if (!data || !data.action || !google.picker || data.action !== google.picker.Action.PICKED) {
    return;
  }

  const file = data.docs[0];
  console.log ("file.id here..", file.id)
  if (file && file.mimeType === "application/json") {
    try {
      isLoading.value = true;
      const fileContent = await fetchFileContent(file.id);
      await sendToBackend(file.id, fileContent);
      toast.success('File imported successfully!');

    } catch (error) {
      console.error('Error processing file:', error);
      toast.error('Failed to import file from Google Drive');
    } finally {
      isLoading.value = false;
    }
  } else {
    console.warn("Invalid file type selected. Please select a JSON file.");
    toast.warning('Please select a JSON file');
  }
};

const fetchFileContent = async (fileId) => {
console.log ("fileId here.... + accessToken.value", fileId, accessToken.value)
  // Use the token we got from the server to fetch the file content
  const response = await fetch(
    `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`,
    {
      headers: {
        Authorization: `Bearer ${accessToken.value}`,
      },
    }
  );
console.log ("response", response)
  if (!response.ok) {
    const errorText = await response.text();
    console.error('Google Drive API error:', errorText);
    throw new Error('Failed to fetch file content from Google Drive');
  }
  
  return await response.text();
};

const sendToBackend = async (fileId, fileContent) => {
  try {
    // Use api service which automatically includes JWT token

    await api.postAsync(`/api/googleproviderthreatmodel/${fileId}/data`, 
      { fileId, fileContent });
    return true;
  } catch (error) {
    console.error('Error sending file to backend:', error);
    throw new Error('Failed to import file to Threat Dragon');
  }
};

onMounted(() => {
  // Load the Google APIs
  const script = document.createElement("script");
  script.src = "https://apis.google.com/js/api.js";
  script.onload = loadPickerAPI;
  document.body.appendChild(script);

  const gisScript = document.createElement("script");
  gisScript.src = "https://accounts.google.com/gsi/client";
  document.body.appendChild(gisScript);
});
</script>

<template>
  <button @click="handleAuth" class="btn btn-primary" :disabled="isLoading">
    <span v-if="isLoading">Loading...</span>
    <span v-else>Open Google Picker</span>
  </button>
</template>
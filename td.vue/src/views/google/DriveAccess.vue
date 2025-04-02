<script setup>
import { ref, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useToast } from 'vue-toast-notification';
import api from '@/service/api/api.js';

const store = useStore();
const toast = useToast();
const apiKey = process.env.VUE_APP_GOOGLE_API_KEY || '';
const appId = process.env.VUE_APP_GOOGLE_CLOUD_PROJECT_ID || '';

const accessToken = ref(null);
const isLoading = ref(false);
const fileContent = ref(null); // Store imported file content

const getGoogleAccessToken = async () => {
    try {
        isLoading.value = true;
        if (!store.state.auth.jwt) {
            toast.error('You need to sign in with Google before using Google Drive');
            return null;
        }
        
        const response = await fetch('/api/google-token', {
            headers: { 'Authorization': `Bearer ${store.state.auth.jwt}` }
        });
        
        if (!response.ok) {
            throw new Error(`Server returned ${response.status} from /api/google-token`);
        }

        const data = await response.json();
        if (!data.data || !data.data.accessToken) throw new Error('No access token in response');

        return data.data.accessToken;
    } catch (error) {
        console.error('Error fetching Google access token:', error);
        toast.error('Failed to get access to Google Drive. Please try again.');
        return null;
    } finally {
        isLoading.value = false;
    }
};

const loadPickerAPI = () => {
    if (typeof gapi !== 'undefined') {
        gapi.load('picker', { callback: () => console.log('Google Picker API loaded') });
    } else {
        console.error('Google API not loaded');
    }
};

const handleAuth = async () => {
    try {
        isLoading.value = true;
        const token = await getGoogleAccessToken();
        if (!token) return;
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
            .setAppId(appId)
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
    if (file && file.mimeType === 'application/json') {
        try {
            isLoading.value = true;
            const content = await fetchFileContent(file.id);
            fileContent.value = content; // Store content for UI display
            await sendToBackend(file.id, content);
            toast.success('File imported successfully!');
        } catch (error) {
            console.error('Error processing file:', error);
            toast.error('Failed to import file from Google Drive');
        } finally {
            isLoading.value = false;
        }
    } else {
        console.warn('Invalid file type selected. Please select a JSON file.');
        toast.warning('Please select a JSON file');
    }
};

const fetchFileContent = async (fileId) => {
    const response = await fetch(
        `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`,
        {
            headers: { Authorization: `Bearer ${accessToken.value}` },
        }
    );
    if (!response.ok) {
        const errorText = await response.text();
        console.error('Google Drive API error:', errorText);
        throw new Error('Failed to fetch file content from Google Drive');
    }
    return await response.text();
};

const sendToBackend = async (fileId, fileContent) => {
    try {
        await api.postAsync(`/api/googleproviderthreatmodel/${fileId}/data`, { fileId, fileContent });
        return true;
    } catch (error) {
        console.error('Error sending file to backend:', error);
        throw new Error('Failed to import file to Threat Dragon');
    }
};

onMounted(() => {
    const script = document.createElement('script');
    script.src = 'https://apis.google.com/js/api.js';
    script.onload = loadPickerAPI;
    document.body.appendChild(script);

    const gisScript = document.createElement('script');
    gisScript.src = 'https://accounts.google.com/gsi/client';
    document.body.appendChild(gisScript);
});
</script>

<template>
    <button class="btn btn-primary" :disabled="isLoading" @click="handleAuth">
        <span v-if="isLoading">Loading...</span>
        <span v-else>Open Google Picker</span>
    </button>

    <!-- Display imported JSON file content -->
    <div v-if="fileContent" class="mt-3 p-3 border rounded">
        <h5>Imported File Content:</h5>
        <pre>{{ fileContent }}</pre>
    </div>
</template>

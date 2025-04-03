<script setup>
import { ref, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useToast } from 'vue-toast-notification';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faGoogleDrive } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import api from '@/service/api/api.js';

// Add Google Drive icon to FontAwesome library
library.add(faGoogleDrive);

const store = useStore();
const toast = useToast();
const apiKey = process.env.VUE_APP_GOOGLE_API_KEY || '';
const appId = process.env.VUE_APP_GOOGLE_APP_ID || '';

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

    // Use DocsView to select a threat model from Google Drive, restricting to only json files
    const openView = new google.picker.DocsView()
        .setMimeTypes('application/json')
        .setIncludeFolders(true)
        .setMode(google.picker.DocsViewMode.LIST); // Set to list mode (vs GRID)

    // Use DocsView to create a new threat model in Google Drive
    const createNewView = new google.picker.DocsView()
        // we need to display a text field to allow the user to enter a file name
        // then we need to set the file name here
        // and we need a skeleton "blank" JSON threat model file content to save
        .setIncludeFolders(true)
        .setSelectFolderEnabled(true) // Allows folder selection
        .setMimeTypes('application/vnd.google-apps.folder') // Restrict to folders only
        .setMode(google.picker.DocsViewMode.LIST); // Set to list mode (vs GRID)

    try {
        const picker = new google.picker.PickerBuilder()
            // we need to figure out how to use this in two different cases:
            // 1. use openView with an appropriate title for opening an existing threat model
            // 2. use createNewView with an appropriate title and a file name for creating a new threat model
            .addView(openView)
            .addView(createNewView)
            .setOAuthToken(accessToken.value)
            .setAppId(appId)
            .setDeveloperKey(apiKey)
            .setCallback(pickerCallback)
            // .setTitle('Select a threat model file') // to open an existing file; need to localize
            // .setTitle('Select or Upload JSON File') // to select a destination folder for file upload; need to localize
            .enableFeature(google.picker.Feature.NAV_HIDDEN)
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
    <b-container fluid>
        <div class="welcome-jumbotron">
            <b-row class="text-center mb-2">
                <b-col md="12">
                    <p class="td-description mt-2">
                        {{ $t("providers.googleDrive.description") }}
                    </p>
                </b-col>
            </b-row>
            <b-row class="flex-grow-1 align-items-center">
                <b-col md="12" class="text-center">
                    <BButton
                        id="google-drive-btn"
                        class="m-1 google-drive-button"
                        variant="secondary"
                        :disabled="isLoading"
                        @click="handleAuth"
                    > 
                        <span class="login-btn-icon">
                            <font-awesome-icon
                                :icon="['fab', 'google-drive']"
                                size="2x"
                                color="white"
                                class="mr-2"
                            />
                        </span>
                        <span>
                            {{ $t('providers.googleDrive.loginWith') }} {{ $t('providers.googleDrive.displayName') }}
                        </span>
                    </BButton>
                </b-col>
            </b-row>
        </div>

        <!-- Display imported JSON file content -->
        <div v-if="fileContent" class="mt-3 p-3 border rounded">
            <h5>Imported File Content:</h5>
            <pre>{{ fileContent }}</pre>
        </div>
    </b-container>
</template>

<style lang="scss" scoped>
/* Recreating BootstrapVue's b-jumbotron styling */
.welcome-jumbotron {
    background-color: #f8f9fa; /* Light grey background like BootstrapVue jumbotron */
    padding: 3rem 2rem; /* Increase padding to match BootstrapVue */
    border-radius: 0.3rem; /* Add rounded corners */
    box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075); /* Light shadow */
    margin-bottom: 1.5rem; /* Space below jumbotron */
    display: flex;
    flex-direction: column;
    min-height: 60vh; /* Ensure jumbotron takes most of the screen */
}

.flex-grow-1 {
    flex-grow: 1;
}

.td-description {
    font-size: 20px;
    max-width: 80%;
    margin: 10px auto; /* Center the description */
    text-align: center;
}

.google-drive-button {
    padding: 1rem 2rem;
    font-size: 1.25rem;
}

.login-btn-icon {
    display: block;
}
</style>

<script setup>
import { ref, onMounted } from "vue";

const apiKey = process.env.VUE_APP_GOOGLE_API_KEY;
const clientId = process.env.VUE_APP_GOOGLE_CLIENT_ID;

console.log("API Key:", apiKey);
console.log("Client ID:", clientId);



const scope = "https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/drive.readonly";
let accessToken = ref(null);
let tokenScopes = ref([]);

// added google picker api

const loadPickerAPI = () => {
  gapi.load("picker", { callback: createPicker });
};

const handleAuth = () => {
  const tokenClient = google.accounts.oauth2.initTokenClient({
    client_id: clientId,
    scope: scope,
    callback: (response) => {
      if (response.error) {
        console.error("OAuth Error:", response);
        return;
      }
      accessToken.value = response.access_token; // Store correct token
      tokenScopes.value = response.scope ? response.scope.split(" ") : [];
      console.log("OAuth token received:", accessToken.value);
      console.log("Token Scopes:", tokenScopes.value);
      createPicker();
    },
  });
  tokenClient.requestAccessToken();
};

const createPicker = () => {
  if (!accessToken.value) return;
  const picker = new google.picker.PickerBuilder()
    .addView(google.picker.ViewId.DOCS)
    .setOAuthToken(accessToken.value)
    .setDeveloperKey(apiKey)
    .setCallback(pickerCallback)
    .build();
  picker.setVisible(true);
};

const pickerCallback = async (data) => {
  if (data.action === google.picker.Action.PICKED) {
    const file = data.docs[0]; // Get the selected file
    console.log("Selected file:", file);
    if (file.mimeType === "application/json") {
      try {
        const fileContent = await fetchFileContent(file.id); // Fetch content
        sendToBackend(file.id, fileContent); // Send to backend
      } catch (error) {
        console.error("Error fetching file content:", error);
      }
    } else {
      console.warn("Invalid file type selected. Please select a JSON file.");
    }
  }
};

const fetchFileContent = async (fileId) => {
  console.log("Fetching file with token:", accessToken.value);
  const response = await fetch(
    `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`,
    {
      headers: {
        Authorization: `Bearer ${accessToken.value}`,
      },
    }
  );
  if (!response.ok) throw new Error("Failed to fetch file content");
  return await response.text(); // Returns file content as string
};

const sendToBackend = async (fileId, fileContent) => {
  console.log("Sending file to backend with token:", accessToken.value);
  if (!accessToken.value) {
    console.error("No access token available. User may not be authenticated.");
    return;
  }
  try {
    const response = await fetch(`/api/googleproviderthreatmodel/${fileId}/data`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken.value}` // Ensure the token is sent
      },
      body: JSON.stringify({ fileId, fileContent }),
    });
    if (response.ok) {
      console.log("File imported successfully!");
    } else {
      const errorData = await response.json();
      console.error("Failed to import file:", errorData);
    }
  } catch (error) {
    console.error("Error sending file to backend:", error);
  }
};

onMounted(() => {
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
  <button @click="handleAuth" class="btn btn-primary">
    Open Google Picker
  </button>
</template>

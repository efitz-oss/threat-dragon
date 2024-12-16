import env from '../env/Env.js';
import { google } from 'googleapis';

// Define the scope for Google Drive access
const SCOPES = ['https://www.googleapis.com/auth/drive'];

// OAuth client setup
const oauth2Client = new google.auth.OAuth2(
    env.get().config.GOOGLE_CLIENT_ID,
    env.get().config.GOOGLE_CLIENT_SECRET,
    env.get().config.GOOGLE_REDIRECT_URI
);

// Step 1: Generate the URL for the user to authenticate
const getAuthUrl = () => {
    return oauth2Client.generateAuthUrl({
        access_type: 'offline',  // This allows you to get a refresh token for long-term access
        scope: SCOPES,  // The scope you defined earlier, which includes 'https://www.googleapis.com/auth/drive'
    });
};

// Step 2: Once the user has authenticated, you'll get a code in the callback
// Handle the authorization code and exchange it for tokens
const getTokens = async (code) => {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);  // Save the tokens (access_token, refresh_token)
    return tokens;  // Return the tokens for later use
};

// Step 3: Use the access token to authenticate API calls
const getClient = (accessToken) => {
    const oauth2Client = new google.auth.OAuth2(
        env.get().config.GOOGLE_CLIENT_ID,
        env.get().config.GOOGLE_CLIENT_SECRET,
        env.get().config.GOOGLE_REDIRECT_URI
    );
    
    // Set the access token for the client
    oauth2Client.setCredentials({ access_token: accessToken });
    
    return oauth2Client;
};

const getFolderDetailsAsync = async (folderId, accessToken) => {
    const auth = getClient(accessToken);
    const driveClient = google.drive({ version: 'v3', auth });

    const res = await driveClient.files.get({
        fileId: folderId,
        fields: 'id, name, mimeType',
    });

    return res.data;
};

const listFilesInFolderAsync = async (folderId, pageToken, accessToken) => {
    const auth = getClient(accessToken);
    const driveClient = google.drive({ version: 'v3', auth });

    const res = await driveClient.files.list({
        q: `'${folderId}' in parents and (mimeType='application/vnd.google-apps.folder' or mimeType='application/json')`,
        fields: 'nextPageToken, files(id, name, parents, mimeType)',
        pageSize: 10,
        ...(pageToken ? { pageToken } : {})
    });

    return {
        folders: res.data.files,
        nextPageToken: res.data.nextPageToken,
    };
};

const getFolderParentIdAsync = async (folderId, accessToken) => {
    const auth = getClient(accessToken);
    const driveClient = google.drive({ version: 'v3', auth });

    const res = await driveClient.files.get({
        fileId: folderId,
        fields: 'id, name, parents'
    });

    const parentId = res.data.parents ? res.data.parents[0] : '';

    return parentId;
};

const getFileContentAsync = async (fileId, accessToken) => {
    const auth = getClient(accessToken);
    const driveClient = google.drive({ version: 'v3', auth });

    const res = await driveClient.files.get({
        fileId: fileId,
        alt: 'media',
    });

    return res.data;
};

const createFileInFolderAsync = async (folderId, fileName, fileContent, accessToken) => {
    const auth = getClient(accessToken);
    const driveClient = google.drive({ version: 'v3', auth });

    const fileMetadata = {
        name: fileName,
        parents: [folderId],
    };

    const media = {
        mimeType: 'application/json',
        body: JSON.stringify(fileContent, null, '  '),
    };

    const res = await driveClient.files.create({
        resource: fileMetadata,
        media: media,
        fields: 'id',
    });

    return res.data;
};

const updateFileAsync = async (fileId, fileContent, accessToken) => {
    const auth = getClient(accessToken);
    const driveClient = google.drive({ version: 'v3', auth });

    const media = {
        mimeType: 'application/json',
        body: JSON.stringify(fileContent, null, '  '),
    };

    const res = await driveClient.files.update({
        fileId: fileId,
        media: media,
        fields: 'id',
    });

    return res.data;
};

const deleteFileAsync = async (fileId, accessToken) => {
    const auth = getClient(accessToken);
    const driveClient = google.drive({ version: 'v3', auth });

    await driveClient.files.delete({
        fileId: fileId,
    });

    return { success: true };
};

export default {
    getAuthUrl,  // Export the auth URL generator for user authentication
    getTokens,   // Export the function for exchanging the code for tokens
    getFolderDetailsAsync,
    getFolderParentIdAsync,
    listFilesInFolderAsync,
    getFileContentAsync,
    createFileInFolderAsync,
    updateFileAsync,
    deleteFileAsync,
};

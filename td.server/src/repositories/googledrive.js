import env from '../env/Env.js';
import { google } from 'googleapis';

// Define the scope for Google Drive access
const SCOPES = [
    'https://www.googleapis.com/auth/drive',
    'https://www.googleapis.com/auth/drive.file',
    'https://www.googleapis.com/auth/drive.metadata',
    'https://www.googleapis.com/auth/drive.metadata.readonly',
    'https://www.googleapis.com/auth/drive.readonly',
    'https://www.googleapis.com/auth/drive.appdata'
];

// OAuth client setup
const oauth2Client = new google.auth.OAuth2(
    env.get().config.GOOGLE_CLIENT_ID,
    env.get().config.GOOGLE_CLIENT_SECRET,
    env.get().config.GOOGLE_REDIRECT_URI
);

// Step 1: Generate the URL for the user to authenticate
const getAuthUrl = () => {
    return oauth2Client.generateAuthUrl({
        access_type: 'offline',
        prompt: 'consent',
        scope: SCOPES,
        include_granted_scopes: true
    });
};

// Step 2: Once the user has authenticated, you'll get a code in the callback
// Handle the authorization code and exchange it for tokens
const getTokens = async (code) => {
    try {
        const { tokens } = await oauth2Client.getToken(code);
        console.log('Received tokens:', {
            access_token: tokens.access_token ? 'present' : 'missing',
            refresh_token: tokens.refresh_token ? 'present' : 'missing',
            scope: tokens.scope
        });
        
        oauth2Client.setCredentials(tokens);
        return tokens;
    } catch (error) {
        console.error('Error getting tokens:', error);
        throw new Error('Failed to get authentication tokens');
    }
};

// Step 3: Use the access token to authenticate API calls
const getClient = (accessToken) => {
    if (!accessToken) {
        throw new Error('Access token is required');
    }

    console.log('Creating new OAuth2Client with token:', accessToken.substring(0, 10) + '...');

    const oauth2Client = new google.auth.OAuth2(
        env.get().config.GOOGLE_CLIENT_ID,
        env.get().config.GOOGLE_CLIENT_SECRET,
        env.get().config.GOOGLE_REDIRECT_URI
    );
    
    oauth2Client.setCredentials({ 
        access_token: accessToken
    });
    
    return oauth2Client;
};

const getFolderDetailsAsync = async (folderId, accessToken) => {
    console.log('Checking environment configuration:', {
        clientIdPresent: !!env.get().config.GOOGLE_CLIENT_ID,
        clientSecretPresent: !!env.get().config.GOOGLE_CLIENT_SECRET,
        redirectUriPresent: !!env.get().config.GOOGLE_REDIRECT_URI
    });
    const auth = getClient(accessToken);
    const driveClient = google.drive({ version: 'v3', auth });

    const res = await driveClient.files.get({
        fileId: folderId,
        fields: 'id, name, mimeType',
    });

    return res.data;
};

const listFilesInFolderAsync = async (folderId, pageToken, accessToken) => {
    try {
        if (!accessToken) {
            throw new Error('Access token is required');
        }

        console.log('Setting up Drive client...');
        const auth = getClient(accessToken);
        const driveClient = google.drive({ 
            version: 'v3', 
            auth,
            timeout: 1000,
            retry: true
        });

        console.log(`Listing files for folder: ${folderId}`);
        const query = `'${folderId}' in parents`;
        
        const res = await driveClient.files.list({
            q: query,
            fields: 'nextPageToken, files(id, name, parents, mimeType)',
            pageSize: 10,
            ...(pageToken ? { pageToken } : {}),
            supportsAllDrives: true,
            includeItemsFromAllDrives: true
        });

        console.log(`Found ${res.data.files?.length || 0} files`);
        return {
            folders: res.data.files,
            nextPageToken: res.data.nextPageToken,
        };

    } catch (error) {
        console.error('Detailed error in listFilesInFolderAsync:', {
            message: error.message,
            status: error.status,
            errors: error.errors,
            code: error.code,
            stack: error.stack,
            response: error.response?.data
        });

        if (error.status === 401) {
            throw new Error('Authentication token expired or invalid. Please re-authenticate.');
        }

        if (error.status === 403) {
            console.error('Authorization headers:', error.config?.headers?.Authorization);
            throw new Error('Insufficient permissions. Please ensure you have granted all necessary permissions and try re-authenticating.');
        }

        throw new Error(`Failed to list files: ${error.message}`);
    }
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

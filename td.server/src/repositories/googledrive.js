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
            access_token_exists: !!tokens.access_token,
            refresh_token_exists: !!tokens.refresh_token,
            scope: tokens.scope, // This will show what scopes were actually granted
            expiry: tokens.expiry_date
        });
        
        oauth2Client.setCredentials(tokens);
        return tokens;
    } catch (error) {
        console.error('Error getting tokens:', error);
        throw error;
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
    console.log('Environment check:', {
        clientId: env.get().config.GOOGLE_CLIENT_ID?.substring(0, 10) + '...',
        clientSecretExists: !!env.get().config.GOOGLE_CLIENT_SECRET,
        redirectUri: env.get().config.GOOGLE_REDIRECT_URI
    });
    try {
        if (!accessToken) {
            throw new Error('Access token is required');
        }

        console.log('Setting up Drive client...');
        const auth = getClient(accessToken);
        
        // Add this debug section
        try {
            const tokenInfo = await auth.getTokenInfo(accessToken);
            console.log('Token Info:', {
                scopes: tokenInfo.scopes,
                expiry: new Date(tokenInfo.expiry_date).toISOString(),
                email: tokenInfo.email
            });
        } catch (e) {
            console.error('Error getting token info:', e);
        }

        const driveClient = google.drive({ 
            version: 'v3', 
            auth,
            timeout: 10000, // Increased timeout
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

        return {
            folders: res.data.files,
            nextPageToken: res.data.nextPageToken,
        };

    } catch (error) {
        // Log the full error object
        console.error('Full error object:', JSON.stringify(error, null, 2));
        if (error.response?.data?.error?.status === 'PERMISSION_DENIED') {
            console.error('Permission denied. Current scopes:', error.response.data.error.details);
            throw new Error('Permission denied. Please check application permissions.');
        };
        if (error.response) {
            console.error('Response data:', error.response.data);
            console.error('Response headers:', error.response.headers);
        }

        throw error;
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

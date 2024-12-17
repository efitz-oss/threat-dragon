import env from '../env/Env.js';
import { google } from 'googleapis';

// Define the scope for Google Drive access
const SCOPES = [
    'https://www.googleapis.com/auth/drive.file',
    'https://www.googleapis.com/auth/drive.metadata.readonly',
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile',
    'openid'
];

// OAuth client setup
const oauth2Client = new google.auth.OAuth2(
    env.get().config.GOOGLE_CLIENT_ID,
    env.get().config.GOOGLE_CLIENT_SECRET,
    env.get().config.GOOGLE_REDIRECT_URI
);

// Step 1: Generate the URL for the user to authenticate
const getAuthUrl = () => {
    const url = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        prompt: 'consent',
        scope: SCOPES,
        include_granted_scopes: true
    });
    
    console.log('Generated Auth URL with scopes:', SCOPES);
    return url;
};

// Step 2: Once the user has authenticated, you'll get a code in the callback
// Handle the authorization code and exchange it for tokens
const getTokens = async (code) => {
    try {
        console.log('Getting tokens with code...');
        const { tokens } = await oauth2Client.getToken(code);
        
        console.log('Received tokens with scopes:', tokens.scope);
        
        oauth2Client.setCredentials(tokens);
        return tokens;
    } catch (error) {
        console.error('Error in getTokens:', error);
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
        access_token: accessToken,
        scope: SCOPES.join(' ')  // Add this line
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

        const auth = getClient(accessToken);
        console.log ("autrh here  ... ", auth)
        
        // Add token verification
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
            timeout: 10000
        });

        const query = `'${folderId}' in parents and (mimeType='application/vnd.google-apps.folder' or mimeType='application/json')`;
        console.log('Query:', query);
        
        const res = await driveClient.files.list({
            q: query,
            fields: 'nextPageToken, files(id, name, parents, mimeType)',
            pageSize: 10,
            pageToken: pageToken || undefined,
            supportsAllDrives: false,
            includeItemsFromAllDrives: false
        });
        console.log('drive response....:', res);

        return {
            folders: res.data.files,
            nextPageToken: res.data.nextPageToken,
        };

    } catch (error) {
        console.error('Detailed error:', {
            message: error.message,
            status: error.status,
            response: error.response?.data,
            headers: error.response?.headers
        });

        if (error.response?.data?.error?.status === 'PERMISSION_DENIED') {
            throw new Error(`Permission denied. Required scopes: ${SCOPES.join(', ')}`);
        }

        throw error; // Rethrow the error to be caught in the controller
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

import loggerHelper from '../helpers/logger.helper.js';
import repositories from "../repositories";
import responseWrapper from './responseWrapper.js';

const logger = loggerHelper.get('controllers/googleProviderThreatmodelController.js');

const folders = (req, res) => responseWrapper.sendResponseAsync(async () => {
    console.log('--------------hey hey....... hey----------');
    const googleDrive = repositories.getSpecific('googledrive');

    console.log('Access Token:-------->', req.provider.access_token);

    const pageToken = req?.query?.page || null;
    const folderId = req?.query?.folderId || 'root';

    console.log('Received folderId:--------', folderId);  // Log received query params
    console.log('Received page:--------', pageToken); 

    let foldersResp = {};
    let folders = [];
    let parentId = '';

    logger.info('Fetching folders for folderId:', folderId, 'with pageToken:', pageToken);

    try {
        foldersResp = await googleDrive.listFilesInFolderAsync(folderId, pageToken, req.provider.access_token);
        console.log('Folders response-------->:', foldersResp);
        if (!foldersResp || !foldersResp.folders) {
            throw new Error('Invalid response from Google Drive API');
        }
        folders = foldersResp.folders;

        const pagination = {
            nextPageToken: foldersResp.nextPageToken || null,
            currentPageToken: pageToken || null
        };

        if (folderId !== 'root') {
            parentId = await googleDrive.getFolderParentIdAsync(folderId, req.provider.access_token);
            console.log('Parent ID:..........', parentId);
        }

        return {
            folders: folders.map((folder) => ({ name: folder.name, id: folder.id, mimeType: folder.mimeType })),
            pagination,
            parentId,
        };
    } catch (error) {
        logger.error('Error in folders endpoint:---', {
            message: error.message,
            stack: error.stack,
            folderId,
            pageToken,
        });
        throw error; // This propagates as a 500 response
    }
}, req, res, logger);

const create = (req, res) => responseWrapper.sendResponseAsync(async () => {
    const googleDrive = repositories.getSpecific('googledrive');

    const folderId = req.params.folder;
    const { fileContent, fileName } = req.body;

    const resp = await googleDrive.createFileInFolderAsync(folderId, fileName, fileContent, req.provider.access_token);
    
    return {
        id: resp.id
    };
}, req, res, logger);

const update = (req, res) => responseWrapper.sendResponseAsync(async () => {
    const googleDrive = repositories.getSpecific('googledrive');

    const fileId = req.params.file;
    const { fileContent } = req.body;

    const resp = await googleDrive.updateFileAsync(fileId, fileContent, req.provider.access_token);
    
    return {
        id: resp.id
    };
}, req, res, logger);

const model = (req, res) => responseWrapper.sendResponseAsync(async () => {
    const googleDrive = repositories.getSpecific('googledrive');

    const fileId = req.params.file;
    const resp = await googleDrive.getFileContentAsync(fileId, req.provider.access_token);
    return resp;
}, req, res, logger);

export default {
    folders,
    create,
    update,
    model
};

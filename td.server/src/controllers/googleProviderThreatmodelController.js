import loggerHelper from '../helpers/logger.helper.js';
import repositories from "../repositories";
import responseWrapper from './responseWrapper.js';

const logger = loggerHelper.get('controllers/googleProviderThreatmodelController.js');

const folders = (req, res) => responseWrapper.sendResponseAsync(async () => {
    const googleDrive = repositories.getSpecific('googledrive');

    const pageToken = req?.query?.page || null;
    const folderId = req?.query?.folderId || 'root';
    const accessToken = req.provider.access_token; // Extract the accessToken from headers
    if (!accessToken) {
        throw new Error('Access token is missing');
    }

    let foldersResp = await googleDrive.listFilesInFolderAsync(folderId, pageToken, accessToken);
    
    return {
        folders: foldersResp.folders.map(folder => ({ name: folder.name, id: folder.id, mimeType: folder.mimeType })),
        pagination: {
            nextPageToken: foldersResp.nextPageToken || null,
            currentPageToken: pageToken || null
        },
        parentId: folderId === 'root' ? '' : await googleDrive.getFolderParentIdAsync(folderId, accessToken)
    };
}, req, res, logger);

const create = (req, res) => responseWrapper.sendResponseAsync(async () => {
    const googleDrive = repositories.getSpecific('googledrive');
    const folderId = req.params.folder;
    const { fileContent, fileName } = req.body;
    
    const resp = await googleDrive.createFileInFolderAsync(folderId, fileName, fileContent, req.provider.access_token);
    return { id: resp.id };
}, req, res, logger);

const update = (req, res) => responseWrapper.sendResponseAsync(async () => {
    const googleDrive = repositories.getSpecific('googledrive');
    const fileId = req.params.file;
    const { fileContent } = req.body;

    const resp = await googleDrive.updateFileAsync(fileId, fileContent, req.provider.access_token);
    return { id: resp.id };
}, req, res, logger);

const model = (req, res) => responseWrapper.sendResponseAsync(async () => {
    const googleDrive = repositories.getSpecific('googledrive');
    const fileId = req.params.fileId;
    
    // Use the access token from the request
    const accessToken = req.access_token;
    if (!accessToken) {
        throw new Error("Access token is missing");
    }

    const resp = await googleDrive.getFileContentAsync(fileId, accessToken);
    return resp;
}, req, res, logger);


export default {
    folders,
    create,
    update,
    model
};

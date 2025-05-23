import loggerHelper from '../helpers/logger.helper.js';
import repositories from '../repositories/index.js';
import responseWrapper from './responseWrapper.js';

const logger = loggerHelper.get('controllers/googleProviderThreatmodelController.js');

const folders = (req, res) =>
    responseWrapper.sendResponseAsync(
        async () => {
            const googleDrive = repositories.getSpecific('googledrive');

            const pageToken = req?.query?.page || null;
            const folderId = req?.query?.folderId || 'root';
            const accessToken = req.provider.access_token; // Extract the accessToken from headers
            if (!accessToken) {
                throw new Error('Access token is missing');
            }

            let foldersResp = {};
            let folders = [];
            let parentId = '';
            foldersResp = await googleDrive.listFilesInFolderAsync(
                folderId,
                pageToken,
                accessToken
            ); // Use the extracted accessToken
            folders = foldersResp.folders;

            const pagination = {
                nextPageToken: foldersResp.nextPageToken || null,
                currentPageToken: pageToken || null
            };

            if (folderId == 'root') {
                parentId = '';
            } else {
                parentId = await googleDrive.getFolderParentIdAsync(folderId, accessToken); // Use the extracted accessToken
            }

            return {
                folders: folders.map((folder) => ({
                    name: folder.name,
                    id: folder.id,
                    mimeType: folder.mimeType
                })),
                pagination: pagination,
                parentId
            };
        },
        req,
        res,
        logger
    );

const create = (req, res) =>
    responseWrapper.sendResponseAsync(
        async () => {
            const googleDrive = repositories.getSpecific('googledrive');
            const folderId = req.params.folder;
            const { fileContent, fileName } = req.body;
            const resp = await googleDrive.createFileInFolderAsync(
                folderId,
                fileName,
                fileContent,
                req.provider.access_token
            );
            return {
                id: resp.id
            };
        },
        req,
        res,
        logger
    );

const update = (req, res) =>
    responseWrapper.sendResponseAsync(
        async () => {
            const googleDrive = repositories.getSpecific('googledrive');
            const fileId = req.params.file;
            const { fileContent } = req.body;
            const resp = await googleDrive.updateFileAsync(
                fileId,
                fileContent,
                req.provider.access_token
            );
            return {
                id: resp.id
            };
        },
        req,
        res,
        logger
    );

const model = (req, res) =>
    responseWrapper.sendResponseAsync(
        async () => {
            const googleDrive = repositories.getSpecific('googledrive');
            const fileId = req.params.file;
            const resp = await googleDrive.getFileContentAsync(fileId, req.provider.access_token);
            return resp;
        },
        req,
        res,
        logger
    );

export default {
    folders,
    create,
    update,
    model
};

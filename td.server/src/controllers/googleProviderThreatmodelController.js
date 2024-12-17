import loggerHelper from '../helpers/logger.helper.js';
import repositories from "../repositories";
import responseWrapper from './responseWrapper.js';

import env from '../env/Env.js';
import axios from 'axios';

const logger = loggerHelper.get('controllers/googleProviderThreatmodelController.js');



const folders = async (req, res) => {

   


    
    const googleDrive = repositories.getSpecific('googledrive');
    const pageToken = req?.query?.page || null;
    const folderId = req?.query?.folderId || 'root';
    const myRefresh = req.provider.access_token
    
    const refreshAccessToken = async (myRefresh) => {
        const response = await axios.post('https://oauth2.googleapis.com/token', null, {
            params: {
                client_id: env.get().config.GOOGLE_CLIENT_ID,
                client_secret: env.get().config.GOOGLE_CLIENT_SECRET,
                refresh_token: myRefresh,
                grant_type: 'refresh_token',
            },
        });
    
        if (response.status !== 200) {
            throw new Error('Failed to refresh access token');
        }
    
        return response.data.access_token; // Return the new access token
    };


    console.log('Received folderId:--------.................', folderId);
    // console.log ( "myRefresh......>", myRefresh)
    console.log('Received page:--------...............', pageToken);

    try {

        const newAccessToken = await refreshAccessToken(myRefresh);
        console.log('MY New access token obtained:-------->', newAccessToken);
        console.log('i am here broo-------->:..............');
        const foldersResp = await googleDrive.listFilesInFolderAsync(folderId, pageToken, newAccessToken);
        console.log('Folders response-------->:..............', foldersResp);
        if (!foldersResp || !foldersResp.folders) {
            throw new Error('Invalid response from Google Drive API......');
        }
        return res.json(foldersResp);
    } catch (error) {
        console.error('Error in the catch block:.........', error);
        res.status(500).json({ message: 'Internal Server Error.........' });
    }
};


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
    model,
    // listFilesInFolderAsync,
    // getFileContentAsync,
};

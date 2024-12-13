import api from './api.js';

const resource = '/api/googleproviderthreatmodel';

/**
 * Gets the google drive folders for the given user
 * @returns {Promise}
 */
const folderAsync = async (folderId = 'root', page = 1) => {
    try {
        const response = await api.getAsync(`${resource}/folders`, { params: { page, folderId } });
        return response;
    } catch (error) {
        console.error('Error fetching folders:', error.message);
        throw error;
    }
};


const createAsync = (folder, fileContent, fileName) => {
    return api.postAsync(`${resource}/${folder}/create`, {fileContent, fileName});
};

const updateAsync = (fileId, fileContent) => {
    return api.putAsync(`${resource}/${fileId}/update`, {fileContent});
};

const modelAsync = (fileId) => {
    return api.getAsync(`${resource}/${fileId}/data`);
};

export default {
    folderAsync,
    createAsync,
    updateAsync,
    modelAsync
};

import Vue from "vue";
import {
    FOLDER_CLEAR,
    FOLDER_FETCH,
    FOLDER_SELECTED,
    FOLDER_NAVIGATE_BACK,
} from "../actions/folder.js";
import googleDriveApi from "../../service/api/googleDriveApi.js";

export const clearState = (state) => {
    state.all.length = 0;
    state.selected = "root";
    state.page = 1;
    state.pageTokens = [""];
    state.pageNext = false;
    state.pagePrev = false;
    state.parentId = "";
};

const state = {
    all: [],
    selected: "root",
    page: 1,
    pageTokens: [""],
    pageNext: false,
    pagePrev: false,
    parentId: "",
};

const actions = {
    [FOLDER_CLEAR]: ({ commit }) => commit(FOLDER_CLEAR),
    [FOLDER_FETCH]: async ({ commit }, { folderId = 'root', page = 1 } = {}) => {
        console.log("FOLDER_FETCH triggered with:", { folderId, page });
        if (!folderId) commit(FOLDER_CLEAR);
        const pageToken = state.pageTokens[page - 1] || '';
    
        try {
            console.log('Fetching folders with params:', { folderId, pageToken });
            const resp = await googleDriveApi.folderAsync(folderId, page);
            
            // Log the entire response to inspect its structure
            console.log('Google Drive API response:', resp);
    
            // Check if the response is valid and contains the expected data
            if (resp && resp.folders) {
                if (resp.nextPageToken && !state.pageTokens[page]) {
                    state.pageTokens[page] = resp.nextPageToken;
                }
    
                commit(FOLDER_FETCH, {
                    'folders': resp.folders,
                    'page': page,
                    'pageNext': !!resp.nextPageToken,
                    'pagePrev': page > 1,
                    'parentId': resp.parentId
                });
            } else {
                console.error('Unexpected response structure:', resp);
            }
        } catch (error) {
            console.error('Error fetching Google Drive folders:', {
                message: error.message,
                config: error.config,
                response: error.response ? error.response.data : 'No response data',
            });
        }
    },

    [FOLDER_SELECTED]: ({ commit, dispatch }, folder) => {
        commit(FOLDER_SELECTED, folder.id);
        if (folder.mimeType !== "application/json") {
            dispatch(FOLDER_FETCH, { folderId: folder.id });
        }
    },
    [FOLDER_NAVIGATE_BACK]: ({ commit, dispatch, state }) => {
        commit(FOLDER_SELECTED, state.parentId);
        dispatch(FOLDER_FETCH, { folderId: state.parentId });
    },
};

const mutations = {
    [FOLDER_CLEAR]: (state) => clearState(state),

    [FOLDER_FETCH]: (
        state,
        { folders, page, pageNext, pagePrev, parentId }
    ) => {
        state.all.length = 0;
        folders.forEach((folder, idx) => Vue.set(state.all, idx, folder));
        state.page = page;
        state.pageNext = pageNext;
        state.pagePrev = pagePrev;
        state.parentId = parentId;
    },

    [FOLDER_SELECTED]: (state, folder) => {
        state.selected = folder;
    },
};

const getters = {};

export default {
    state,
    actions,
    mutations,
    getters,
};

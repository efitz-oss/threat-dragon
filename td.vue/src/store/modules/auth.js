import { AUTH_CLEAR, AUTH_SET_JWT, AUTH_SET_LOCAL, LOGOUT } from '../actions/auth.js';
import { BRANCH_CLEAR } from '../actions/branch.js';
import loginApi from '../../service/api/loginApi.js';
import { PROVIDER_CLEAR } from '../actions/provider.js';
import providers from '../../service/provider/providers.js';
import { REPOSITORY_CLEAR } from '../actions/repository.js';
import { THREATMODEL_CLEAR } from '../actions/threatmodel.js';

export const clearState = (state) => {
    state.jwt = '';
    state.refreshToken = '';
    state.jwtBody = {};
    state.user = {};
};

const state = {
    jwt: '',
    refreshToken: '',
    jwtBody: {},
    user: {}
};

const actions = {
    [AUTH_CLEAR]: ({ commit }) => commit(AUTH_CLEAR),
    [AUTH_SET_JWT]: ({ commit }, tokens) => commit(AUTH_SET_JWT, tokens),
    [AUTH_SET_LOCAL]: ({ commit }) => commit(AUTH_SET_LOCAL),
    [LOGOUT]: async ({ dispatch, state, rootState }) => {
        try {
            if (rootState.provider.selected !== providers.allProviders.local.key && rootState.provider.selected !== providers.allProviders.desktop.key) {
                await loginApi.logoutAsync(state.refreshToken);
            }
        } catch (e) {
            console.error('Error calling logout api', e);
        }
        dispatch(AUTH_CLEAR);
        dispatch(BRANCH_CLEAR);
        dispatch(PROVIDER_CLEAR);
        dispatch(REPOSITORY_CLEAR);
        dispatch(THREATMODEL_CLEAR);
    }
};

const mutations = {
    [AUTH_CLEAR]: (state) => clearState(state),
    [AUTH_SET_JWT]: (state, tokens) => {
        console.log('Received tokens:', tokens); // Log the tokens to check their structure
        try {
            const { jwt, refreshToken } = tokens; // Change accessToken to jwt
    
            if (!jwt) {
                console.error('JWT is missing');
                throw new Error('JWT is missing');
            }
    
            const tokenBody = jwt.split('.')[1]; // Use jwt instead of accessToken
            const decodedBody = window.atob(tokenBody);
            const jwtBody = JSON.parse(decodedBody);
            state.jwt = jwt; // Set state.jwt to jwt
            state.jwtBody = jwtBody;
            state.user = jwtBody.user;
            state.refreshToken = refreshToken;
        } catch (e) {
            console.error('Error decoding JWT', e);
            throw e;
        }
    },
    [AUTH_SET_LOCAL]: (state) => {
        state.user = {
            username: 'local-user'
        };
    }
};

const getters = {
    username: (state) => state.user.username || ''
};

export default {
    state,
    actions,
    mutations,
    getters
};

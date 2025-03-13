/**
 * @name gitlab
 * @description Identity provider for Gitlab OAuth
 */
import axios from 'axios';

import { getEnvironment } from '../env/Env.js';
import * as repositories from '../repositories/index.js';

const name = 'gitlab';

/**
 * Determines if the GitHub provider is configured
 * @returns {Boolean}
 */
const isConfigured = () => Boolean(getEnvironment().config.GITLAB_CLIENT_ID);

/**
 * Gets the Gitlab endpoint, which will be gitlab.com by default OR a custom endpoint for Gitlab enterprise scenarios
 * @returns {String}
 */
const getGitlabUrl = () => getEnvironment().config.GITLAB_HOST || 'https://gitlab.com';

/**
 * Gets the Gitlab OAuth Login URL
 * @returns {String}
 */
const getOauthRedirectUrl = () => {
    const scope =
        getEnvironment().config.GITLAB_SCOPE || 'read_user read_repository write_repository profile';
    return `${getGitlabUrl()}/oauth/authorize?scope=${scope}&redirect_uri=${getEnvironment().config.GITLAB_REDIRECT_URI}&response_type=code&client_id=${getEnvironment().config.GITLAB_CLIENT_ID}`;
};

/**
 * Gets the return URL for our application, returning from gitlab
 * @param {string} code
 * @returns {String}
 */
const getOauthReturnUrl = (code) => {
    let returnUrl = `/#/oauth-return?code=${code}`;
    if (getEnvironment().config.NODE_ENV === 'development') {
        returnUrl = `http://localhost:8080${returnUrl}`;
    }
    return returnUrl;
};

/**
 * Finishes the OAuth login, issues a JWT
 * @param {String} code
 * @returns {String} jwt
 */

const completeLoginAsync = async (code) => {
    const url = `${getGitlabUrl()}/oauth/token`;
    const body = {
        client_id: getEnvironment().config.GITLAB_CLIENT_ID,
        client_secret: getEnvironment().config.GITLAB_CLIENT_SECRET,
        grant_type: 'authorization_code',
        redirect_uri: getEnvironment().config.GITLAB_REDIRECT_URI,
        // grant_type
        // code_verifier: 'CODE_VERIFIER',
        code,
    };
    const options = {
        headers: {
            accept: 'application/json',
        },
    };

    const providerResp = await axios.post(url, body, options);

    repositories.set('gitlabrepo');
    const repo = repositories.get();
    const fullUser = await repo.userAsync(providerResp.data.access_token);

    const user = {
        username: fullUser.username,
        repos_url: fullUser.web_url,
    };
    return {
        user,
        opts: providerResp.data,
    };
};

export default {
    completeLoginAsync,
    getOauthReturnUrl,
    getOauthRedirectUrl,
    isConfigured,
    name,
};

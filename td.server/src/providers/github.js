/**
 * @name github
 * @description Identity provider for Github OAuth
 */
import axios from 'axios';

import { getEnvironment } from '../env/Env.js';
import * as repositories from '../repositories/index.js';

const name = 'github';

/**
 * Determines if the GitHub provider is configured
 * @returns {Boolean}
 */
const isConfigured = () => Boolean(getEnvironment().config.GITHUB_CLIENT_ID);

/**
 * Gets the Github endpoint, which will be github.com by default OR a custom endpoint for Github enterprise
 * @returns {String}
 */
const getGithubUrl = () => {
    const enterpriseHostname = getEnvironment().config.GITHUB_ENTERPRISE_HOSTNAME;
    if (enterpriseHostname) {
        const port = getEnvironment().config.GITHUB_ENTERPRISE_PORT || '';
        const protocol = getEnvironment().config.GITHUB_ENTERPRISE_PROTOCOL || 'https';
        return `${protocol}://${enterpriseHostname}${port ? ':' + port : ''}`;
    }
    return 'https://github.com';
};

/**
 * Gets the Github OAuth Login URL
 * @returns {String}
 */
const getOauthRedirectUrl = () => {
    const scope = getEnvironment().config.GITHUB_SCOPE || 'public_repo';
    return `${getGithubUrl()}/login/oauth/authorize?scope=${scope}&client_id=${getEnvironment().config.GITHUB_CLIENT_ID}`;
};

/**
 * Gets the return URL for our application, returning from github
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
    const url = `${getGithubUrl()}/login/oauth/access_token`;
    const body = {
        client_id: getEnvironment().config.GITHUB_CLIENT_ID,
        client_secret: getEnvironment().config.GITHUB_CLIENT_SECRET,
        code,
    };
    const options = {
        headers: {
            accept: 'application/json',
        },
    };

    const providerResp = await axios.post(url, body, options);

    repositories.set('githubrepo');
    const repo = repositories.get();
    const fullUser = await repo.userAsync(providerResp.data.access_token);
    const user = {
        username: fullUser.login,
        repos_url: fullUser.repos_url,
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

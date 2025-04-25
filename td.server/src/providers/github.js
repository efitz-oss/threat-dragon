/**
 * @name github
 * @description Identity provider for Github OAuth
 */
import axios from 'axios';

import env from '../env/Env.js';
import repositories from '../repositories/index.js';

const name = 'github';

/**
 * Determines if the GitHub provider is configured
 * @returns {Boolean}
 */
const isConfigured = () => Boolean(env.get().config.GITHUB_CLIENT_ID);

/**
 * Gets the Github endpoint, which will be github.com by default OR a custom endpoint for Github enterprise
 * @returns {String}
 */
const getGithubUrl = () => {
    const enterpriseHostname = env.get().config.GITHUB_ENTERPRISE_HOSTNAME;
    if (enterpriseHostname) {
        const port = env.get().config.GITHUB_ENTERPRISE_PORT || '';
        const protocol = env.get().config.GITHUB_ENTERPRISE_PROTOCOL || 'https';
        return `${protocol}://${enterpriseHostname}${port ? ':' + port : ''}`;
    }
    return 'https://github.com';
};

/**
 * Gets the Github OAuth Login URL
 * @param {String} providerName - The name of the provider to store in state
 * @returns {String}
 */
const getOauthRedirectUrl = (providerName) => {
    const scope = env.get().config.GITHUB_SCOPE || 'public_repo';
    return `${getGithubUrl()}/login/oauth/authorize?scope=${scope}&client_id=${
        env.get().config.GITHUB_CLIENT_ID
    }&state=${providerName}`;
};

/**
 * Gets the return URL for our application, returning from github
 * @param {string} code
 * @returns {String}
 */
const getOauthReturnUrl = (code) => {
    let returnUrl = `/#/oauth-return?code=${code}`;
    if (env.get().config.NODE_ENV === 'development') {
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

    // Get the redirect URI from environment and ensure it uses HTTPS if needed
    let redirectUri = env.get().config.GITHUB_REDIRECT_URI;

    // If we're in production and the URI starts with http:// but we're using https,
    // update it to use https:// to match the actual protocol being used
    if (
        env.get().config.NODE_ENV === 'production' &&
        redirectUri &&
        redirectUri.startsWith('http://') &&
        (env.get().config.SERVER_API_PROTOCOL === 'https' ||
            env.get().config.APP_USE_TLS === 'true')
    ) {
        const httpsUri = redirectUri.replace('http://', 'https://');
        console.log(`GitHub OAuth: Converting redirect URI from ${redirectUri} to ${httpsUri}`);
        redirectUri = httpsUri;
    }

    console.log(`GitHub OAuth: Using redirect URI: ${redirectUri}`);

    const body = {
        client_id: env.get().config.GITHUB_CLIENT_ID,
        client_secret: env.get().config.GITHUB_CLIENT_SECRET,
        code,
        redirect_uri: redirectUri
    };

    console.log(`GitHub OAuth: Exchanging code for token at ${url}`);
    console.log(
        `GitHub OAuth: Request body: ${JSON.stringify({
            client_id: env.get().config.GITHUB_CLIENT_ID,
            code_length: code?.length || 0,
            redirect_uri: redirectUri
        })}`
    );

    const options = {
        headers: {
            accept: 'application/json'
        }
    };

    try {
        const providerResp = await axios.post(url, body, options);
        console.log(
            `GitHub OAuth: Token exchange successful, received ${Object.keys(
                providerResp.data
            ).join(', ')}`
        );

        repositories.set('githubrepo');
        const repo = repositories.get();

        if (!providerResp.data.access_token) {
            console.error(
                `GitHub OAuth: No access token received. Response: ${JSON.stringify(
                    providerResp.data
                )}`
            );
            throw new Error('No access token received from GitHub');
        }

        console.log(`GitHub OAuth: Getting user info with access token`);
        const fullUser = await repo.userAsync(providerResp.data.access_token);
        console.log(`GitHub OAuth: User info received for ${fullUser.login}`);

        const user = {
            username: fullUser.login,
            repos_url: fullUser.repos_url
        };
        return {
            user,
            opts: providerResp.data
        };
    } catch (error) {
        console.error(`GitHub OAuth Error: ${error.message}`);
        if (error.response) {
            console.error(
                `GitHub OAuth Error Response: ${JSON.stringify({
                    status: error.response.status,
                    statusText: error.response.statusText,
                    data: error.response.data
                })}`
            );
        }
        throw error;
    }
};

export default {
    completeLoginAsync,
    getOauthReturnUrl,
    getOauthRedirectUrl,
    isConfigured,
    name
};

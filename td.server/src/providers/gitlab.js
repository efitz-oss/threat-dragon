/**
 * @name gitlab
 * @description Identity provider for Gitlab OAuth
 */
import axios from 'axios';

import env from '../env/Env.js';
import repositories from '../repositories/index.js';

const name = 'gitlab';

/**
 * Determines if the GitHub provider is configured
 * @returns {Boolean}
 */
const isConfigured = () => Boolean(env.get().config.GITLAB_CLIENT_ID);

/**
 * Gets the Gitlab endpoint, which will be gitlab.com by default OR a custom endpoint for Gitlab enterprise scenarios
 * @returns {String}
 */
const getGitlabUrl = () => env.get().config.GITLAB_HOST || 'https://gitlab.com';

/**
 * Gets the Gitlab OAuth Login URL
 * @param {String} providerName - The name of the provider to store in state
 * @returns {String}
 */
const getOauthRedirectUrl = (providerName) => {
    const scope =
        env.get().config.GITLAB_SCOPE || 'read_user read_repository write_repository profile';
    return `${getGitlabUrl()}/oauth/authorize?scope=${scope}&redirect_uri=${
        env.get().config.GITLAB_REDIRECT_URI
    }&response_type=code&client_id=${env.get().config.GITLAB_CLIENT_ID}&state=${providerName}`;
};

/**
 * Gets the return URL for our application, returning from gitlab
 * @param {string} code
 * @returns {String}
 */
const getOauthReturnUrl = (code) => {
    // Use the same format as Google provider (without the hash)
    let returnUrl = `/oauth-return?code=${code}`;
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
    console.log('=========== GITLAB OAUTH TOKEN EXCHANGE START ===========');
    console.log(`Starting GitLab completeLoginAsync with code length: ${code?.length || 0}`);
    console.log(`NODE_ENV: ${env.get().config.NODE_ENV}`);

    const url = `${getGitlabUrl()}/oauth/token`;
    console.log(`Token exchange URL: ${url}`);

    // Get the redirect URI from environment and ensure it uses HTTPS if needed
    let redirectUri = env.get().config.GITLAB_REDIRECT_URI;

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
        console.log(`GitLab OAuth: Converting redirect URI from ${redirectUri} to ${httpsUri}`);
        redirectUri = httpsUri;
    }

    console.log(`GitLab OAuth: Using redirect URI: ${redirectUri}`);
    console.log(`GitLab client ID configured: ${Boolean(env.get().config.GITLAB_CLIENT_ID)}`);
    console.log(`GitLab client ID length: ${env.get().config.GITLAB_CLIENT_ID?.length || 0}`);
    console.log(
        `GitLab client secret configured: ${Boolean(env.get().config.GITLAB_CLIENT_SECRET)}`
    );
    console.log(
        `GitLab client secret length: ${env.get().config.GITLAB_CLIENT_SECRET?.length || 0}`
    );

    const body = {
        client_id: env.get().config.GITLAB_CLIENT_ID,
        client_secret: env.get().config.GITLAB_CLIENT_SECRET,
        grant_type: 'authorization_code',
        redirect_uri: redirectUri,
        code
    };

    console.log(`GitLab OAuth: Exchanging code for token at ${url}`);
    console.log(
        `GitLab OAuth: Request body: ${JSON.stringify({
            client_id: env.get().config.GITLAB_CLIENT_ID,
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
        console.log(`GitLab OAuth: Sending token request to GitLab`);
        console.log(`GitLab OAuth: Request URL: ${url}`);
        console.log(`GitLab OAuth: Request method: POST`);
        console.log(`GitLab OAuth: Request headers: ${JSON.stringify(options.headers)}`);

        const providerResp = await axios.post(url, body, options);

        console.log(`GitLab OAuth: Received token response from GitLab`);
        console.log(`GitLab OAuth: Response status: ${providerResp.status}`);
        console.log(
            `GitLab OAuth: Response has access_token: ${Boolean(providerResp.data.access_token)}`
        );
        console.log(`GitLab OAuth: Response has error: ${Boolean(providerResp.data.error)}`);

        if (providerResp.data.error) {
            console.error(`GitLab OAuth Error: ${providerResp.data.error}`);
            console.error(`GitLab OAuth Error Description: ${providerResp.data.error_description}`);
            throw new Error(
                `GitLab OAuth Error: ${
                    providerResp.data.error_description || providerResp.data.error
                }`
            );
        }

        console.log(
            `GitLab OAuth: Token exchange successful, received ${Object.keys(
                providerResp.data
            ).join(', ')}`
        );

        repositories.set('gitlabrepo');
        const repo = repositories.get();

        if (!providerResp.data.access_token) {
            console.error(
                `GitLab OAuth: No access token received. Response: ${JSON.stringify(
                    providerResp.data
                )}`
            );
            throw new Error('No access token received from GitLab');
        }

        console.log(`GitLab OAuth: Successfully obtained access token, fetching user info`);
        console.log(`GitLab OAuth: Getting user info with access token`);

        try {
            const fullUser = await repo.userAsync(providerResp.data.access_token);
            console.log(`GitLab OAuth: User info received for ${fullUser.username}`);
            console.log(`GitLab OAuth: User info has name: ${Boolean(fullUser.name)}`);
            console.log(`GitLab OAuth: User info has email: ${Boolean(fullUser.email)}`);

            const user = {
                username: fullUser.username,
                email: fullUser.email,
                repos_url: fullUser.web_url
            };

            console.log(`GitLab OAuth: Created user object with username: ${user.username}`);
            if (user.email) {
                console.log(`GitLab OAuth: Created user object with email: ${user.email}`);
            }

            console.log('=========== GITLAB OAUTH TOKEN EXCHANGE COMPLETE ===========');

            return {
                user,
                opts: providerResp.data
            };
        } catch (userError) {
            console.error(`GitLab OAuth: Error fetching user info: ${userError.message}`);
            if (userError.response) {
                console.error(
                    `GitLab OAuth: User info response status: ${userError.response.status}`
                );
                console.error(
                    `GitLab OAuth: User info response data: ${JSON.stringify(
                        userError.response.data || {}
                    )}`
                );
            }
            throw userError;
        }
    } catch (error) {
        console.error(`GitLab OAuth Error: ${error.message}`);
        console.error(`GitLab OAuth Error Stack: ${error.stack}`);

        if (error.response) {
            console.error(
                `GitLab OAuth Error Response: ${JSON.stringify({
                    status: error.response.status,
                    statusText: error.response.statusText,
                    data: error.response.data
                })}`
            );
        }

        console.log('=========== GITLAB OAUTH TOKEN EXCHANGE FAILED ===========');
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

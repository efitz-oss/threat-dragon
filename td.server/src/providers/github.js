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
    console.log('=========== GITHUB OAUTH TOKEN EXCHANGE START ===========');
    console.log(`Starting GitHub completeLoginAsync with code length: ${code?.length || 0}`);
    console.log(`NODE_ENV: ${env.get().config.NODE_ENV}`);

    // Validate GitHub client credentials
    if (!env.get().config.GITHUB_CLIENT_ID) {
        console.error('GitHub OAuth Error: GITHUB_CLIENT_ID is not configured');
        throw new Error('GitHub client ID is not configured');
    }

    if (!env.get().config.GITHUB_CLIENT_SECRET) {
        console.error('GitHub OAuth Error: GITHUB_CLIENT_SECRET is not configured');
        throw new Error('GitHub client secret is not configured');
    }

    const url = `${getGithubUrl()}/login/oauth/access_token`;
    console.log(`Token exchange URL: ${url}`);

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
    console.log(`GitHub client ID configured: ${Boolean(env.get().config.GITHUB_CLIENT_ID)}`);
    console.log(`GitHub client ID length: ${env.get().config.GITHUB_CLIENT_ID?.length || 0}`);
    console.log(
        `GitHub client secret configured: ${Boolean(env.get().config.GITHUB_CLIENT_SECRET)}`
    );
    console.log(
        `GitHub client secret length: ${env.get().config.GITHUB_CLIENT_SECRET?.length || 0}`
    );

    const body = {
        client_id: env.get().config.GITHUB_CLIENT_ID,
        client_secret: env.get().config.GITHUB_CLIENT_SECRET,
        code,
        redirect_uri: redirectUri
    };

    console.log(`GitHub OAuth: Exchanging code for token at ${url}`);

    // Log request details without sensitive information
    console.log(
        `GitHub OAuth: Request body: ${JSON.stringify({
            client_id: '[REDACTED]', // Don't log actual client ID
            code_length: code?.length || 0,
            redirect_uri: redirectUri ? '[REDACTED_URI]' : 'none' // Don't log actual URI
        })}`
    );

    const options = {
        headers: {
            accept: 'application/json'
        }
    };

    try {
        console.log(`GitHub OAuth: Sending token request to GitHub`);
        console.log(`GitHub OAuth: Request URL: ${url}`);
        console.log(`GitHub OAuth: Request method: POST`);
        console.log(`GitHub OAuth: Request headers: ${JSON.stringify(options.headers)}`);

        const providerResp = await axios.post(url, body, options);

        console.log(`GitHub OAuth: Received token response from GitHub`);
        console.log(`GitHub OAuth: Response status: ${providerResp.status}`);

        // Log presence of tokens without revealing their values
        console.log(
            `GitHub OAuth: Response has access_token: ${Boolean(providerResp.data.access_token)}`
        );
        console.log(
            `GitHub OAuth: Response has refresh_token: ${Boolean(providerResp.data.refresh_token)}`
        );
        console.log(`GitHub OAuth: Response has error: ${Boolean(providerResp.data.error)}`);

        if (providerResp.data.error) {
            // Log error information (errors are generally safe to log)
            console.error(`GitHub OAuth Error: ${providerResp.data.error}`);
            console.error(`GitHub OAuth Error Description: ${providerResp.data.error_description}`);
            throw new Error(
                `GitHub OAuth Error: ${
                    providerResp.data.error_description || providerResp.data.error
                }`
            );
        }

        // Log keys received without revealing their values
        console.log(
            `GitHub OAuth: Token exchange successful, received keys: ${Object.keys(
                providerResp.data
            ).join(', ')}`
        );

        // Validate access token
        if (!providerResp.data.access_token) {
            console.error(
                `GitHub OAuth: No access token received. Response: ${JSON.stringify(
                    providerResp.data
                )}`
            );
            throw new Error('No access token received from GitHub');
        }

        console.log(`GitHub OAuth: Successfully obtained access token, fetching user info`);

        // Set up GitHub API URL for user info
        const githubApiUrl = env.get().config.GITHUB_ENTERPRISE_HOSTNAME
            ? `${getGithubUrl()}/api/v3/user`
            : 'https://api.github.com/user';

        console.log(`GitHub OAuth: Getting user info from ${githubApiUrl}`);

        try {
            // Make direct API call to GitHub to get user info
            const userResponse = await axios.get(githubApiUrl, {
                headers: {
                    Authorization: `token ${providerResp.data.access_token}`,
                    Accept: 'application/vnd.github.v3+json'
                }
            });

            if (!userResponse.data || !userResponse.data.login) {
                console.error('GitHub OAuth: Invalid user data received');
                console.error(`GitHub OAuth: User response: ${JSON.stringify(userResponse.data)}`);
                throw new Error('Invalid user data received from GitHub');
            }

            const fullUser = userResponse.data;

            // Log user info without revealing sensitive data
            console.log(`GitHub OAuth: User info received for ${fullUser.login || '[UNKNOWN]'}`);
            console.log(`GitHub OAuth: User info has name: ${Boolean(fullUser.name)}`);
            console.log(`GitHub OAuth: User info has email: ${Boolean(fullUser.email)}`);

            // Don't log any actual user data that might be sensitive

            // Set repository for future use
            try {
                console.log('Setting repository to githubrepo');
                repositories.set('githubrepo');
                console.log('Repository set successfully');
            } catch (repoError) {
                // Log but don't fail if repository setting fails
                console.error(`Warning - Error setting repository: ${repoError.message}`);
                console.error(`This may cause issues with future operations`);
            }

            const user = {
                username: fullUser.login,
                email: fullUser.email,
                repos_url: fullUser.repos_url
            };

            console.log(
                `GitHub OAuth: Created user object with username: ${user.username || '[UNKNOWN]'}`
            );
            if (user.email) {
                // Don't log the actual email address
                console.log(`GitHub OAuth: Created user object with email: [REDACTED]`);
            }

            console.log('=========== GITHUB OAUTH TOKEN EXCHANGE COMPLETE ===========');

            return {
                user,
                opts: providerResp.data
            };
        } catch (userError) {
            console.error(`GitHub OAuth: Error fetching user info: ${userError.message}`);
            if (userError.response) {
                console.error(
                    `GitHub OAuth: User info response status: ${userError.response.status}`
                );
                console.error(
                    `GitHub OAuth: User info response data: ${JSON.stringify(
                        userError.response.data || {}
                    )}`
                );
            }
            throw new Error(`Failed to fetch GitHub user info: ${userError.message}`);
        }
    } catch (error) {
        console.error(`GitHub OAuth Error: ${error.message}`);
        console.error(`GitHub OAuth Error Stack: ${error.stack}`);

        if (error.response) {
            console.error(
                `GitHub OAuth Error Response: ${JSON.stringify({
                    status: error.response.status,
                    statusText: error.response.statusText,
                    data: error.response.data
                })}`
            );
        }

        console.log('=========== GITHUB OAUTH TOKEN EXCHANGE FAILED ===========');
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

/**
 * @name bitbucket
 * @description Identity provider for Bitbucket OAuth
 */
import axios from 'axios';

import env from '../env/Env.js';
import repositories from '../repositories/index.js';

const name = 'bitbucket';

/**
 * Determines if the Bitbucket provider is configured
 * @returns {Boolean}
 */
const isConfigured = () => Boolean(env.get().config.BITBUCKET_CLIENT_ID);

/**
 * Gets the Bitbucket endpoint, which will be bitbucket.com by default OR a custom endpoint for Bitbucket enterprise
 * @returns {String}
 */
const getBitbucketUrl = () => {
    const enterpriseHostname = env.get().config.BITBUCKET_ENTERPRISE_HOSTNAME;
    if (enterpriseHostname) {
        const port = env.get().config.BITBUCKET_ENTERPRISE_PORT || '';
        const protocol = env.get().config.BITBUCKET_ENTERPRISE_PROTOCOL || 'https';
        return `${protocol}://${enterpriseHostname}${port ? ':' + port : ''}`;
    }
    return 'https://bitbucket.org';
};

/**
 * Gets the Bitbucket OAuth Login URL
 * @param {String} providerName - The name of the provider to store in state
 * @returns {String}
 */
const getOauthRedirectUrl = (providerName) => {
    const scope = env.get().config.BITBUCKET_SCOPE || '';
    return `${getBitbucketUrl()}/site/oauth2/authorize?scope=${scope}&response_type=code&client_id=${
        env.get().config.BITBUCKET_CLIENT_ID
    }&state=${providerName}`;
};

/**
 * Gets the return URL for our application, returning from bitbucket
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
    console.log('=========== BITBUCKET OAUTH TOKEN EXCHANGE START ===========');
    console.log(`Starting BitBucket completeLoginAsync with code length: ${code?.length || 0}`);
    console.log(`NODE_ENV: ${env.get().config.NODE_ENV}`);

    const url = `${getBitbucketUrl()}/site/oauth2/access_token`;
    console.log(`Token exchange URL: ${url}`);

    console.log(`BitBucket client ID configured: ${Boolean(env.get().config.BITBUCKET_CLIENT_ID)}`);
    console.log(`BitBucket client ID length: ${env.get().config.BITBUCKET_CLIENT_ID?.length || 0}`);
    console.log(
        `BitBucket client secret configured: ${Boolean(env.get().config.BITBUCKET_CLIENT_SECRET)}`
    );
    console.log(
        `BitBucket client secret length: ${env.get().config.BITBUCKET_CLIENT_SECRET?.length || 0}`
    );

    const form = new FormData();
    form.append('grant_type', 'authorization_code');
    form.append('client_id', env.get().config.BITBUCKET_CLIENT_ID);
    form.append('client_secret', env.get().config.BITBUCKET_CLIENT_SECRET);
    form.append('code', code);

    console.log(`BitBucket OAuth: Exchanging code for token at ${url}`);
    console.log(
        `BitBucket OAuth: Request form data prepared with code length: ${code?.length || 0}`
    );

    const options = {
        headers: {
            'Content-Type': `multipart/form-data; boundary=${form._boundary}`
        }
    };

    try {
        console.log(`BitBucket OAuth: Sending token request to BitBucket`);
        console.log(`BitBucket OAuth: Request URL: ${url}`);
        console.log(`BitBucket OAuth: Request method: POST`);

        repositories.set('bitbucketrepo');
        const repo = repositories.get();
        const providerResp = await axios.post(url, form, options);

        console.log(`BitBucket OAuth: Received token response from BitBucket`);
        console.log(`BitBucket OAuth: Response status: ${providerResp.status}`);
        console.log(
            `BitBucket OAuth: Response has access_token: ${Boolean(providerResp.data.access_token)}`
        );
        console.log(`BitBucket OAuth: Response has error: ${Boolean(providerResp.data.error)}`);

        if (providerResp.data.error) {
            console.error(`BitBucket OAuth Error: ${providerResp.data.error}`);
            console.error(
                `BitBucket OAuth Error Description: ${providerResp.data.error_description}`
            );
            throw new Error(
                `BitBucket OAuth Error: ${
                    providerResp.data.error_description || providerResp.data.error
                }`
            );
        }

        console.log(
            `BitBucket OAuth: Token exchange successful, received ${Object.keys(
                providerResp.data
            ).join(', ')}`
        );

        if (!providerResp.data.access_token) {
            console.error(
                `BitBucket OAuth: No access token received. Response: ${JSON.stringify(
                    providerResp.data
                )}`
            );
            throw new Error('No access token received from BitBucket');
        }

        console.log(`BitBucket OAuth: Successfully obtained access token, fetching user info`);
        console.log(`BitBucket OAuth: Getting user info with access token`);

        try {
            const fullUser = await repo.userAsync(providerResp.data.access_token);
            console.log(`BitBucket OAuth: User info received for ${fullUser.display_name}`);

            const user = {
                username: fullUser.display_name,
                email: fullUser.email,
                repos_url: fullUser.repos_url
            };

            console.log(`BitBucket OAuth: Created user object with username: ${user.username}`);
            if (user.email) {
                console.log(`BitBucket OAuth: Created user object with email: ${user.email}`);
            }

            console.log('=========== BITBUCKET OAUTH TOKEN EXCHANGE COMPLETE ===========');

            return {
                user,
                opts: providerResp.data
            };
        } catch (userError) {
            console.error(`BitBucket OAuth: Error fetching user info: ${userError.message}`);
            if (userError.response) {
                console.error(
                    `BitBucket OAuth: User info response status: ${userError.response.status}`
                );
                console.error(
                    `BitBucket OAuth: User info response data: ${JSON.stringify(
                        userError.response.data || {}
                    )}`
                );
            }
            throw userError;
        }
    } catch (error) {
        console.error(`BitBucket OAuth Error: ${error.message}`);
        console.error(`BitBucket OAuth Error Stack: ${error.stack}`);

        if (error.response) {
            console.error(
                `BitBucket OAuth Error Response: ${JSON.stringify({
                    status: error.response.status,
                    statusText: error.response.statusText,
                    data: error.response.data
                })}`
            );
        }

        console.log('=========== BITBUCKET OAUTH TOKEN EXCHANGE FAILED ===========');
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

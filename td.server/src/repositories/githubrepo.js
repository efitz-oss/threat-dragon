import env from '../env/Env.js';
import fetch from 'node-fetch';

const repoRootDirectory = () =>
    env.get().config.GITHUB_REPO_ROOT_DIRECTORY || env.get().config.REPO_ROOT_DIRECTORY;

const getBaseUrl = () => {
    const enterpriseHostname = env.get().config.GITHUB_ENTERPRISE_HOSTNAME;
    if (enterpriseHostname) {
        const port = env.get().config.GITHUB_ENTERPRISE_PORT;
        const protocol = env.get().config.GITHUB_ENTERPRISE_PROTOCOL || 'https';
        return `${protocol}://${enterpriseHostname}${port ? `:${port}` : ''}/api/v3`;
    }
    return 'https://api.github.com';
};

const fetchGitHub = async (path, accessToken, options = {}) => {
    if (!accessToken) {
        throw new Error('GitHub API error: No access token provided');
    }

    const baseUrl = getBaseUrl();
    const url = `${baseUrl}${path}`;

    try {
        console.log(`GitHub API request to: ${url}`);
        const response = await fetch(url, {
            ...options,
            headers: {
                Authorization: `token ${accessToken}`,
                Accept: 'application/vnd.github.v3+json',
                ...options.headers
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`GitHub API error (${response.status}): ${response.statusText}`);
            console.error(`Error response body: ${errorText}`);

            throw new Error(
                `GitHub API error (${response.status}): ${response.statusText} - ${errorText}`
            );
        }

        return response.json();
    } catch (error) {
        console.error(`Error fetching from GitHub API: ${error.message}`);
        if (error.stack) {
            console.error(`Error stack: ${error.stack}`);
        }
        throw error;
    }
};

const reposAsync = async (page, accessToken, searchQueries = []) => {
    await Promise.resolve(); // Ensure async function has await expression

    // Log the parameters for debugging
    console.log(`GitHub reposAsync called with page: ${page}`);
    console.log(`GitHub reposAsync called with searchQueries:`, searchQueries);

    // Construct the URL with pagination
    const url = `/user/repos?page=${page}&per_page=100`;

    console.log(`GitHub reposAsync using URL: ${url}`);

    try {
        const response = await fetchGitHub(url, accessToken, {
            method: 'GET',
            headers: {
                Accept: 'application/vnd.github.v3+json'
            }
        });

        // Return the response in the expected format [repos, headers, pageLinks]
        return [response, {}, {}];
    } catch (error) {
        console.error(`Error in reposAsync: ${error.message}`);
        throw error;
    }
};

const searchAsync = async (page, accessToken, searchQueries = []) => {
    await Promise.resolve(); // Ensure async function has await expression

    // Log the parameters for debugging
    console.log(`GitHub searchAsync called with page: ${page}`);
    console.log(`GitHub searchAsync called with searchQueries:`, searchQueries);

    // Filter out empty search queries
    const validQueries = searchQueries.filter((q) => q && typeof q === 'string' && q.trim() !== '');

    // Use the first valid query or default to a broad search
    let searchQuery = 'stars:>0';
    if (validQueries.length > 0) {
        searchQuery = validQueries[0];
    }

    console.log(`GitHub searchAsync using query: ${searchQuery}`);

    try {
        const url = `/search/repositories?q=${encodeURIComponent(
            searchQuery
        )}&page=${page}&per_page=100`;
        console.log(`GitHub searchAsync using URL: ${url}`);

        const data = await fetchGitHub(url, accessToken);

        // Return the response in the expected format [repos, headers, pageLinks]
        return [
            data,
            {},
            {
                next: data.total_count > page * 100,
                prev: page > 1
            }
        ];
    } catch (error) {
        console.error(`Error in searchAsync: ${error.message}`);
        throw error;
    }
};

const userAsync = async (accessToken) => {
    await Promise.resolve(); // Ensure async function has await expression
    return fetchGitHub('/user', accessToken);
};

const branchesAsync = async (repoInfo, accessToken) => {
    await Promise.resolve(); // Ensure async function has await expression
    return fetchGitHub(
        `/repos/${repoInfo.organisation}/${repoInfo.repo}/branches?page=${repoInfo.page}`,
        accessToken
    );
};

const modelsAsync = async (branchInfo, accessToken) => {
    await Promise.resolve(); // Ensure async function has await expression
    return fetchGitHub(
        `/repos/${branchInfo.organisation}/${branchInfo.repo}/contents/${repoRootDirectory()}?ref=${
            branchInfo.branch
        }`,
        accessToken
    );
};

const modelAsync = async (modelInfo, accessToken) => {
    await Promise.resolve(); // Ensure async function has await expression
    const data = await fetchGitHub(
        `/repos/${modelInfo.organisation}/${modelInfo.repo}/contents/${getModelPath(
            modelInfo
        )}?ref=${modelInfo.branch}`,
        accessToken
    );
    return [data];
};

const createAsync = async (modelInfo, accessToken) => {
    await Promise.resolve(); // Ensure async function has await expression
    return fetchGitHub(
        `/repos/${modelInfo.organisation}/${modelInfo.repo}/contents/${getModelPath(modelInfo)}`,
        accessToken,
        {
            method: 'PUT',
            body: JSON.stringify({
                message: 'Created by OWASP Threat Dragon',
                content: Buffer.from(getModelContent(modelInfo)).toString('base64'),
                branch: modelInfo.branch
            })
        }
    );
};

const updateAsync = async (modelInfo, accessToken) => {
    await Promise.resolve(); // Ensure async function has await expression
    const original = await modelAsync(modelInfo, accessToken);
    return fetchGitHub(
        `/repos/${modelInfo.organisation}/${modelInfo.repo}/contents/${getModelPath(modelInfo)}`,
        accessToken,
        {
            method: 'PUT',
            body: JSON.stringify({
                message: 'Updated by OWASP Threat Dragon',
                content: Buffer.from(getModelContent(modelInfo)).toString('base64'),
                sha: original[0].sha,
                branch: modelInfo.branch
            })
        }
    );
};

const deleteAsync = async (modelInfo, accessToken) => {
    await Promise.resolve(); // Ensure async function has await expression
    const content = await modelAsync(modelInfo, accessToken);
    return fetchGitHub(
        `/repos/${modelInfo.organisation}/${modelInfo.repo}/contents/${getModelPath(modelInfo)}`,
        accessToken,
        {
            method: 'DELETE',
            body: JSON.stringify({
                message: 'Deleted by OWASP Threat Dragon',
                sha: content[0].sha,
                branch: modelInfo.branch
            })
        }
    );
};

const getModelPath = (modelInfo) =>
    `${repoRootDirectory()}/${modelInfo.model}/${modelInfo.model}.json`;
const getModelContent = (modelInfo) => JSON.stringify(modelInfo.body, null, '  ');

export default {
    name: 'githubrepo',
    branchesAsync,
    createAsync,
    deleteAsync,
    modelAsync,
    modelsAsync,
    reposAsync,
    searchAsync,
    updateAsync,
    userAsync
};

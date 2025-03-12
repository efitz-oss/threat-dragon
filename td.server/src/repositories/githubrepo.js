import github from 'octonode';
import { getEnvironment } from '../env/Env.js';

/**
 * Gets the repository root directory from configuration
 * @returns {string} Repository root directory
 */
function repoRootDirectory() {
    return (
        getEnvironment().config.GITHUB_REPO_ROOT_DIRECTORY ||
        getEnvironment().config.REPO_ROOT_DIRECTORY
    );
}

/**
 * Gets a GitHub client instance
 * @param {string} accessToken - GitHub access token
 * @returns {Object} GitHub client
 */
function getClient(accessToken) {
    const enterpriseHostname = getEnvironment().config.GITHUB_ENTERPRISE_HOSTNAME;
    if (enterpriseHostname) {
        const port = getEnvironment().config.GITHUB_ENTERPRISE_PORT;
        const protocol = getEnvironment().config.GITHUB_ENTERPRISE_PROTOCOL;
        const enterpriseOpts = { hostname: `${enterpriseHostname}/api/v3` };
        if (port) {
            enterpriseOpts.port = parseInt(port, 10);
        }
        if (protocol) {
            enterpriseOpts.protocol = protocol;
        }

        return github.client(accessToken, enterpriseOpts);
    }
    return github.client(accessToken);
}

/**
 * Gets the full repository name
 * @param {Object} info - Repository info
 * @returns {string} Full repository name
 */
function getRepoFullName(info) {
    return `${info.organisation}/${info.repo}`;
}

/**
 * Gets the model file path
 * @param {Object} modelInfo - Model info
 * @returns {string} Model path
 */
function getModelPath(modelInfo) {
    return `${repoRootDirectory()}/${modelInfo.model}/${modelInfo.model}.json`;
}

/**
 * Formats model content for GitHub
 * @param {Object} modelInfo - Model info containing body
 * @returns {string} JSON string of model content
 */
function getModelContent(modelInfo) {
    return JSON.stringify(modelInfo.body, null, '  ');
}

/**
 * Gets repositories for the authenticated user
 * @param {number} page - Page number
 * @param {string} accessToken - GitHub access token
 * @returns {Promise<Array>} List of repositories
 */
function reposAsync(page, accessToken) {
    return getClient(accessToken).me().reposAsync(page);
}

/**
 * Searches for repositories
 * @param {number} page - Page number
 * @param {string} accessToken - GitHub access token
 * @param {Array} searchQuerys - Search queries
 * @returns {Promise<Array>} Search results
 */
function searchAsync(page, accessToken, searchQuerys = []) {
    return getClient(accessToken).search().reposAsync({ page: page, q: searchQuerys });
}

/**
 * Gets user information
 * @param {string} accessToken - GitHub access token
 * @returns {Promise<Object>} User info
 */
async function userAsync(accessToken) {
    const resp = await getClient(accessToken).me().infoAsync();
    return resp[0];
}

/**
 * Gets branches for a repository
 * @param {Object} repoInfo - Repository info
 * @param {string} accessToken - GitHub access token
 * @returns {Promise<Array>} Branches
 */
function branchesAsync(repoInfo, accessToken) {
    const client = getClient(accessToken);
    return client.repo(getRepoFullName(repoInfo)).branchesAsync(repoInfo.page);
}

/**
 * Gets models list for a branch
 * @param {Object} branchInfo - Branch info
 * @param {string} accessToken - GitHub access token
 * @returns {Promise<Array>} Models
 */
function modelsAsync(branchInfo, accessToken) {
    return getClient(accessToken)
        .repo(getRepoFullName(branchInfo))
        .contentsAsync(repoRootDirectory(), branchInfo.branch);
}

/**
 * Gets a specific model
 * @param {Object} modelInfo - Model info
 * @param {string} accessToken - GitHub access token
 * @returns {Promise<Object>} Model data
 */
function modelAsync(modelInfo, accessToken) {
    return getClient(accessToken)
        .repo(getRepoFullName(modelInfo))
        .contentsAsync(getModelPath(modelInfo), modelInfo.branch);
}

/**
 * Creates a new model
 * @param {Object} modelInfo - Model info
 * @param {string} accessToken - GitHub access token
 * @returns {Promise<Object>} Creation result
 */
function createAsync(modelInfo, accessToken) {
    return getClient(accessToken)
        .repo(getRepoFullName(modelInfo))
        .createContentsAsync(
            getModelPath(modelInfo),
            'Created by OWASP Threat Dragon',
            getModelContent(modelInfo),
            modelInfo.branch
        );
}

/**
 * Updates an existing model
 * @param {Object} modelInfo - Model info
 * @param {string} accessToken - GitHub access token
 * @returns {Promise<Object>} Update result
 */
async function updateAsync(modelInfo, accessToken) {
    const original = await modelAsync(modelInfo, accessToken);
    const repo = getRepoFullName(modelInfo);
    const path = getModelPath(modelInfo);
    const modelContent = getModelContent(modelInfo);

    return getClient(accessToken)
        .repo(repo)
        .updateContentsAsync(
            path,
            'Updated by OWASP Threat Dragon',
            modelContent,
            original[0].sha,
            modelInfo.branch
        );
}

/**
 * Deletes a model
 * @param {Object} modelInfo - Model info
 * @param {string} accessToken - GitHub access token
 * @returns {Promise<Object>} Deletion result
 */
async function deleteAsync(modelInfo, accessToken) {
    const content = await modelAsync(modelInfo, accessToken);
    return getClient(accessToken)
        .repo(getRepoFullName(modelInfo))
        .deleteContentsAsync(
            getModelPath(modelInfo),
            'Deleted by OWASP Threat Dragon',
            content[0].sha,
            modelInfo.branch
        );
}

/**
 * Creates a new branch
 * @param {Object} repoInfo - Repository info
 * @param {string} accessToken - GitHub access token
 * @returns {Promise<Object>} Branch creation result
 */
async function createBranchAsync(repoInfo, accessToken) {
    const client = getClient(accessToken);
    const repo = getRepoFullName(repoInfo);
    const resp = await client.repo(repo).refAsync(`heads/${repoInfo.ref}`);
    const sha = resp[0].object.sha;
    return client.repo(repo).createRefAsync(`refs/heads/${repoInfo.branch}`, sha);
}

export {
    branchesAsync,
    createAsync,
    createBranchAsync,
    deleteAsync,
    getClient,
    getModelContent,
    getModelPath,
    getRepoFullName,
    modelAsync,
    modelsAsync,
    repoRootDirectory,
    reposAsync,
    searchAsync,
    updateAsync,
    userAsync,
};

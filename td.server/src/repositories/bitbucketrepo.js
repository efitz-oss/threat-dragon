import pkg from 'bitbucket';
const { Bitbucket } = pkg;
import env from '../env/Env.js';

const repoRootDirectory = () => {
    const config = env.get().config;
    return (
        config.BITBUCKET_REPO_ROOT_DIRECTORY || config.REPO_ROOT_DIRECTORY || 'ThreatDragonModels'
    );
};

export class BitbucketClientWrapper {
    static getClient(clientOptions) {
        return new Bitbucket(clientOptions);
    }
}

export const getClient = (accessToken) => {
    const enterpriseHostname = env.get().config.BITBUCKET_ENTERPRISE_HOSTNAME;
    if (enterpriseHostname) {
        throw new Error(`Bitbucket Enterprise is not supported yet`);
    }
    const clientOptions = {
        auth: {
            token: accessToken
        }
    };
    return BitbucketClientWrapper.getClient(clientOptions);
};

export const reposAsync = async (page, accessToken, searchQuerys = []) => {
    //Migrated
    const workspace = env.get().config.BITBUCKET_WORKSPACE;
    const repos = await getClient(accessToken).repositories.list({
        workspace: workspace,
        page: page,
        pagelen: 10,
        q: searchQuerys.join(' AND ')
    });

    const responseRepos = repos.data.values.map((x) => {
        const newX = {};
        newX.full_name = x.full_name.toLowerCase().replace(workspace.toLowerCase() + '/', '');
        return newX;
    });

    return [responseRepos, null, { prev: hasPreviousPage(repos), next: hasNextPage(repos) }];
};

const hasNextPage = (response) => response.data.next !== undefined && response.data.next !== null;

const hasPreviousPage = (response) =>
    response.data.previous !== undefined && response.data.previous !== null;

// Note: searchAsync was previously defined but not implemented properly
// The Bitbucket API's search functionality is handled via the reposAsync function with search queries
export const searchAsync = (page, accessToken, searchQueries) =>
    reposAsync(page, accessToken, searchQueries);

export const userAsync = (accessToken) => getClient(accessToken).users.getAuthedUser();

export const branchesAsync = async (repoInfo, accessToken) => {
    const workspace = env.get().config.BITBUCKET_WORKSPACE;
    const client = getClient(accessToken);
    const branches = await client.repositories.listBranches({
        workspace: workspace,
        repo_slug: repoInfo.repo,
        page: repoInfo.page,
        pagelen: 10
    });
    const branchesResponse = branches.data.values;

    return [
        branchesResponse,
        null,
        { prev: hasPreviousPage(branches), next: hasNextPage(branches) }
    ];
};

export const modelsAsync = async (branchInfo, accessToken) => {
    const workspace = env.get().config.BITBUCKET_WORKSPACE;

    try {
        const client = getClient(accessToken);

        const { data } = await client.repositories.getBranch({
            workspace: workspace,
            repo_slug: branchInfo.repo,
            name: branchInfo.branch
        });
        const commitId = data.target.hash;

        try {
            const tree = await client.source.read({
                path: repoRootDirectory(),
                workspace: workspace,
                repo_slug: branchInfo.repo,
                commit: commitId
            });

            // If we have values, process them
            if (tree.data && tree.data.values && Array.isArray(tree.data.values)) {
                tree.data.values.map((x) => {
                    x.name = x.path.replace(`${repoRootDirectory()}/`, '');
                    return x;
                });
                return [tree.data.values];
            } else {
                // No values found, return empty array
                console.log(
                    `No threat models found in ${repoRootDirectory()} for ${branchInfo.repo}/${
                        branchInfo.branch
                    }`
                );
                return [[]];
            }
        } catch (error) {
            // Handle "file not found" or other errors when reading the directory
            console.log(`Error reading ${repoRootDirectory()} directory: ${error.message}`);
            if (
                error.message &&
                (error.message.includes('Not Found') || error.message.includes('404'))
            ) {
                // Directory doesn't exist, return empty array
                console.log(`Directory ${repoRootDirectory()} not found, returning empty array`);
                return [[]];
            }
            throw error;
        }
    } catch (error) {
        console.error(`Error in modelsAsync: ${error.message}`);
        // Return empty array instead of throwing
        return [[]];
    }
};

export const modelAsync = async (modelInfo, accessToken) => {
    const workspace = env.get().config.BITBUCKET_WORKSPACE;

    try {
        const client = getClient(accessToken);
        const { data } = await client.repositories.getBranch({
            workspace: workspace,
            repo_slug: modelInfo.repo,
            name: modelInfo.branch
        });
        const commitId = data.target.hash;

        try {
            const tree = await client.source.read({
                path: getModelPath(modelInfo),
                workspace: workspace,
                repo_slug: modelInfo.repo,
                commit: commitId
            });
            tree.content = Buffer.from(tree.data).toString('base64');
            return [tree];
        } catch (error) {
            console.error(`Error reading model file: ${error.message}`);
            if (
                error.message &&
                (error.message.includes('Not Found') || error.message.includes('404'))
            ) {
                console.log(
                    `Model file ${getModelPath(modelInfo)} not found, returning empty object`
                );
                return [{ data: {}, content: '' }];
            }
            throw error;
        }
    } catch (error) {
        console.error(`Error in modelAsync: ${error.message}`);
        // Return empty object instead of throwing, similar to how we handle model file not found
        return [{ data: {}, content: '' }];
    }
};

export const createAsync = async (modelInfo, accessToken) => {
    const workspace = env.get().config.BITBUCKET_WORKSPACE;

    const client = getClient(accessToken);

    let created = await client.source.createFileCommit({
        [getModelPath(modelInfo)]: getModelContent(modelInfo),
        repo_slug: getRepoFullName(modelInfo),
        files: getModelPath(modelInfo),
        branch: modelInfo.branch,
        workspace: workspace,
        message: 'Created by OWASP Threat Dragon'
    });

    created = created.data.values;
    return [created];
};

export const updateAsync = async (modelInfo, accessToken) => {
    const workspace = env.get().config.BITBUCKET_WORKSPACE;

    const client = getClient(accessToken);

    let created = await client.source.createFileCommit({
        [getModelPath(modelInfo)]: getModelContent(modelInfo),
        repo_slug: getRepoFullName(modelInfo),
        files: getModelPath(modelInfo),
        branch: modelInfo.branch,
        workspace: workspace,
        message: 'Updated by OWASP Threat Dragon'
    });

    created = created.data.values;
    return [created];
};

// Not implemented as not used
/* eslint-disable-next-line no-unused-vars, require-await */
export const deleteAsync = async (modelInfo, accessToken) => {
    throw new Error(`Bitbucket deleteAsync is not implemented yet`);
};

export const createBranchAsync = (repoInfo, accessToken) => {
    const workspace = env.get().config.BITBUCKET_WORKSPACE;

    const client = getClient(accessToken);
    const repo = getRepoFullName(repoInfo);
    return client.refs.createBranch({
        _body: {
            name: repoInfo.branch,
            target: {
                hash: repoInfo.ref
            }
        },
        repo_slug: repo,
        workspace: workspace
    });
};

const getRepoFullName = (info) => (info && info.repo ? `${info.repo}` : '');

const getModelPath = (modelInfo) => {
    if (!modelInfo || !modelInfo.model) {
        console.error('Invalid model info provided to getModelPath', modelInfo);
        throw new Error('Invalid model info: model name is required');
    }
    return `${repoRootDirectory()}/${modelInfo.model}/${modelInfo.model}.json`;
};

const getModelContent = (modelInfo) => {
    if (!modelInfo || !modelInfo.body) {
        console.error('Invalid model info provided to getModelContent', modelInfo);
        throw new Error('Invalid model info: body is required');
    }
    return JSON.stringify(modelInfo.body, null, '  ');
};

export default {
    branchesAsync,
    createAsync,
    deleteAsync,
    modelAsync,
    modelsAsync,
    reposAsync,
    searchAsync,
    updateAsync,
    userAsync,
    getClient,
    createBranchAsync
};

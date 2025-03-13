import { getEnvironment } from '../env/Env.js';
import { getLogger } from '../helpers/logger.helper.js';
import responseWrapper from './responseWrapper.js';

const logger = getLogger('controllers/configcontroller.js');

const config = (req, res) => responseWrapper.sendResponse(() => getConfig(), req, res, logger);

export const getConfig = () => ({
    bitbucketEnabled: getEnvironment().config.BITBUCKET_CLIENT_ID != null,
    githubEnabled: getEnvironment().config.GITHUB_CLIENT_ID != null,
    gitlabEnabled: getEnvironment().config.GITLAB_CLIENT_ID != null,
    googleEnabled: getEnvironment().config.GOOGLE_CLIENT_ID != null,
    localEnabled: true,
});

export default {
    config,
};

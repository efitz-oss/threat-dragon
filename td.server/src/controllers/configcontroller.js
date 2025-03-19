import env from "../env/Env";
import loggerHelper from '../helpers/logger.helper.js';
import responseWrapper from "./responseWrapper";

const logger = loggerHelper.get('controllers/configcontroller.js');

const config = (req, res) => responseWrapper.sendResponse(() => getConfig(), req, res, logger);

export const getConfig = () => {
    console.log('VUE_APP_GOOGLE_CLIENT_ID from env:', env.get().config.VUE_APP_GOOGLE_CLIENT_ID);
    console.log('GOOGLE_CLIENT_ID from env:', env.get().config.GOOGLE_CLIENT_ID);
    
    return {
        bitbucketEnabled: env.get().config.BITBUCKET_CLIENT_ID !== undefined && env.get().config.BITBUCKET_CLIENT_ID !== null,
        githubEnabled: env.get().config.GITHUB_CLIENT_ID !== undefined && env.get().config.GITHUB_CLIENT_ID !== null,
        gitlabEnabled: env.get().config.GITLAB_CLIENT_ID !== undefined && env.get().config.GITLAB_CLIENT_ID !== null,
        googleEnabled: env.get().config.VUE_APP_GOOGLE_CLIENT_ID !== undefined && env.get().config.VUE_APP_GOOGLE_CLIENT_ID !== null,
        localEnabled: true,
    };
};

export default {
    config
};

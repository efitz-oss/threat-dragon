import env from '../env/Env.js';
import errors from './errors.js';
import jwtHelper from '../helpers/jwt.helper.js';
import loggerHelper from '../helpers/logger.helper.js';
import providers from '../providers/index.js';
import responseWrapper from './responseWrapper.js';
import tokenRepo from '../repositories/token.js';

const logger = loggerHelper.get('controllers/auth.js');

const login = (req, res) => {
    logger.debug(`API login request: ${logger.transformToString(req)}`);

    try {
        
        const provider = providers.get(req.params.provider);
        return responseWrapper.sendResponse(() => provider.getOauthRedirectUrl(), req, res, logger);
       
    } catch (err) {
        return errors.badRequest(err.message, res, logger);
    }
};

const oauthReturn = (req, res) => {
    logger.info(`OAuth return received with code: ${req.query.code ? `${req.query.code.substring(0, 10)}...` : 'none'}`);
    logger.debug(`API oauthReturn request: ${logger.transformToString(req)}`);
    
    // Get the base URL from the configured server or the request
    let baseUrl = '';
    if (env.get().config.NODE_ENV === 'development') {
        baseUrl = 'http://localhost:8080';
    } else {
        // Try to determine the redirect URL from configured headers
        const host = req.get('x-forwarded-host') || req.get('host');
        const protocol = (req.get('x-forwarded-proto') || req.protocol) + '://';
        if (host) {
            baseUrl = protocol + host;
        }
        logger.debug(`Determined base URL for OAuth return: ${baseUrl}`);
    }
    
    const returnUrl = `${baseUrl}/#/oauth-return?code=${req.query.code}`;
    logger.info(`Redirecting to: ${returnUrl}`);
    
    return res.redirect(returnUrl);
};


const completeLogin = (req, res) => {
    logger.info(`API completeLogin received for provider: ${req.params.provider}`);
    logger.info(`Code received: ${req.body.code ? `${req.body.code.substring(0, 10)}...` : 'none'}`);
    logger.debug(`API completeLogin request: ${logger.transformToString(req)}`);

    try {
        const provider = providers.get(req.params.provider);
        logger.info(`Provider ${req.params.provider} found: ${Boolean(provider)}`);

        // Errors in here will return as server errors as opposed to bad requests
        return responseWrapper.sendResponseAsync(async () => {
            try {
                logger.info(`Getting user info from ${req.params.provider} with authorization code`);
                const { user, opts } = await provider.completeLoginAsync(req.body.code);
                logger.info(`Got user info: ${user?.username || 'unknown'}, ${user?.email || 'no email'}`);
                
                logger.info(`Creating JWT for ${provider.name}`);
                const { accessToken, refreshToken } = await jwtHelper.createAsync(provider.name, opts, user);
                
                logger.info(`Adding refresh token to repository`);
                tokenRepo.add(refreshToken);
                
                logger.info(`Login completed successfully for ${user?.username || 'unknown'}`);
                return {
                    accessToken,
                    refreshToken
                };
            } catch (error) {
                logger.error(`Error in completeLoginAsync: ${error.message}`);
                logger.error(error.stack);
                throw error;
            }
        }, req, res, logger);
    } catch (err) {
        logger.error(`Error in completeLogin: ${err.message}`);
        return errors.badRequest(err.message, res, logger);
    }
};

const logout = (req, res) => responseWrapper.sendResponse(() => {
    logger.debug(`API logout request: ${logger.transformToString(req)}`);

    try {
        const refreshToken = req.body.refreshToken;
        if (!refreshToken) {
            logger.audit('Log out without a refresh token');
            // Return OK, it could be a client error or an expired token
            return '';
        }

        logger.debug('Remove refresh token');
        tokenRepo.remove(refreshToken);
        return '';
    } catch (e) {
        logger.error(e);
        return '';
    }
}, req, res, logger);

const refresh = (req, res) => {
    logger.debug(`API refresh request: ${logger.transformToString(req)}`);

    const tokenBody = tokenRepo.verify(req.body.refreshToken);
    if (!tokenBody) {
        return errors.unauthorized(res, logger);
    }
    return responseWrapper.sendResponseAsync(async () => {
        const { provider, user } = tokenBody;
        const { accessToken } = await jwtHelper.createAsync(provider.name, provider, user);

        // Limit the time refresh tokens live, so do not provide a new one.
        return { accessToken, refreshToken: req.body.refreshToken };
    }, req, res, logger);
};

export default {
    completeLogin,
    login,
    logout,
    oauthReturn,
    refresh
};
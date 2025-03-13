import { getEnvironment } from '../env/Env.js';
import * as errors from './errors.js';
import * as jwtHelper from '../helpers/jwt.helper.js';
import { getLogger } from '../helpers/logger.helper.js';
import * as providers from '../providers/index.js';
import * as responseWrapper from './responseWrapper.js';
import * as tokenRepo from '../repositories/token.js';

const logger = getLogger('controllers/auth.js');

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
    logger.debug(`API oauthReturn request: ${logger.transformToString(req)}`);

    let returnUrl = `/#/oauth-return?code=${req.query.code}`;
    if (getEnvironment().config.NODE_ENV === 'development') {
        returnUrl = `http://localhost:8080${returnUrl}`;
    }
    return res.redirect(returnUrl);
};

const completeLogin = (req, res) => {
    logger.debug(`API completeLogin request: ${logger.transformToString(req)}`);

    try {
        const provider = providers.get(req.params.provider);

        // Errors in here will return as server errors as opposed to bad requests
        return responseWrapper.sendResponseAsync(
            async () => {
                const { user, opts } = await provider.completeLoginAsync(req.query.code);
                const { accessToken, refreshToken } = await jwtHelper.createAsync(
                    provider.name,
                    opts,
                    user
                );
                tokenRepo.add(refreshToken);
                return {
                    accessToken,
                    refreshToken,
                };
            },
            req,
            res,
            logger
        );
    } catch (err) {
        return errors.badRequest(err.message, res, logger);
    }
};

const logout = (req, res) => {
    // Set no-cache headers to help with Safari
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    
    return responseWrapper.sendResponse(
        () => {
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
        },
        req,
        res,
        logger
    );
};

const refresh = (req, res) => {
    logger.debug(`API refresh request: ${logger.transformToString(req)}`);

    const tokenBody = tokenRepo.verify(req.body.refreshToken);
    if (!tokenBody) {
        return errors.unauthorized(res, logger);
    }
    return responseWrapper.sendResponseAsync(
        async () => {
            const { provider, user } = tokenBody;
            const { accessToken } = await jwtHelper.createAsync(provider.name, provider, user);

            // Limit the time refresh tokens live, so do not provide a new one.
            return { accessToken, refreshToken: req.body.refreshToken };
        },
        req,
        res,
        logger
    );
};

export default {
    completeLogin,
    login,
    logout,
    oauthReturn,
    refresh,
};

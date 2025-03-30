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
    logger.info(`=== OAuth return callback received ===`);
    logger.info(`Provider from URL path: ${req.params.provider || 'none'}`);
    logger.info(`Auth code received: ${req.query.code ? `${req.query.code.substring(0, 10)}...` : 'none'}`);
    logger.info(`Auth code length: ${req.query.code?.length || 0}`);
    logger.info(`Request URL: ${req.url}`);
    logger.info(`Request method: ${req.method}`);
    logger.info(`Request headers: ${JSON.stringify(req.headers)}`);
    logger.debug(`API oauthReturn request: ${logger.transformToString(req)}`);
    
    // Get the base URL from the configured server or the request
    let baseUrl = '';
    if (env.get().config.NODE_ENV === 'development') {
        logger.info('Using development environment base URL');
        baseUrl = 'http://localhost:8080';
    } else {
        // Try to determine the redirect URL from configured headers
        logger.info('Determining base URL from request headers');
        
        const host = req.get('x-forwarded-host') || req.get('host');
        logger.info(`Host header: ${host || 'none'}`);
        logger.info(`X-Forwarded-Host header: ${req.get('x-forwarded-host') || 'none'}`);
        
        // Take only the first protocol if multiple are provided in x-forwarded-proto
        const rawProto = req.get('x-forwarded-proto') || req.protocol;
        logger.info(`Protocol: ${rawProto || 'none'}`);
        logger.info(`X-Forwarded-Proto header: ${req.get('x-forwarded-proto') || 'none'}`);
        
        const protocol = (rawProto.split(',')[0].trim()) + '://';
        logger.info(`Using protocol: ${protocol}`);
        
        if (host) {
            baseUrl = protocol + host;
            logger.info(`Constructed base URL: ${baseUrl}`);
        } else {
            logger.error('Could not determine host for redirect');
        }
    }
    
    if (!baseUrl) {
        logger.error('Failed to determine base URL for redirect');
        return errors.serverError('Could not determine base URL for redirect', res, logger);
    }
    
    if (!req.query.code) {
        logger.error('No authorization code present in OAuth return');
        return errors.badRequest('No authorization code present in OAuth return', res, logger);
    }
    
    const returnUrl = `${baseUrl}/#/oauth-return?code=${req.query.code}`;
    logger.info(`Complete redirect URL: ${returnUrl.replace(/code=[^&]+/, 'code=REDACTED')}`);
    
    logger.info(`Redirecting to client application...`);
    return res.redirect(returnUrl);
};


const completeLogin = (req, res) => {
    logger.info(`=== API completeLogin received for provider: ${req.params.provider} ===`);
    logger.info(`Code received: ${req.body.code ? `${req.body.code.substring(0, 10)}...` : 'none'}, length: ${req.body.code?.length || 0}`);
    logger.info(`Request headers: ${JSON.stringify(req.headers)}`);
    logger.info(`Request URL: ${req.url}`);
    logger.info(`Request method: ${req.method}`);
    logger.info(`Request IP: ${req.ip}`);
    logger.debug(`API completeLogin request: ${logger.transformToString(req)}`);

    try {
        const provider = providers.get(req.params.provider);
        logger.info(`Provider ${req.params.provider} found: ${Boolean(provider)}`);
        if (!provider) {
            logger.error(`Provider ${req.params.provider} not found in providers list`);
            logger.error(`Available providers: ${Object.keys(providers).join(', ')}`);
        }

        // Errors in here will return as server errors as opposed to bad requests
        return responseWrapper.sendResponseAsync(async () => {
            try {
                logger.info(`Getting user info from ${req.params.provider} with authorization code`);
                logger.info(`Authorization code length: ${req.body.code?.length || 0}`);
                
                if (!req.body.code) {
                    logger.error('Missing authorization code in request body');
                    throw new Error('Missing authorization code in request body');
                }
                
                logger.info('Calling provider.completeLoginAsync with code');
                const { user, opts } = await provider.completeLoginAsync(req.body.code);
                logger.info(`Got user info: ${JSON.stringify(user || {})}`);
                logger.info(`Provider options received: ${JSON.stringify({
                    has_access_token: Boolean(opts?.access_token),
                    has_refresh_token: Boolean(opts?.refresh_token),
                    has_id_token: Boolean(opts?.id_token),
                    token_type: opts?.token_type || 'none',
                    expires_in: opts?.expires_in || 'none'
                })}`);
                
                logger.info(`Creating JWT for ${provider.name}`);
                const { accessToken, refreshToken } = await jwtHelper.createAsync(provider.name, opts, user);
                logger.info(`JWT created successfully, length: ${accessToken?.length || 0}`);
                logger.info(`Refresh token created, length: ${refreshToken?.length || 0}`);
                
                logger.info(`Adding refresh token to repository`);
                tokenRepo.add(refreshToken);
                
                logger.info(`Login completed successfully for ${user?.username || 'unknown'}, ${user?.email || 'no email'}`);
                logger.info(`=== End of OAuth flow for ${req.params.provider} ===`);
                
                return {
                    accessToken,
                    refreshToken
                };
            } catch (error) {
                logger.error(`Error in completeLoginAsync: ${error.message}`);
                logger.error(`Error stack: ${error.stack}`);
                
                if (error.response) {
                    logger.error(`Error response status: ${error.response.status}`);
                    logger.error(`Error response data: ${JSON.stringify(error.response.data || {})}`);
                    logger.error(`Error response headers: ${JSON.stringify(error.response.headers || {})}`);
                }
                
                throw error;
            }
        }, req, res, logger);
    } catch (err) {
        logger.error(`Error in completeLogin: ${err.message}`);
        logger.error(`Error stack: ${err.stack}`);
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
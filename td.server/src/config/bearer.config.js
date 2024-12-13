import errors from '../controllers/errors.js';
import jwt from '../helpers/jwt.helper.js';
import loggerHelper from '../helpers/logger.helper.js';

const logger = loggerHelper.get('config/bearer.config.js');

/**
 * Extracts the bearer token from the auth header
 * Returns null if there is not a valid bearer token
 * @param {String} authHeader
 * @returns {String|null}
 */
const getBearerToken = (authHeader) => {
    console.log( "A.A.A.......1")
    if (!authHeader) {
        console.log( "A.A.A.......no authHeader", authHeader)
        logger.info('Bearer token not found, auth header is empty');
        return null;
    }

    if (authHeader.indexOf('Bearer ') === -1) {
        console.log( "Bearer token key word not found in auth header...")
        logger.warn('Bearer token key word not found in auth header');
        return null;
    }

    return authHeader.split(' ')[1];
};

const middleware = (req, res, next) => {
    console.log( "A.A.A")
    const token = getBearerToken(req.headers.authorization);
    console.log( "A.A.A...token",token )

    if (!token) {
        logger.warn(`Bearer token not found for resource that requires authentication: ${req.url}`);
       
        return errors.unauthorized(res, logger);
    }

    try {
        const { provider, user } = jwt.verifyToken(token);
        req.provider = provider;
        req.user = user;
        console.log( "A.A.A...req.provider", req.provider)
        console.log( "A.A.A...req.user", req.user)
        return next();
    } catch (e) {
        if (e.name === 'TokenExpiredError') {
            console.log( "A.A.A...no token...")
            logger.audit('Expired JWT encountered');
            return errors.unauthorized(res, logger);
        }

        logger.audit('Error decoding JWT');
        logger.error(e);
        return errors.badRequest('Invalid JWT', res, logger);
    }
};

export default {
    middleware
};

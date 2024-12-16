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
    console.log("Checking Authorization header...");
    if (!authHeader) {
        console.log("Authorization header is missing:", authHeader);
        logger.info('Bearer token not found, auth header is empty');
        return null;
    }

    if (!authHeader.startsWith('Bearer ')) {
        console.log("Authorization header does not contain Bearer token.");
        logger.warn('Bearer token keyword not found in auth header');
        return null;
    }

    return authHeader.split(' ')[1];
};

const middleware = (req, res, next) => {
    console.log("Middleware invoked...");
    console.log("Authorization header received:", req.headers.authorization);

    const token = getBearerToken(req.headers.authorization);
    if (!token) {
        logger.warn(`Bearer token not found for resource requiring authentication: ${req.url}`);
        return errors.unauthorized(res, logger);
    }

    try {
        console.log("Verifying token...");
        const { provider, user } = jwt.verifyToken(token);

        if (!provider || !user) {
            throw new Error("Decoded JWT is missing required fields (provider/user)");
        }

        req.provider = provider;
        req.user = user;
        console.log("Authenticated user:", req.user);
        console.log("Token provider:", req.provider);

        return next();
    } catch (e) {
        if (e.name === 'TokenExpiredError') {
            logger.audit('Expired JWT encountered');
            console.error("Expired token error:", e.message);
            return errors.unauthorized(res, logger);
        }

        logger.audit('Error decoding JWT');
        logger.error(e);
        console.error("Token verification error:", e.message);
        return errors.badRequest('Invalid JWT', res, logger);
    }
};

export default {
    middleware
};


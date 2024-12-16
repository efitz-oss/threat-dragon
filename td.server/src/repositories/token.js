import jwtHelper from '../helpers/jwt.helper.js';
import loggerHelper from '../helpers/logger.helper.js';

const logger = loggerHelper.get('repositories/token.js');

/**
 * The refresh tokens
 * This is a bit of a code smell having this held in memory
 * Typically you would store this in a database, since we will
 * lose all valid refresh tokens when the server restarts
 * Threat Dragon does not currently have a canonical persistence layer
 * @type {Array<String>}
 */
const refreshTokens = [];

/**
 * Adds a refresh token to the repo
 * @param {String} token
 */
const add = (token) => {
    logger.debug('Adding refresh token to repository');
    refreshTokens.push(token);
};

/**
 * Removes a token from the refresh store
 * This is the same as invalidating the refresh token
 * @param {String} token
 */
const remove = (token) => {
    const idx = refreshTokens.indexOf(token);
    logger.debug('Removing / invalidating refresh token from repository');

    if (idx !== -1) {
        refreshTokens.splice(idx, 1);
    }
};

/**
 * Verifies that a refresh token is valid
 * @param {String} token
 * @returns {Object} The decoded token
 */
const verify = (token) => {
    // console.log ('..........Refresh token not found in token   1  ----->',token )
    // if (refreshTokens.indexOf(token) === -1) {
    //     console.log ('Refresh token not found intoken   2  ----->----->' )
    //     logger.audit('Refresh token not found in repository');
    //     return false;
    // }

    // try {
        // Refresh tokens are just JWTs.  The JWTs have a default expiration time
        // Ensure that it is a valid (signed) token, and that it is not expired
        console.log ('..........huhuhuhuhuhuhuh ----->',token )
        logger.debug('Refresh token verified');
        console.log ('Refresh token not found in repository-----> -1-1' )
        const token= jwtHelper.verifyRefresh(token);
        console.log ('Refresh token not found in repository----->..00' )
        return token
    // } catch (err) {
        // logger.audit('Error verifying refresh token');
        // logger.info(err);

        // // Since the token is invalid and was found in the array, we should remove it
        // remove(token);
        // return false;
    // }
};

export default {
    add,
    remove,
    verify
};

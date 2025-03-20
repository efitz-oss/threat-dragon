import env from '../env/Env.js';
import errors from './errors.js';
import loggerHelper from '../helpers/logger.helper.js';
import responseWrapper from './responseWrapper.js';

/**
 * Controller for handling Google token operations
 * Provides secure access to Google tokens for client-side operations
 */

const logger = loggerHelper.get('controllers/googleTokenController.js');

/**
 * Returns the Google access token from the provider information in the JWT
 * This is needed for client-side operations that require direct access to the Google token,
 * such as the Google Picker API.
 */
const getGoogleToken = (req, res) => responseWrapper.sendResponseAsync(async () => {
  logger.audit(`Google token requested by user ${req.user?.username || 'unknown'}`);
  
  // Validate that the user has a Google provider and token
  if (!req.provider || !req.provider.access_token) {
    logger.warn('No Google access token available in JWT');
    throw new Error('No Google access token available');
  }
  
  // Prevent caching of the token response
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
  
  return {
    accessToken: req.provider.access_token
  };
}, req, res, logger);

export default {
  getGoogleToken
};
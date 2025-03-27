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
  // Use await to ensure async function has await expression
  await Promise.resolve();
  logger.audit(`Google token requested by user ${req.user?.username || 'unknown'}`);
  
  // Log the full provider details to debug
  logger.debug(`Provider details in JWT: ${JSON.stringify({
    providerExists: !!req.provider,
    providerName: req.provider?.name || 'none',
    hasAccessToken: !!req.provider?.access_token,
    providerKeys: req.provider ? Object.keys(req.provider) : []
  })}`);
  
  // For security, only log partial token if it exists
  if (req.provider && req.provider.access_token) {
    const tokenPreview = req.provider.access_token.substring(0, 10) + '...';
    logger.debug(`Access token preview: ${tokenPreview}`);
  }
  
  // Validate that the user has a Google provider and token
  if (!req.provider) {
    logger.warn('No provider information available in JWT');
    throw new Error('No provider information available in JWT');
  }
  
  if (req.provider.name !== 'google') {
    logger.warn(`Wrong provider type: ${req.provider.name} (should be 'google')`);
    throw new Error(`Authentication with Google is required. Current provider: ${req.provider.name}`);
  }
  
  if (!req.provider.access_token) {
    logger.warn('No Google access token available in JWT');
    throw new Error('No Google access token available in JWT. Please sign in again.');
  }
  
  // Prevent caching of the token response
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
  
  logger.debug('Successfully returning Google access token');
  
  return {
    accessToken: req.provider.access_token
  };
}, req, res, logger);

export default {
  getGoogleToken
};
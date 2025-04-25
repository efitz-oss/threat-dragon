import encryptionHelper from './encryption.helper.js';
import env from '../env/Env.js';
import jwt from 'jsonwebtoken';
import loggerHelper from '../helpers/logger.helper.js';

const createAsync = async (providerName, providerOptions, user) => {
    const encryptedProviderOptions = await encryptionHelper.encryptPromise(
        JSON.stringify(providerOptions)
    );
    const providerOptsEncoded = Buffer.from(JSON.stringify(encryptedProviderOptions)).toString(
        'base64'
    );
    const provider = {
        [providerName]: providerOptsEncoded
    };

    const accessToken = jwt.sign(
        { provider, user },
        env.get().config.ENCRYPTION_JWT_SIGNING_KEY,
        { expiresIn: '1d' } // 1 day
    );

    const refreshToken = jwt.sign(
        { provider, user },
        env.get().config.ENCRYPTION_JWT_REFRESH_SIGNING_KEY,
        { expiresIn: '7d' } // 7 days
    );

    return { accessToken, refreshToken };
};

const decodeProvider = (encodedProvider) => {
    const providerName = Object.keys(encodedProvider)[0];

    const decodedProvider = JSON.parse(
        Buffer.from(encodedProvider[providerName], 'base64').toString('utf-8')
    );

    const provider = JSON.parse(encryptionHelper.decrypt(decodedProvider));

    provider.name = providerName;
    return provider;
};

const decode = (token, key) => {
    const logger = loggerHelper.get('helpers/jwt.helper.js');

    try {
        if (!token) {
            logger.error('No token provided for verification');
            throw new Error('No token provided');
        }

        // Verify the token
        logger.debug(`Verifying token (length: ${token.length})`);
        const decoded = jwt.verify(token, key);

        if (!decoded) {
            logger.error('JWT verification returned null/undefined');
            throw new Error('JWT verification failed');
        }

        if (!decoded.provider) {
            logger.error('JWT missing provider information');
            throw new Error('JWT missing provider information');
        }

        const { provider, user } = decoded;

        try {
            logger.debug('Decoding provider information from JWT');
            const decodedProvider = decodeProvider(provider);

            logger.debug(`Successfully decoded JWT for provider: ${decodedProvider.name}`);
            return {
                provider: decodedProvider,
                user
            };
        } catch (providerError) {
            logger.error(`Error decoding provider from JWT: ${providerError.message}`);
            logger.error(`Provider data: ${JSON.stringify(provider)}`);
            throw new Error(`Failed to decode provider data: ${providerError.message}`);
        }
    } catch (error) {
        logger.error(`Error verifying token: ${error.message}`);
        logger.error(`Error stack: ${error.stack}`);

        // Provide more specific error messages based on the type of error
        if (error.name === 'TokenExpiredError') {
            throw new Error('JWT token has expired');
        } else if (error.name === 'JsonWebTokenError') {
            throw new Error(`Invalid JWT: ${error.message}`);
        } else {
            throw new Error(`JWT verification error: ${error.message}`);
        }
    }
};

const verifyToken = (token) => decode(token, env.get().config.ENCRYPTION_JWT_SIGNING_KEY);

const verifyRefresh = (token) => decode(token, env.get().config.ENCRYPTION_JWT_REFRESH_SIGNING_KEY);

export default {
    decode,
    createAsync,
    verifyToken,
    verifyRefresh
};

import encryptionHelper from './encryption.helper.js';
import env from '../env/Env.js';
import jwt from 'jsonwebtoken';
import loggerHelper from '../helpers/logger.helper.js';

const createAsync = async (providerName, providerOptions, user) => {
    const encryptedProviderOptions = await encryptionHelper.encryptPromise(JSON.stringify(providerOptions));
    const providerOptsEncoded = Buffer.from(JSON.stringify(encryptedProviderOptions)).toString('base64');
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

    const decodedProvider = JSON.parse(Buffer.from(encodedProvider[providerName], 'base64').toString('utf-8'));

    const provider = JSON.parse(encryptionHelper.decrypt(decodedProvider));

    provider.name = providerName;
    return provider;
};

const decode = (token, key) => {

    try {
        // Verify the token
        const { provider, user } = jwt.verify(token, key);

        const decodedProvider = decodeProvider(provider);
        return {
            provider: decodedProvider,
            user
        };
    } catch (error) {
        const logger = loggerHelper.get('helpers/jwt.helper.js');
        logger.error(`Error verifying token: ${error.message}`);
        logger.error(`Error stack: ${error.stack}`);
        throw new Error('Invalid JWT');
    }
};


const verifyToken = (token) => decode(token, env.get().config.ENCRYPTION_JWT_SIGNING_KEY);

<<<<<<< HEAD
const verifyRefresh = (token) => decode(token, env.get().config.ENCRYPTION_JWT_SIGNING_KEY);
=======
const verifyRefresh = (token) => decode(token, env.get().config.ENCRYPTION_JWT_REFRESH_SIGNING_KEY);
>>>>>>> refs/remotes/origin/drive-token-reuse

export default {
    decode,
    createAsync,
    verifyToken,
    verifyRefresh
};
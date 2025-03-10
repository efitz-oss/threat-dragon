import jwt from 'jsonwebtoken';
import encryptionHelper from './encryption.helper.js';
import env from '../env/Env.js';

const createAsync = async (providerName, providerOptions, user) => {
    const encryptedProviderOptions = await encryptionHelper.encryptPromise(JSON.stringify(providerOptions));
    const providerOptsEncoded = Buffer.from(JSON.stringify(encryptedProviderOptions)).toString('base64');
    const provider = { [providerName]: providerOptsEncoded,
        access_token: providerOptions.access_token  };

    const accessToken = jwt.sign(
        { provider, user },
        env.get().config.ENCRYPTION_JWT_SIGNING_KEY,
        { expiresIn: '1d' }
    );

    const refreshToken = jwt.sign(
        { provider, user },
        env.get().config.ENCRYPTION_JWT_REFRESH_SIGNING_KEY,
        { expiresIn: '7d' }
    );

    return { accessToken, refreshToken };
};

const decodeProvider = (encodedProvider) => {
    const providerName = Object.keys(encodedProvider)[0];
    const decodedProvider = JSON.parse(Buffer.from(encodedProvider[providerName], 'base64').toString('utf-8'));
    return JSON.parse(encryptionHelper.decrypt(decodedProvider));
};

const verifyToken = (token) => jwt.verify(token, env.get().config.ENCRYPTION_JWT_SIGNING_KEY);
const verifyRefresh = (token) => jwt.verify(token, env.get().config.ENCRYPTION_JWT_REFRESH_SIGNING_KEY);

export default {
    createAsync,
    decodeProvider,
    verifyToken,
    verifyRefresh
};

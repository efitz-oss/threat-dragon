import jwt from 'jsonwebtoken';
import encryptionHelper from './encryption.helper.js';
import env from '../env/Env.js';

const createAsync = async (providerName, providerOptions, user) => {
    const encryptedProviderOptions = await encryptionHelper.encryptPromise(JSON.stringify(providerOptions));
    const providerOptsEncoded = Buffer.from(JSON.stringify(encryptedProviderOptions)).toString('base64');
    const provider = {
        [providerName]: providerOptsEncoded
    };

    console.log('Creating JWTs with signing keys...');
    console.log('ENCRYPTION_JWT_SIGNING_KEY:', env.get().config.ENCRYPTION_JWT_SIGNING_KEY);
    console.log('ENCRYPTION_JWT_REFRESH_SIGNING_KEY:', env.get().config.ENCRYPTION_JWT_REFRESH_SIGNING_KEY);

    const accessToken = jwt.sign(
        { provider, user },
        env.get().config.ENCRYPTION_JWT_SIGNING_KEY,
        { expiresIn: '1d' } // 1 day
    );

    const refreshToken = jwt.sign(
        { provider, user },
        env.get().config.ENCRYPTION_JWT_SIGNING_KEY,
        { expiresIn: '7d' } // 7 days
    );

    console.log('Access token created:');
    console.log('Refresh token created:');

    return { accessToken, refreshToken };
};

const decodeProvider = (encodedProvider) => {
    const providerName = Object.keys(encodedProvider)[0];
    console.log('Decoding provider...', providerName);

    const decodedProvider = JSON.parse(Buffer.from(encodedProvider[providerName], 'base64').toString('utf-8'));
    console.log('Decoded provider (base64):', decodedProvider);

    const provider = JSON.parse(encryptionHelper.decrypt(decodedProvider));
    console.log('Decrypted provider:', provider);

    provider.name = providerName;
    return provider;
};

const decode = (token, key) => {
    console.log('Decoding token...');
    console.log('Token:');
    console.log('Key used for decoding:', key);

    try {
        // Decode without verifying to inspect the token
        const decodedToken = jwt.decode(token, { complete: true });
        console.log('Decoded token (without verification):');

        // Verify the token
        const { provider, user } = jwt.verify(token, key);
        console.log('Verified token successfully:', { provider, user });

        const decodedProvider = decodeProvider(provider);
        console.log('Decoded provider:', decodedProvider);

        return {
            provider: decodedProvider,
            user
        };
    } catch (error) {
        console.error('Error verifying token:', error.message);
        console.error('Error stack:', error.stack);
        throw new Error('Invalid JWT');
    }
};


const verifyToken = (token) => {
    console.log('Verifying access token...');
    console.log('ENCRYPTION_JWT_SIGNING_KEY:', env.get().config.ENCRYPTION_JWT_SIGNING_KEY);
    return decode(token, env.get().config.ENCRYPTION_JWT_SIGNING_KEY);
};

const verifyRefresh = (token) => {
    console.log(' refresh token...');
    console.log('Verifying refresh token...');
    console.log('ENCRYPTION_JWT_REFRESH_SIGNING_KEY:', env.get().config.ENCRYPTION_JWT_SIGNING_KEY);
    return decode(token, env.get().config.ENCRYPTION_JWT_SIGNING_KEY);
};

export default {
    createAsync,
    verifyToken,
    verifyRefresh
};

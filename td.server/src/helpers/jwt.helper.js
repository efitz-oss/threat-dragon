import jsonwebtoken from 'jsonwebtoken';

import encryptionHelper from './encryption.helper.js';
import env from '../env/Env.js';

const createAsync = async (providerName, providerOptions, user) => {
    const encryptedProviderOptions = await encryptionHelper.encryptPromise(JSON.stringify(providerOptions));
    const providerOptsEncoded = Buffer.from(JSON.stringify(encryptedProviderOptions)).toString('base64');
    const provider = {
        [providerName]: providerOptsEncoded
    };
    // Explore other options including issuer, scope, etc
    const accessToken = jsonwebtoken.sign({ provider, user }, env.get().config.ENCRYPTION_JWT_SIGNING_KEY, {
        expiresIn: '1d'
    });

    const refreshToken = jsonwebtoken.sign({ provider, user }, env.get().config.ENCRYPTION_JWT_REFRESH_SIGNING_KEY, {
        expiresIn: '7d'
    });

    return { accessToken, refreshToken };
};

const decodeProvider = (encodedProvider) => {
    const providerName = Object.keys(encodedProvider)[0];
    console.log ('Refresh token decodedProvider.....   1  ---providerName---->',providerName )
    const decodedProvider = JSON.parse(Buffer.from(encodedProvider[providerName], 'base64').toString('utf-8'));
    console.log ('Refresh token decodedProvider.....   2  ---providerName---->',decodedProvider )
    const provider = JSON.parse(encryptionHelper.decrypt(decodedProvider));
    console.log ('Refresh token decodedProvider.....   3  ---providerName---->',provider )
    provider.name = providerName;
    return provider;
};

const decode = (token, key) => {
    console.log (' 1.0  ----->----->' ,token,key)
    const { provider, user } = jsonwebtoken.verify(token, key);
    console.log ('R  1.0  ----->----->' )
    const decodedProvider = decodeProvider(provider);
    console.log ('Refresh token decodedProvider.....   1.0  ----->----->' )
    return {
        provider: decodedProvider,
        user
    };
};

const verifyToken = (token) => decode(token, env.get().config.ENCRYPTION_JWT_SIGNING_KEY);

const verifyRefresh = (token) => decode(token, env.get().config.ENCRYPTION_JWT_REFRESH_SIGNING_KEY);


export default {
    createAsync,
    verifyToken,
    verifyRefresh
};

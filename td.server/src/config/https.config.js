import env from '../env/Env.js';

const appUsesTls = env.get().config.APP_USE_TLS && env.get().config.APP_TLS_CERT_PATH && env.get().config.APP_TLS_KEY_PATH && env.get().config.APP_HOSTNAME;
const healthCheckProtocol = env.get().config.SERVER_API_PROTOCOL || appUsesTls || 'https';

const middleware = (req, res, next) => {
    // The 'x-forwarded-proto' check is for Heroku
    if (!req.secure && req.get('x-forwarded-proto') !== 'https' && healthCheckProtocol === 'https' && env.get().config.NODE_ENV !== 'development') {
        return res.redirect('https://' + req.get('host') + req.url);
    }

    return next();
};

export default {
    middleware
};

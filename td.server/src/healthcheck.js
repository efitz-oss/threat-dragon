// healthcheck is called periodically from within the docker container

import env from 'env/Env.js';
import loggerHelper from 'helpers/logger.helper.js';

const logger = loggerHelper.get('healthcheck.js');
const http = require('http');

// use the same logic as in vue.config.js to determine the URI to use for health check APIs
// health check API requests are made periodically by the server to the application
// the application's webpack dev server is configured to proxy these requests back to the server
const serverApiPort = env.get().config.SERVER_API_PORT || env.get().config.PORT || 3000;
const appUsesTLS = env.get().config.APP_USE_TLS && env.get().config.APP_TLS_CERT_PATH && env.get().config.APP_TLS_KEY_PATH && env.get().config.APP_HOSTNAME;
const serverApiProtocol = env.get().config.SERVER_API_PROTOCOL || appUsesTLS ? 'https':'http';
const appHostname = env.get().config.PROXY_HOSTNAME || env.get().config.APP_HOSTNAME || 'localhost';
const req = (serverApiProtocol + '://' + appHostname + ':' + serverApiPort + '/healthz');

http.get(req, (res) => {
    const { statusCode } = res;
    logger.debug('Health check request: ' + req);

    if (statusCode !== 200) {
        logger.error(`Healthcheck failure: invalid status code: ${statusCode}`);
        process.exit(1);
    }

    process.exit(0);
}).on('error', (e) => {
    logger.error(`Healthcheck failure: ${e.message}`);
    process.exit(1);
});

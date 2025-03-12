// healthcheck is called periodically from within the docker container

import env from 'env/Env.js';
import loggerHelper from 'helpers/logger.helper.js';
import http from 'http';

const logger = loggerHelper.get('healthcheck.js');

const protocol = env.get().config.SERVER_API_PROTOCOL || 'https';
const port = env.get().config.SERVER_API_PORT || '3000';
const req = `${protocol}://localhost:${port}/healthz`;

http.get(req, (res) => {
    const { statusCode } = res;
    logger.debug(`Health check request: ${req}`);

    if (statusCode !== 200) {
        logger.error(`Healthcheck failure: invalid status code: ${statusCode}`);
        process.exit(1);
    }

    process.exit(0);
}).on('error', (e) => {
    logger.error(`Healthcheck failure: ${e.message}`);
    process.exit(1);
});

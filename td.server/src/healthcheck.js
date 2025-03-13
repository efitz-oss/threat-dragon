// healthcheck is called periodically from within the docker container

import { getEnvironment } from './env/Env.js';
import { getLogger } from './helpers/logger.helper.js';
import http from 'http';

const logger = getLogger('healthcheck.js');

const protocol = getEnvironment().config.SERVER_API_PROTOCOL || 'https';
const port = getEnvironment().config.SERVER_API_PORT || '3000';
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

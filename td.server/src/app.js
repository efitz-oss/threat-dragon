import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import rateLimit from 'express-rate-limit';

import env from './env/Env.js';
import envConfig from './config/env.config.js';
import expressHelper from './helpers/express.helper.js';
import https from './config/https.config.js';
import loggerHelper from './helpers/logger.helper.js';
import parsers from './config/parsers.config.js';
import routes from './config/routes.config.js';
import securityHeaders from './config/securityheaders.config.js';
import { upDir } from './helpers/path.helper.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const siteDir = path.join(__dirname, upDir, upDir, 'dist');
const docsDir = path.join(__dirname, upDir, upDir, 'docs');

// set up rate limiter: maximum of 6000 requests per 30 minute interval
const limiter = rateLimit({
    windowMs: 30 * 60 * 1000, // 10 minutes
    max: 6000,
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false // Disable the `X-RateLimit-*` headers
});

const create = () => {
    let logger;

    try {
        envConfig.tryLoadDotEnv();
        // logging environment, env will always supply a value
        loggerHelper.level(env.get().config.LOG_LEVEL);
        logger = loggerHelper.get('app.js');

        const app = expressHelper.getInstance();
        
        // Configure trust proxy more securely
        // Only trust specific proxies, usually your load balancer IP
        // For AWS, you might want to use the VPC CIDR range
        app.set('trust proxy', env.get().config.TRUST_PROXY_LIST || '127.0.0.1');
        
        // rate limiting only for production environments, otherwise automated e2e tests fail
        if (process.env.NODE_ENV === 'production') {
            // Configure rate limiter with trustProxy: false to avoid validation error
            const rateConfig = {
                windowMs: 30 * 60 * 1000, // 30 minutes
                max: 6000,
                standardHeaders: true,
                legacyHeaders: false,
                // Set to false as we've configured trust proxy above
                trustProxy: false
            };
            const configuredLimiter = rateLimit(rateConfig);
            app.use(configuredLimiter);
            logger.info('Apply rate limiting in production environments');
        } else {
            logger.warn('Rate limiting disabled for development environments');
        }

        // security headers
        securityHeaders.config(app);

        // Force HTTPS in production
        app.use(https.middleware);

        // static content
        app.use('/public', express.static(siteDir));
        app.use('/docs', express.static(docsDir));

        // parsers
        parsers.config(app);

        // routes
        routes.config(app);

        // Get port from environment, or use default value of 3000
        const serverApiPort = env.get().config.SERVER_API_PORT || env.get().config.PORT || 3000;
        app.set('port', serverApiPort);
        logger.info('Express API server listening on ' + app.get('port'));

        logger.info('OWASP Threat Dragon API server started');
        return app;
    } catch (e) {
        if (!logger) { logger = console; }
        logger.error('OWASP Threat Dragon API server failed to start');
        logger.error(e.message);
        throw e;
    }
};

export default {
    create
};

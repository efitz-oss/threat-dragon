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

// Note: main rate limiter is configured and applied below
// Helper function to configure rate limiting
const configureRateLimiting = (app, logger) => {
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
};

// Helper function to configure server settings
const configureServer = (app, logger) => {
    // Configure trust proxy more securely
    app.set('trust proxy', env.get().config.TRUST_PROXY_LIST || '127.0.0.1');
    
    // Configure security features
    securityHeaders.config(app);
    app.use(https.middleware); // Force HTTPS in production
    
    // static content
    app.use('/public', express.static(siteDir));
    app.use('/docs', express.static(docsDir));
    
    // parsers and routes
    parsers.config(app);
    routes.config(app);
    
    // Set port
    const serverApiPort = env.get().config.SERVER_API_PORT || env.get().config.PORT || 3000;
    app.set('port', serverApiPort);
    logger.info('Express API server listening on ' + app.get('port'));
};

const create = () => {
    let logger;

    try {
        // Initialize environment and logging
        envConfig.tryLoadDotEnv();
        loggerHelper.level(env.get().config.LOG_LEVEL);
        logger = loggerHelper.get('app.js');

        // Create and configure Express app
        const app = expressHelper.getInstance();
        configureRateLimiting(app, logger);
        configureServer(app, logger);

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

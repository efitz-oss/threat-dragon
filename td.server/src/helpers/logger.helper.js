/**
 * @name logger.js
 * @description Default logging implementation for Threat Dragon
 *
 * Logging Strategy:
 * - Uses Winston for structured, level-based logging
 * - Logs to multiple destinations: app.log, audit.log, and console
 * - Log level is configurable via LOG_LEVEL environment variable (defaults to 'warn')
 * - Supports 5 log levels: audit (0), error (1), warn (2), info (3), debug (4)
 *
 * Log Level Usage Guidelines:
 * - audit: Security-relevant events (authentication, authorization, data access/modifications)
 * - error: Exceptions that affect functionality (API failures, database errors, etc.)
 * - warn: Unexpected but recoverable conditions (deprecated features, performance issues)
 * - info: General operational information (startup/shutdown, configuration, successful operations)
 * - debug: Detailed tracing information (request details, function entry/exit, variable values)
 *
 * Transport Configuration:
 * - app.log: Captures info, warn, error levels (general application logs)
 * - audit.log: Captures only audit level (security-relevant events)
 * - console: Captures info, warn, error levels (configurable based on environment)
 */
import winston, { format } from 'winston';

/**
 * The available log levels
 * @type {object}
 */
const logLevels = {
    audit: 0,
    error: 1,
    warn: 2,
    info: 3,
    debug: 4
};

// declare the various destinations for the logging messages
const transports = {
    app: new winston.transports.File({
        filename: 'app.log',
        level: 'info',
        silent: process.env.NODE_ENV === 'test'
    }),
    audit: new winston.transports.File({
        filename: 'audit.log',
        level: 'audit',
        silent: process.env.NODE_ENV === 'test'
    }),
    console: new winston.transports.Console({
        format: format.combine(format.colorize(), format.simple()),
        level: 'info',
        silent: process.env.NODE_ENV === 'test'
    })
};

const _logger = winston.createLogger({
    levels: logLevels,
    level: 'info',
    format: format.combine(
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        format.errors({ stack: true }),
        format.splat(),
        format.json()
    ),
    defaultMeta: { service: 'threat-dragon' },
    transports: [transports.audit, transports.app, transports.console],
    silent: process.env.NODE_ENV === 'test'
});

class Logger {
    constructor(service, logger) {
        this.service = service;
        this.logger = logger || _logger;
    }

    _formatMessage(service, message, level) {
        if (typeof message === 'string') {
            return `${service}: ${message}`;
        }
        this.logger.log(level, `${service}: `);
        this.logger.log(level, message);
    }

    transformToString(complexObject) {
        const cache = [];
        const resultString = JSON.stringify(complexObject, function (key, value) {
            if (typeof value === 'object' && value !== null) {
                if (cache.indexOf(value) !== -1) {
                    // Circular reference found
                    return '[Circular]';
                }
                cache.push(value);
            }
            return value;
        });
        return resultString;
    }

    log(level, message) {
        this.logger.log(level, this._formatMessage(this.service, message));
    }

    /**
     * Logs a message at the debug level
     * @param {string|object} message - The message to log
     * @description Use for detailed tracing information:
     * - Request/response details
     * - Function entry/exit points
     * - Variable values during execution
     * - Low-level operations
     */
    debug(message) {
        this.logger.debug(this._formatMessage(this.service, message, 'debug'));
    }

    /**
     * Logs a message at the info level
     * @param {string|object} message - The message to log
     * @description Use for general operational information:
     * - Application startup/shutdown
     * - Configuration settings (non-sensitive)
     * - Successful operations completion
     * - User actions (non-sensitive)
     * - Service status changes
     */
    info(message) {
        this.logger.info(this._formatMessage(this.service, message, 'info'));
    }

    /**
     * Logs a message at the warn level
     * @param {string|object} message - The message to log
     * @description Use for potential issues that don't prevent operation:
     * - Deprecated feature usage
     * - Unexpected but recoverable conditions
     * - Performance issues
     * - Potential security concerns
     * - Configuration inconsistencies
     */
    warn(message) {
        this.logger.warn(this._formatMessage(this.service, message, 'warn'));
    }

    /**
     * Logs a message at the error level
     * @param {string|object} message - The message to log
     * @description Use for exceptions that affect functionality:
     * - Exceptions that affect functionality
     * - API call failures
     * - Database errors
     * - Authentication/authorization failures
     * - Data validation errors
     */
    error(message) {
        this.logger.error(this._formatMessage(this.service, message, 'error'));
    }

    /**
     * Logs a message at the audit level
     * @param {string|object} message - The message to log
     * @description Audit logs are for security-relevant events like authentication,
     * authorization, data access, and data modifications
     */
    audit(message) {
        this.logger.log('audit', this._formatMessage(this.service, message, 'audit'));
    }
}

/**
 * Gets a new instance of a logger for a given service
 * @param {string} service
 * @param {Logger} logger
 * @returns {Logger}
 */
const get = (service, logger) => new Logger(service, logger);

/**
 * Sets the log level for the transports
 * @param {string} logLevel - The log level to set
 * @description Sets the log level for console and app transports.
 * The audit transport always remains at 'audit' level regardless of this setting.
 */
const level = (logLevel) => {
    transports.console.level = logLevel;
    transports.app.level = logLevel;
    // Note: We don't change audit.log level - it should always be 'audit'

    // Update the default level on the logger itself
    _logger.level = logLevel;
};

export default {
    level,
    get,
    Logger
};

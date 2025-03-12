/**
 * @name logger.js
 * @description Default logging implementation
 * logging level either provided by dotenv LOG_LEVEL or defaults to 'info'
 */
import winston, { format } from 'winston';

/**
 * The available log levels
 * @type {object}
 */
export const logLevels = {
    audit: 0,
    error: 1,
    warn: 2,
    info: 3,
    debug: 4,
    silly: 5,
};

// declare the various destinations for the logging messages
export const transports = {
    app: new winston.transports.File({
        filename: 'app.log',
        level: 'info',
        silent: process.env.NODE_ENV === 'test',
    }),
    audit: new winston.transports.File({
        filename: 'audit.log',
        level: 'audit',
        silent: process.env.NODE_ENV === 'test',
    }),
    console: new winston.transports.Console({
        format: format.combine(format.colorize(), format.simple()),
        level: 'info',
        silent: process.env.NODE_ENV === 'test',
    }),
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
    silent: process.env.NODE_ENV === 'test',
});

/**
 * Logger class with service-specific context
 */
export class Logger {
    /**
     * Creates a new Logger instance
     * @param {string} service - The service name for context
     * @param {winston.Logger} logger - Optional logger instance
     */
    constructor(service, logger) {
        this.service = service;
        this.logger = logger || _logger;
    }

    /**
     * Formats a message with service context
     * @param {string} service - Service name
     * @param {string|object} message - Message to log
     * @param {string} level - Log level
     * @returns {string} - Formatted message
     */
    _formatMessage(service, message, level) {
        if (typeof message === 'string') {
            return `${service}: ${message}`;
        }
        this.logger.log(level, `${service}: `);
        this.logger.log(level, message);
    }

    /**
     * Transforms a complex object to string with circular reference handling
     * @param {object} complexObject - Object to stringify
     * @returns {string} - JSON string representation
     */
    transformToString(complexObject) {
        const cache = [];
        const resultString = JSON.stringify(complexObject, function (key, value) {
            if (typeof value === 'object' && value != null) {
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

    /**
     * Log at a specific level
     * @param {string} level - Log level
     * @param {string|object} message - Message to log
     */
    log(level, message) {
        this.logger.log(level, this._formatMessage(this.service, message));
    }

    /**
     * Log at silly level
     * @param {string|object} message - Message to log
     */
    silly(message) {
        this.logger.silly(this._formatMessage(this.service, message, 'silly'));
    }

    /**
     * Log at debug level
     * @param {string|object} message - Message to log
     */
    debug(message) {
        this.logger.debug(this._formatMessage(this.service, message, 'debug'));
    }

    /**
     * Log at info level
     * @param {string|object} message - Message to log
     */
    info(message) {
        this.logger.info(this._formatMessage(this.service, message, 'info'));
    }

    /**
     * Log at warn level
     * @param {string|object} message - Message to log
     */
    warn(message) {
        this.logger.warn(this._formatMessage(this.service, message, 'warn'));
    }

    /**
     * Log at error level
     * @param {string|object} message - Message to log
     */
    error(message) {
        this.logger.error(this._formatMessage(this.service, message, 'error'));
    }

    /**
     * Log at audit level
     * @param {string|object} message - Message to log
     */
    audit(message) {
        this.logger.error(this._formatMessage(this.service, message, 'audit'));
    }
}

/**
 * Gets a new instance of a logger for a given service
 * @param {string} service - Service name for context
 * @param {winston.Logger} logger - Optional logger instance
 * @returns {Logger} - New logger instance
 */
export function getLogger(service, logger) {
    return new Logger(service, logger);
}

/**
 * Sets the log level for console and app transports
 * @param {string} logLevel - The log level to set
 */
export function setLogLevel(logLevel) {
    transports.console.level = logLevel;
    transports.app.level = logLevel;
}

const winston = require('winston');
const morgan = require('morgan');
const path = require('path');
class Log {
    static #logger = winston.createLogger({
        level: 'info',
        format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.printf(({ timestamp, level, message, ...meta }) => {
                return `[${timestamp}] ${level.toUpperCase()}: ${message} ${Object.keys(meta).length ? JSON.stringify(meta, null, 2) : ''
                    }`;
            })
        ),
        transports: [
            new winston.transports.Console({
                format: winston.format.combine(
                    winston.format.colorize(),
                    winston.format.simple()
                )
            }),
            new winston.transports.File({
                filename: path.join(__dirname, '../logs/error.log'),
                level: 'error'
            }),
            new winston.transports.File({
                filename: path.join(__dirname, '../logs/combined.log')
            })
        ]
    });

    static #httpLogger = morgan('combined', {
        stream: {
            write: (message) => this.info('HTTP Request', { details: message.trim() })
        }
    });

    /**
     * Get the HTTP logger middleware
     * @returns {Function} Morgan middleware
     */
    static get http() {
        return this.#httpLogger;
    }

    /**
     * Log an informational message
     * @param {string} message - The message to log
     * @param {Object} [context={}] - Additional context
     */
    static info(message, context = {}) {
        this.#logger.info(message, context);
    }

    /**
     * Log an error message
     * @param {string} message - The error message
     * @param {Error} [error] - The error object
     * @param {Object} [context={}] - Additional context
     */
    static error(message, error, context = {}) {
        const errorDetails = error ? {
            errorMessage: error.message,
            stack: error.stack,
            ...context
        } : context;

        this.#logger.error(message, errorDetails);
    }

    /**
     * Log a warning message
     * @param {string} message - The warning message
     * @param {Object} [context={}] - Additional context
     */
    static warn(message, context = {}) {
        this.#logger.warn(message, context);
    }

    /**
     * Log a debug message
     * @param {string} message - The debug message
     * @param {Object} [context={}] - Additional context
     */
    static debug(message, context = {}) {
        this.#logger.debug(message, context);
    }
}

module.exports = Log;
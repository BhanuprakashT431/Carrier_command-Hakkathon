'use strict';

const winston = require('winston');
const env = require('../config/env');

const { combine, timestamp, printf, colorize, json, errors } = winston.format;

// Human-readable format for development
const devFormat = combine(
  colorize(),
  timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  errors({ stack: true }),
  printf(({ level, message, timestamp: ts, stack, ...meta }) => {
    let log = `${ts} [${level}]: ${message}`;
    if (stack) log += `\n${stack}`;
    if (Object.keys(meta).length > 0) log += `\n${JSON.stringify(meta, null, 2)}`;
    return log;
  })
);

// Structured JSON format for production
const prodFormat = combine(
  timestamp(),
  errors({ stack: true }),
  json()
);

const logger = winston.createLogger({
  level: env.isProduction ? 'warn' : 'debug',
  format: env.isProduction ? prodFormat : devFormat,
  transports: [
    new winston.transports.Console(),
  ],
  // Silence logger in tests unless explicitly needed
  silent: env.isTest,
});

module.exports = logger;

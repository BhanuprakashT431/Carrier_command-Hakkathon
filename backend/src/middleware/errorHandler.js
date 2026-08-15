'use strict';

const logger = require('../utils/logger');
const env = require('../config/env');

/**
 * Custom application error class.
 */
class AppError extends Error {
  constructor(message, statusCode = 500, errors = null) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Global error handling middleware.
 * Must be registered LAST in Express middleware chain.
 */
// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  // Log every error
  logger.error({
    message: err.message,
    stack: err.stack,
    statusCode: err.statusCode,
    path: req.path,
    method: req.method,
    requestId: req.id,
  });

  // Prisma errors
  if (err.code) {
    if (err.code === 'P2002') {
      // Unique constraint violation
      return res.status(409).json({
        success: false,
        message: 'A resource with this identifier already exists',
        timestamp: new Date().toISOString(),
      });
    }
    if (err.code === 'P2025') {
      // Record not found
      return res.status(404).json({
        success: false,
        message: 'Resource not found',
        timestamp: new Date().toISOString(),
      });
    }
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token',
      timestamp: new Date().toISOString(),
    });
  }

  // Multer errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({
      success: false,
      message: `File too large. Maximum size is ${env.MAX_FILE_SIZE_MB}MB`,
      timestamp: new Date().toISOString(),
    });
  }

  if (err.code === 'INVALID_MIME_TYPE') {
    return res.status(415).json({
      success: false,
      message: err.message,
      timestamp: new Date().toISOString(),
    });
  }

  // Operational errors (AppError)
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors || undefined,
      timestamp: new Date().toISOString(),
    });
  }

  // Unknown errors — don't leak details in production
  const statusCode = err.statusCode || 500;
  const message = env.isProduction
    ? 'An internal error occurred'
    : err.message;

  return res.status(statusCode).json({
    success: false,
    message,
    timestamp: new Date().toISOString(),
    ...(env.isDevelopment && { stack: err.stack }),
  });
}

module.exports = { errorHandler, AppError };

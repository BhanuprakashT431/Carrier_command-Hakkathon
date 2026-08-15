'use strict';

/**
 * Standard API response helpers.
 * All responses follow a consistent envelope structure.
 */

/**
 * Success response.
 * @param {import('express').Response} res
 * @param {*} data
 * @param {string} [message]
 * @param {number} [statusCode=200]
 */
function success(res, data, message = 'Success', statusCode = 200) {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    timestamp: new Date().toISOString(),
  });
}

/**
 * Created response (201).
 */
function created(res, data, message = 'Resource created') {
  return success(res, data, message, 201);
}

/**
 * No content response (204).
 */
function noContent(res) {
  return res.status(204).send();
}

/**
 * Error response.
 * @param {import('express').Response} res
 * @param {string} message
 * @param {number} [statusCode=500]
 * @param {*} [errors]
 */
function error(res, message, statusCode = 500, errors = null) {
  const body = {
    success: false,
    message,
    timestamp: new Date().toISOString(),
  };
  if (errors) body.errors = errors;
  return res.status(statusCode).json(body);
}

/**
 * Validation error response (422).
 */
function validationError(res, errors) {
  return error(res, 'Validation failed', 422, errors);
}

/**
 * Unauthorized response (401).
 */
function unauthorized(res, message = 'Authentication required') {
  return error(res, message, 401);
}

/**
 * Forbidden response (403).
 */
function forbidden(res, message = 'Insufficient permissions') {
  return error(res, message, 403);
}

/**
 * Not found response (404).
 */
function notFound(res, message = 'Resource not found') {
  return error(res, message, 404);
}

module.exports = {
  success,
  created,
  noContent,
  error,
  validationError,
  unauthorized,
  forbidden,
  notFound,
};

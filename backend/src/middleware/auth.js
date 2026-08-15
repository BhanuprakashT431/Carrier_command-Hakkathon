'use strict';

const { verifyAccessToken, extractBearerToken } = require('../utils/jwt');
const { unauthorized } = require('../utils/response');

/**
 * JWT authentication middleware.
 * Extracts and verifies the access token from the Authorization header.
 * Sets req.user = { userId, role } on success.
 */
function authenticate(req, res, next) {
  const token = extractBearerToken(req.headers.authorization);
  if (!token) {
    return unauthorized(res, 'No authentication token provided');
  }

  const payload = verifyAccessToken(token);
  if (!payload) {
    return unauthorized(res, 'Invalid or expired access token');
  }

  req.user = {
    userId: payload.sub,
    role: payload.role,
  };

  return next();
}

/**
 * Optional authentication — sets req.user if token present, but does not
 * block the request if missing. Used for public endpoints that show
 * different content to authenticated users.
 */
function optionalAuthenticate(req, res, next) {
  const token = extractBearerToken(req.headers.authorization);
  if (token) {
    const payload = verifyAccessToken(token);
    if (payload) {
      req.user = { userId: payload.sub, role: payload.role };
    }
  }
  return next();
}

module.exports = { authenticate, optionalAuthenticate };

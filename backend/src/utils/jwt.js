'use strict';

const jwt = require('jsonwebtoken');
const env = require('../config/env');

/**
 * JWT utilities.
 * Access tokens: short-lived (15m), signed with ACCESS_SECRET.
 * Refresh tokens: opaque UUID stored in DB, wrapped in JWT for tamper detection.
 */

/**
 * Generate a JWT access token.
 * @param {{ userId: string, role: string }} payload
 * @returns {string}
 */
function generateAccessToken(payload) {
  return jwt.sign(
    {
      sub: payload.userId,
      role: payload.role,
      type: 'access',
    },
    env.JWT_ACCESS_SECRET,
    { expiresIn: env.JWT_ACCESS_EXPIRY, algorithm: 'HS256' }
  );
}

/**
 * Generate a JWT-wrapped refresh token.
 * The actual opaque token is stored in the DB separately.
 * This JWT is used for tamper detection only.
 * @param {{ userId: string, tokenId: string }} payload
 * @returns {string}
 */
function generateRefreshJWT(payload) {
  return jwt.sign(
    {
      sub: payload.userId,
      tid: payload.tokenId, // DB token ID for validation
      type: 'refresh',
    },
    env.JWT_REFRESH_SECRET,
    { expiresIn: env.JWT_REFRESH_EXPIRY, algorithm: 'HS256' }
  );
}

/**
 * Verify and decode a JWT access token.
 * @param {string} token
 * @returns {{ sub: string, role: string, type: string } | null}
 */
function verifyAccessToken(token) {
  try {
    const payload = jwt.verify(token, env.JWT_ACCESS_SECRET, { algorithms: ['HS256'] });
    if (payload.type !== 'access') return null;
    return payload;
  } catch {
    return null;
  }
}

/**
 * Verify and decode a refresh JWT.
 * @param {string} token
 * @returns {{ sub: string, tid: string, type: string } | null}
 */
function verifyRefreshJWT(token) {
  try {
    const payload = jwt.verify(token, env.JWT_REFRESH_SECRET, { algorithms: ['HS256'] });
    if (payload.type !== 'refresh') return null;
    return payload;
  } catch {
    return null;
  }
}

/**
 * Extract bearer token from Authorization header.
 * @param {string|undefined} authHeader
 * @returns {string|null}
 */
function extractBearerToken(authHeader) {
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
  return authHeader.slice(7);
}

module.exports = {
  generateAccessToken,
  generateRefreshJWT,
  verifyAccessToken,
  verifyRefreshJWT,
  extractBearerToken,
};

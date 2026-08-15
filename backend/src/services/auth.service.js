'use strict';

const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const prisma = require('../config/database');
const { generateAccessToken, generateRefreshJWT } = require('../utils/jwt');
const { AppError } = require('../middleware/errorHandler');

const SALT_ROUNDS = 12;
const REFRESH_TOKEN_EXPIRY_DAYS = 7;

/**
 * Register a new user.
 * Creates User + Profile in a single transaction.
 *
 * @param {{ email: string, password: string, firstName?: string, lastName?: string }} data
 * @returns {{ user: object, accessToken: string, refreshToken: string }}
 */
async function register(data) {
  const { email, password, firstName, lastName } = data;

  // Check for existing account
  const existing = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });
  if (existing) {
    throw new AppError('An account with this email already exists', 409);
  }

  // Hash password
  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  // Create user + profile atomically
  const user = await prisma.$transaction(async (tx) => {
    const newUser = await tx.user.create({
      data: {
        email: email.toLowerCase(),
        passwordHash,
        role: 'USER',
      },
    });

    await tx.profile.create({
      data: {
        userId: newUser.id,
        firstName: firstName || null,
        lastName: lastName || null,
      },
    });

    return newUser;
  });

  const { accessToken, refreshToken } = await generateTokenPair(user.id, user.role);

  return {
    user: sanitizeUser(user),
    accessToken,
    refreshToken,
  };
}

/**
 * Authenticate a user with email + password.
 *
 * @param {{ email: string, password: string }} data
 * @returns {{ user: object, accessToken: string, refreshToken: string }}
 */
async function login(data) {
  const { email, password } = data;

  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });

  // Use constant-time comparison to prevent timing attacks
  // (bcrypt.compare on a dummy hash if user not found)
  const dummyHash = '$2b$12$invalidhashfortiminginvalidhash';
  const passwordToCompare = user ? user.passwordHash : dummyHash;
  const isValid = await bcrypt.compare(password, passwordToCompare);

  if (!user || !user.isActive || user.deletedAt || !isValid) {
    throw new AppError('Invalid email or password', 401);
  }

  const { accessToken, refreshToken } = await generateTokenPair(user.id, user.role);

  return {
    user: sanitizeUser(user),
    accessToken,
    refreshToken,
  };
}

/**
 * Rotate a refresh token and issue a new access + refresh pair.
 *
 * @param {string} refreshToken - Opaque token from cookie/header
 * @returns {{ user: object, accessToken: string, refreshToken: string }}
 */
async function refresh(refreshToken) {
  if (!refreshToken) {
    throw new AppError('Refresh token required', 401);
  }

  // Look up token in DB
  const stored = await prisma.refreshToken.findUnique({
    where: { token: refreshToken },
    include: { user: true },
  });

  if (!stored || stored.isRevoked || stored.expiresAt < new Date()) {
    throw new AppError('Invalid or expired refresh token', 401);
  }

  const { user } = stored;

  if (!user || !user.isActive || user.deletedAt) {
    throw new AppError('User account is inactive', 401);
  }

  // Revoke the used token (token rotation — prevents replay)
  await prisma.refreshToken.update({
    where: { token: refreshToken },
    data: { isRevoked: true },
  });

  // Issue new pair
  const tokens = await generateTokenPair(user.id, user.role);

  return {
    user: sanitizeUser(user),
    ...tokens,
  };
}

/**
 * Revoke a refresh token (logout).
 *
 * @param {string} refreshToken
 */
async function logout(refreshToken) {
  if (!refreshToken) return;

  await prisma.refreshToken.updateMany({
    where: { token: refreshToken, isRevoked: false },
    data: { isRevoked: true },
  });
}

/**
 * Generate an access token + refresh token pair.
 * Persists the refresh token to the DB.
 *
 * @param {string} userId
 * @param {string} role
 * @returns {{ accessToken: string, refreshToken: string }}
 */
async function generateTokenPair(userId, role) {
  const tokenId = uuidv4();
  const opaqueRefreshToken = `${uuidv4()}-${uuidv4()}-${tokenId}`; // Opaque, not guessable

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + REFRESH_TOKEN_EXPIRY_DAYS);

  // Persist the refresh token
  await prisma.refreshToken.create({
    data: {
      token: opaqueRefreshToken,
      userId,
      expiresAt,
    },
  });

  const accessToken = generateAccessToken({ userId, role });
  // Refresh token is the opaque string — stored in httpOnly cookie
  // JWT wrapper around it would be redundant since we validate from DB

  return {
    accessToken,
    refreshToken: opaqueRefreshToken,
  };
}

/**
 * Get a user's profile for auth responses.
 * Strips sensitive fields.
 *
 * @param {object} user
 * @returns {object}
 */
function sanitizeUser(user) {
  // eslint-disable-next-line no-unused-vars
  const { passwordHash, ...safe } = user;
  return safe;
}

/**
 * Validate that a user exists and is active.
 * Used by other services to guard access.
 *
 * @param {string} userId
 * @returns {object} user
 */
async function requireActiveUser(userId) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user || !user.isActive || user.deletedAt) {
    throw new AppError('User account not found or inactive', 404);
  }
  return user;
}

module.exports = { register, login, refresh, logout, requireActiveUser, sanitizeUser };

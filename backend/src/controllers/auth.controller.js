'use strict';

const authService = require('../services/auth.service');
const { createAuditLog, AUDIT_ACTIONS } = require('../middleware/auditLog');
const { success, created, noContent } = require('../utils/response');
const env = require('../config/env');

const REFRESH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: env.isProduction,
  sameSite: env.isProduction ? 'strict' : 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
  path: '/api/auth', // Scoped — only sent to auth endpoints
};

/**
 * POST /api/auth/register
 * Body: { email, password, firstName?, lastName? }
 */
async function register(req, res, next) {
  try {
    const { email, password, firstName, lastName } = req.body;

    const result = await authService.register({ email, password, firstName, lastName });

    // Set refresh token in httpOnly cookie
    res.cookie('refreshToken', result.refreshToken, REFRESH_COOKIE_OPTIONS);

    // Audit log
    await createAuditLog({
      userId: result.user.id,
      action: AUDIT_ACTIONS.USER_REGISTER,
      resource: 'auth',
      details: { email: result.user.email },
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
      status: 'SUCCESS',
    });

    return created(res, {
      user: result.user,
      accessToken: result.accessToken,
    }, 'Account created successfully');
  } catch (err) {
    await createAuditLog({
      action: AUDIT_ACTIONS.USER_REGISTER,
      resource: 'auth',
      details: { email: req.body?.email, error: err.message },
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
      status: 'FAILURE',
    });
    return next(err);
  }
}

/**
 * POST /api/auth/login
 * Body: { email, password }
 */
async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    const result = await authService.login({ email, password });

    res.cookie('refreshToken', result.refreshToken, REFRESH_COOKIE_OPTIONS);

    await createAuditLog({
      userId: result.user.id,
      action: AUDIT_ACTIONS.USER_LOGIN,
      resource: 'auth',
      details: { email: result.user.email },
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
      status: 'SUCCESS',
    });

    return success(res, {
      user: result.user,
      accessToken: result.accessToken,
    }, 'Login successful');
  } catch (err) {
    await createAuditLog({
      action: AUDIT_ACTIONS.USER_LOGIN,
      resource: 'auth',
      details: { email: req.body?.email, error: err.message },
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
      status: 'FAILURE',
    });
    return next(err);
  }
}

/**
 * POST /api/auth/refresh
 * Reads refresh token from httpOnly cookie.
 */
async function refreshToken(req, res, next) {
  try {
    const token = req.cookies?.refreshToken;

    const result = await authService.refresh(token);

    // Rotate cookie
    res.cookie('refreshToken', result.refreshToken, REFRESH_COOKIE_OPTIONS);

    await createAuditLog({
      userId: result.user.id,
      action: AUDIT_ACTIONS.TOKEN_REFRESH,
      resource: 'auth',
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
      status: 'SUCCESS',
    });

    return success(res, {
      user: result.user,
      accessToken: result.accessToken,
    }, 'Token refreshed');
  } catch (err) {
    return next(err);
  }
}

/**
 * POST /api/auth/logout
 * Revokes refresh token and clears cookie.
 */
async function logout(req, res, next) {
  try {
    const token = req.cookies?.refreshToken;
    const userId = req.user?.userId;

    await authService.logout(token);

    res.clearCookie('refreshToken', { path: '/api/auth' });

    await createAuditLog({
      userId,
      action: AUDIT_ACTIONS.USER_LOGOUT,
      resource: 'auth',
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
      status: 'SUCCESS',
    });

    return noContent(res);
  } catch (err) {
    return next(err);
  }
}

/**
 * GET /api/auth/me
 * Returns current authenticated user.
 */
async function getMe(req, res, next) {
  try {
    const user = await authService.requireActiveUser(req.user.userId);
    return success(res, authService.sanitizeUser(user), 'User retrieved');
  } catch (err) {
    return next(err);
  }
}

module.exports = { register, login, refreshToken, logout, getMe };

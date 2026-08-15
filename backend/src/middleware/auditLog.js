'use strict';

const prisma = require('../config/database');
const logger = require('../utils/logger');

/**
 * Audit logging middleware and utility.
 *
 * All sensitive actions are recorded in the AuditLog table.
 * This supports the AI Decision Audit Trail and security forensics.
 *
 * Audit logs are IMMUTABLE — no update or delete operations.
 */

/**
 * Log an action to the audit trail.
 * Fire-and-forget — errors are logged but never bubble up to the user.
 *
 * @param {object} params
 * @param {string|null} params.userId
 * @param {string|null} params.analysisId
 * @param {string} params.action - e.g. 'USER_LOGIN', 'ANALYSIS_STARTED'
 * @param {string|null} params.resource - e.g. 'auth', 'analysis'
 * @param {object|null} params.details - Non-sensitive context
 * @param {string|null} params.ipAddress
 * @param {string|null} params.userAgent
 * @param {'SUCCESS'|'FAILURE'|'WARNING'} params.status
 */
async function createAuditLog(params) {
  try {
    await prisma.auditLog.create({
      data: {
        userId: params.userId || null,
        analysisId: params.analysisId || null,
        action: params.action,
        resource: params.resource || null,
        details: params.details ? JSON.stringify(params.details) : null,
        ipAddress: params.ipAddress || null,
        userAgent: params.userAgent || null,
        status: params.status || 'SUCCESS',
      },
    });
  } catch (err) {
    // Audit logging failure must NEVER crash the application
    logger.error('Audit log write failed', { error: err.message, action: params.action });
  }
}

/**
 * Express middleware factory — attaches an audit helper to req.
 * Usage: router.post('/login', auditMiddleware, ...)
 *
 * Sets req.audit(action, details, status) for use in controllers.
 */
function auditMiddleware(req, res, next) {
  req.audit = (action, details = null, status = 'SUCCESS') => {
    createAuditLog({
      userId: req.user?.userId || null,
      action,
      resource: req.path.split('/')[1] || null,
      details,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
      status,
    });
  };
  return next();
}

/**
 * Pre-defined action constants for type safety.
 */
const AUDIT_ACTIONS = {
  // Auth
  USER_REGISTER: 'USER_REGISTER',
  USER_LOGIN: 'USER_LOGIN',
  USER_LOGOUT: 'USER_LOGOUT',
  TOKEN_REFRESH: 'TOKEN_REFRESH',
  PASSWORD_CHANGE: 'PASSWORD_CHANGE',
  ACCOUNT_DELETE: 'ACCOUNT_DELETE',

  // Profile
  PROFILE_UPDATE: 'PROFILE_UPDATE',
  RESUME_UPLOAD: 'RESUME_UPLOAD',
  RESUME_DELETE: 'RESUME_DELETE',

  // Analysis
  ANALYSIS_STARTED: 'ANALYSIS_STARTED',
  ANALYSIS_COMPLETED: 'ANALYSIS_COMPLETED',
  ANALYSIS_FAILED: 'ANALYSIS_FAILED',

  // Security
  UNAUTHORIZED_ACCESS: 'UNAUTHORIZED_ACCESS',
  RATE_LIMIT_HIT: 'RATE_LIMIT_HIT',
  INVALID_FILE_UPLOAD: 'INVALID_FILE_UPLOAD',
  PROMPT_INJECTION_DETECTED: 'PROMPT_INJECTION_DETECTED',
};

module.exports = { createAuditLog, auditMiddleware, AUDIT_ACTIONS };

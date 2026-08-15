'use strict';

const { forbidden } = require('../utils/response');

/**
 * Role-Based Access Control middleware.
 * Must be used AFTER authenticate() middleware.
 *
 * Role hierarchy: ADMIN > COUNSELOR > USER
 */

const ROLE_HIERARCHY = {
  USER: 1,
  COUNSELOR: 2,
  ADMIN: 3,
};

/**
 * Require one of the specified roles.
 * @param {...string} roles - Allowed roles (e.g. 'ADMIN', 'COUNSELOR')
 * @returns {import('express').RequestHandler}
 */
function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return forbidden(res, 'Authentication required before role check');
    }

    const userLevel = ROLE_HIERARCHY[req.user.role] || 0;
    const hasPermission = roles.some((role) => {
      const requiredLevel = ROLE_HIERARCHY[role] || 0;
      return userLevel >= requiredLevel;
    });

    if (!hasPermission) {
      return forbidden(
        res,
        `This action requires one of: ${roles.join(', ')}. Your role: ${req.user.role}`
      );
    }

    return next();
  };
}

/**
 * Shorthand helpers for common role checks.
 */
const requireAdmin = requireRole('ADMIN');
const requireCounselor = requireRole('COUNSELOR'); // Also allows ADMIN
const requireUser = requireRole('USER'); // Allows USER, COUNSELOR, ADMIN

/**
 * Ensure the authenticated user can only access their own resources,
 * unless they are an ADMIN or COUNSELOR.
 * Expects `req.params.userId` or `req.params.id` to contain the resource owner's ID.
 */
function requireOwnerOrCounselor(req, res, next) {
  if (!req.user) {
    return forbidden(res, 'Authentication required');
  }

  const resourceOwnerId = req.params.userId || req.params.id;
  const isOwner = req.user.userId === resourceOwnerId;
  const isCounselor = ROLE_HIERARCHY[req.user.role] >= ROLE_HIERARCHY.COUNSELOR;

  if (!isOwner && !isCounselor) {
    return forbidden(res, 'You can only access your own resources');
  }

  return next();
}

module.exports = {
  requireRole,
  requireAdmin,
  requireCounselor,
  requireUser,
  requireOwnerOrCounselor,
  ROLE_HIERARCHY,
};

'use strict';

const { Router } = require('express');
const { authenticate } = require('../middleware/auth');
const { requireAdmin } = require('../middleware/rbac');
const { success } = require('../utils/response');
const prisma = require('../config/database');

const router = Router();

/**
 * Admin routes — scaffold for Phase 1.
 * All routes require ADMIN role.
 * Full metrics dashboard in Phase 15.
 */

// GET /api/admin/users — list all users (ADMIN only)
router.get('/users', authenticate, requireAdmin, async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = Math.min(parseInt(req.query.limit, 10) || 20, 100);
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where: { deletedAt: null },
        select: {
          id: true,
          email: true,
          role: true,
          isActive: true,
          createdAt: true,
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.user.count({ where: { deletedAt: null } }),
    ]);

    return success(res, {
      users,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (err) {
    return next(err);
  }
});

// GET /api/admin/audit-logs
router.get('/audit-logs', authenticate, requireAdmin, async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = Math.min(parseInt(req.query.limit, 10) || 50, 200);
    const skip = (page - 1) * limit;

    const [logs, total] = await Promise.all([
      prisma.auditLog.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          userId: true,
          action: true,
          resource: true,
          status: true,
          ipAddress: true,
          createdAt: true,
        },
      }),
      prisma.auditLog.count(),
    ]);

    return success(res, {
      logs,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;

'use strict';

const rateLimit = require('express-rate-limit');
const env = require('../config/env');

/**
 * Rate limiting middleware.
 * Different limits are applied per route group.
 * All limits return JSON responses (not HTML).
 */

const defaultHandler = (req, res) => {
  res.status(429).json({
    success: false,
    message: 'Too many requests. Please slow down and try again later.',
    retryAfter: Math.ceil(env.RATE_LIMIT_WINDOW_MS / 1000),
    timestamp: new Date().toISOString(),
  });
};

/**
 * General API rate limit — 100 req / 15 min.
 */
const generalLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.RATE_LIMIT_MAX_GENERAL,
  standardHeaders: true,
  legacyHeaders: false,
  handler: defaultHandler,
  skip: () => env.isTest, // Skip rate limiting in tests
});

/**
 * Auth rate limit — stricter limit for login/register.
 * 10 requests per 15 minutes per IP.
 */
const authLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.RATE_LIMIT_MAX_AUTH,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: 'Too many authentication attempts. Please wait before trying again.',
      retryAfter: Math.ceil(env.RATE_LIMIT_WINDOW_MS / 1000),
      timestamp: new Date().toISOString(),
    });
  },
  skip: () => env.isTest,
});

/**
 * Analysis rate limit — expensive AI operations.
 * 5 analyses per 15 minutes per authenticated user.
 */
const analysisLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.RATE_LIMIT_MAX_ANALYSIS,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.user?.userId || req.ip, // Per-user, not per-IP
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: 'Analysis rate limit reached. AI analysis is resource-intensive. Please wait before running another.',
      retryAfter: Math.ceil(env.RATE_LIMIT_WINDOW_MS / 1000),
      timestamp: new Date().toISOString(),
    });
  },
  skip: () => env.isTest,
});

module.exports = { generalLimiter, authLimiter, analysisLimiter };

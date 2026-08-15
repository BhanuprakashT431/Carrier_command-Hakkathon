'use strict';

const { Router } = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/auth.controller');
const { authenticate } = require('../middleware/auth');
const { authLimiter } = require('../middleware/rateLimit');
const { validate } = require('../middleware/sanitize');

const router = Router();

/**
 * Validation rules for registration.
 */
const registerValidation = [
  body('email')
    .isEmail()
    .withMessage('A valid email address is required')
    .normalizeEmail()
    .isLength({ max: 254 })
    .withMessage('Email too long'),

  body('password')
    .isLength({ min: 8, max: 128 })
    .withMessage('Password must be 8–128 characters')
    .matches(/[A-Z]/)
    .withMessage('Password must contain at least one uppercase letter')
    .matches(/[a-z]/)
    .withMessage('Password must contain at least one lowercase letter')
    .matches(/\d/)
    .withMessage('Password must contain at least one number'),

  body('firstName')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('First name too long')
    .escape(),

  body('lastName')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Last name too long')
    .escape(),
];

/**
 * Validation rules for login.
 */
const loginValidation = [
  body('email')
    .isEmail()
    .withMessage('A valid email address is required')
    .normalizeEmail(),

  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ max: 128 })
    .withMessage('Password too long'),
];

// POST /api/auth/register
router.post(
  '/register',
  authLimiter,
  registerValidation,
  validate,
  authController.register
);

// POST /api/auth/login
router.post(
  '/login',
  authLimiter,
  loginValidation,
  validate,
  authController.login
);

// POST /api/auth/refresh
// Reads from httpOnly cookie — no body validation needed
router.post('/refresh', authController.refreshToken);

// POST /api/auth/logout
// Works for both authenticated and unauthenticated (clears cookie regardless)
router.post('/logout', authController.logout);

// GET /api/auth/me — requires valid access token
router.get('/me', authenticate, authController.getMe);

module.exports = router;

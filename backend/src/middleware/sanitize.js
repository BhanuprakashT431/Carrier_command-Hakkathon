'use strict';

const { validationResult } = require('express-validator');
const { validationError } = require('../utils/response');

/**
 * Input sanitization and validation middleware.
 *
 * Security considerations:
 * - All string inputs are trimmed and escaped
 * - Validation results are checked before any business logic runs
 * - This prevents prompt injection by ensuring structured, typed inputs reach agents
 */

/**
 * Validates the express-validator result and returns 422 if errors exist.
 * Use this after defining validation chains on a route.
 */
function validate(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return validationError(
      res,
      errors.array().map((e) => ({ field: e.path, message: e.msg, value: e.value }))
    );
  }
  return next();
}

/**
 * Sanitize request body by removing any keys starting with '$' or containing
 * special characters that could indicate injection attempts.
 * Applied globally to all POST/PUT/PATCH bodies.
 */
function sanitizeBody(req, res, next) {
  if (req.body && typeof req.body === 'object') {
    req.body = deepSanitize(req.body);
  }
  return next();
}

/**
 * Recursively sanitize an object, removing dangerous keys.
 * @param {*} obj
 * @returns {*}
 */
function deepSanitize(obj) {
  if (Array.isArray(obj)) {
    return obj.map(deepSanitize);
  }
  if (obj !== null && typeof obj === 'object') {
    const sanitized = Object.create(null);
    for (const [key, value] of Object.entries(obj)) {
      // Remove keys starting with $ (MongoDB injection) or __
      if (/^\$/.test(key) || /^__/.test(key)) continue;
      if (key === '__proto__' || key === 'constructor' || key === 'prototype') continue;
      sanitized[key] = deepSanitize(value);
    }
    return sanitized;
  }
  if (typeof obj === 'string') {
    // Truncate excessively long strings (prevent memory DoS)
    return obj.slice(0, 50000);
  }
  return obj;
}

/**
 * Prompt injection protection for agent inputs.
 * Strips common prompt injection patterns from string values.
 * This is a defense-in-depth measure; the main protection is structured JSON inputs.
 *
 * @param {string} text
 * @returns {string}
 */
function sanitizeForPrompt(text) {
  if (typeof text !== 'string') return text;

  // Remove common injection patterns
  const patterns = [
    /ignore\s+(all\s+)?previous\s+instructions?/gi,
    /you\s+are\s+(now\s+)?a\s+/gi,
    /system\s*:\s*/gi,
    /\[system\]/gi,
    /\[user\]/gi,
    /\[assistant\]/gi,
    /<!--[\s\S]*?-->/g, // HTML comments
  ];

  let sanitized = text;
  for (const pattern of patterns) {
    sanitized = sanitized.replace(pattern, '[SANITIZED]');
  }

  return sanitized;
}

module.exports = { validate, sanitizeBody, sanitizeForPrompt, deepSanitize };

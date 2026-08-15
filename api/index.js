'use strict';

// ============================================================
// Vercel Serverless Function — Backend Express API
// This file is the entry point for all /api/* routes on Vercel.
// ============================================================

// Load environment variables first (if .env exists)
require('dotenv').config({ path: require('path').join(__dirname, '../backend/.env') });

const app = require('../backend/src/app');

module.exports = app;

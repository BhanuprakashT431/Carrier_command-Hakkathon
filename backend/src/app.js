'use strict';

const path = require('path');
const fs = require('fs');
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const { v4: uuidv4 } = require('uuid');

const env = require('./config/env');
const routes = require('./routes');
const { errorHandler } = require('./middleware/errorHandler');
const { generalLimiter } = require('./middleware/rateLimit');
const { sanitizeBody } = require('./middleware/sanitize');
const logger = require('./utils/logger');

// Path to the built frontend — served as a fallback in all deployment modes.
// In Catalyst Advanced I/O (single-function), the frontend dist is copied here.
const FRONTEND_DIST = path.resolve(__dirname, '../../frontend/dist');

const app = express();

// ============================================================
// Security headers (Helmet)
// ============================================================
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", 'data:', 'blob:'],
        connectSrc: ["'self'"],
        fontSrc: ["'self'"],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'"],
        frameSrc: ["'none'"],
      },
    },
    crossOriginEmbedderPolicy: false, // Allow frontend to embed content
  })
);

// ============================================================
// CORS — allow configured origins & cloud deployment domains
// ============================================================
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl, Postman, server-to-server)
      if (!origin) return callback(null, true);
      // Allow any localhost origin during development
      if (origin.startsWith('http://localhost:')) return callback(null, true);
      // Allow any vercel deployment
      if (origin.endsWith('.vercel.app')) return callback(null, true);
      // Allow Zoho Catalyst deployments (all known Catalyst domains)
      if (origin.endsWith('.zohocatalyst.com')) return callback(null, true);
      if (origin.endsWith('.zohocatalystapp.com')) return callback(null, true);
      // Allow Zoho Catalyst onslate.in CDN/app domain
      if (origin.endsWith('.onslate.in')) return callback(null, true);
      if (env.CORS_ORIGINS.includes(origin)) return callback(null, true);
      
      logger.warn(`CORS rejected origin: ${origin}`);
      return callback(new Error(`CORS policy: origin ${origin} not allowed`), false);
    },
    credentials: true, // Allow cookies
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-ID'],
    exposedHeaders: ['X-Request-ID'],
  })
);

// ============================================================
// Request ID — for tracing
// ============================================================
app.use((req, res, next) => {
  req.id = req.headers['x-request-id'] || uuidv4();
  res.setHeader('X-Request-ID', req.id);
  next();
});

// ============================================================
// Request logging
// ============================================================
if (!env.isTest) {
  app.use(
    morgan('combined', {
      stream: { write: (msg) => logger.info(msg.trim()) },
    })
  );
}

// ============================================================
// Body parsing
// ============================================================
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use(cookieParser(env.COOKIE_SECRET));

// ============================================================
// Global input sanitization
// ============================================================
app.use(sanitizeBody);

// ============================================================
// General rate limiting (all routes)
// ============================================================
app.use(generalLimiter);

// ============================================================
// Trust proxy (for correct IP behind reverse proxy in prod)
// ============================================================
if (env.isProduction) {
  app.set('trust proxy', 1);
}

// ============================================================
// API routes
// ============================================================
app.use('/api', routes);

// ============================================================
// Frontend static files + SPA fallback
// Serve the React build and fall through to index.html for
// client-side routing.  Only active when the dist folder exists.
// ============================================================
if (fs.existsSync(FRONTEND_DIST)) {
  app.use(express.static(FRONTEND_DIST, { index: false }));

  // SPA fallback: every non-/api GET returns index.html
  app.get('*', (req, res) => {
    res.sendFile(path.join(FRONTEND_DIST, 'index.html'));
  });
  logger.info(`Serving frontend from: ${FRONTEND_DIST}`);
} else {
  // API-only mode (separate frontend deployment)
  app.use((req, res) => {
    res.status(404).json({
      success: false,
      message: `Route ${req.method} ${req.path} not found`,
      timestamp: new Date().toISOString(),
    });
  });
}

// ============================================================
// Global error handler (must be last)
// ============================================================
app.use(errorHandler);

module.exports = app;

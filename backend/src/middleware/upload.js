'use strict';

const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const env = require('../config/env');

// Ensure upload directory exists
const uploadDir = path.resolve(env.UPLOAD_DIR);
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

/**
 * Allowed MIME types for resume upload.
 * Only PDF and DOCX are permitted.
 */
const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

const ALLOWED_EXTENSIONS = ['.pdf', '.docx'];
const MAX_SIZE_BYTES = env.MAX_FILE_SIZE_MB * 1024 * 1024;

/**
 * Multer disk storage — renames file to UUID to prevent path traversal.
 */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const safeName = `${uuidv4()}${ext}`;
    cb(null, safeName);
  },
});

/**
 * File filter — validates MIME type AND file extension.
 * Both must match to prevent MIME-spoofing attacks.
 */
function fileFilter(req, file, cb) {
  const ext = path.extname(file.originalname).toLowerCase();
  const mimeOk = ALLOWED_MIME_TYPES.includes(file.mimetype);
  const extOk = ALLOWED_EXTENSIONS.includes(ext);

  if (!mimeOk || !extOk) {
    const err = new Error(
      `Invalid file type. Only PDF and DOCX files are accepted. ` +
      `Received: ${file.mimetype} (${ext})`
    );
    err.code = 'INVALID_MIME_TYPE';
    return cb(err, false);
  }

  return cb(null, true);
}

const upload = multer({
  storage,
  limits: { fileSize: MAX_SIZE_BYTES },
  fileFilter,
});

/**
 * Resume upload middleware — single file, field name "resume".
 */
const uploadResume = upload.single('resume');

/**
 * Wrapped resume upload that converts multer errors to AppError format.
 */
function resumeUploadMiddleware(req, res, next) {
  uploadResume(req, res, (err) => {
    if (err) {
      return next(err); // Handled by global errorHandler
    }
    return next();
  });
}

module.exports = { resumeUploadMiddleware, ALLOWED_MIME_TYPES, ALLOWED_EXTENSIONS };

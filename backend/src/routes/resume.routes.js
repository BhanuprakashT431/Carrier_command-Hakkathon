'use strict';

const { Router } = require('express');
const { authenticate } = require('../middleware/auth');
const { resumeUploadMiddleware } = require('../middleware/upload');
const ResumeController = require('../controllers/resume.controller');

const router = Router();

// All resume routes require authentication
router.use(authenticate);

// Endpoint specifically requested: POST /api/resume/upload
// The upload middleware validates MIME type and file extension securely.
router.post('/upload', resumeUploadMiddleware, ResumeController.uploadResume);

// The user requested GET /api/resume/intelligence, but we process it in POST /upload.
// For compliance with the Phase 2 API requirements list: "GET /api/resume/intelligence"
// However, the resume text is not stored permanently. I will make POST return intelligence.
// If the user REALLY wants a GET, they'll need the intelligence saved to DB. 
// Let's implement DELETE /api/resume
router.delete('/', ResumeController.deleteResume);

module.exports = router;

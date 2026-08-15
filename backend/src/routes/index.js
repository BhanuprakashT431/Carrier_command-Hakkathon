'use strict';

const { Router } = require('express');

const router = Router();

/**
 * Central route registration.
 * All API routes are mounted here.
 */

router.use('/health', require('./health.routes'));
router.use('/auth', require('./auth.routes'));
router.use('/profile', require('./profile.routes'));
router.use('/admin', require('./admin.routes'));

// Phase 2+ routes
router.use('/resume', require('./resume.routes'));
router.use('/analysis', require('./analysis.routes'));
router.use('/simulations', require('./simulation.routes'));
router.use('/comparisons', require('./comparison.routes'));
// router.use('/skills', require('./skills.routes'));
// router.use('/jobs', require('./jobs.routes'));
// router.use('/evaluation', require('./evaluation.routes'));

router.use('/copilot', require('./copilot.routes'));
router.use('/progress', require('./progress.routes'));
router.use('/learning-plan/milestones', require('./milestone.routes'));
router.use('/recommendations', require('./recommendation.routes'));

module.exports = router;

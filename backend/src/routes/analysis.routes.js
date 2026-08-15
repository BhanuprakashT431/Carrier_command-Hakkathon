'use strict';

const { Router } = require('express');
const { authenticate } = require('../middleware/auth');
const AnalysisController = require('../controllers/analysis.controller');

const router = Router();

// All analysis routes require authentication
router.use(authenticate);

// Run analysis
router.post('/run', AnalysisController.runAnalysis);

// Get analysis status
router.get('/:id/status', AnalysisController.getAnalysisStatus);

// Get analysis full results
router.get('/:id/results', AnalysisController.getAnalysisResults);

// Phase 4 Routes
router.get('/:id/stress-test', AnalysisController.getStressTest);
router.get('/:id/evidence', AnalysisController.getEvidence);
router.get('/:id/learning-roadmap', AnalysisController.getLearningRoadmap);
router.get('/:id/decision', AnalysisController.getDecision);
router.get('/:id/explain', AnalysisController.getExplain);

module.exports = router;

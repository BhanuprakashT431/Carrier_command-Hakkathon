'use strict';

const { Router } = require('express');
const ComparisonController = require('../controllers/comparison.controller');
const { authenticate } = require('../middleware/auth');

const router = Router();

router.use(authenticate);

router.post('/', ComparisonController.compareCareers);

module.exports = router;

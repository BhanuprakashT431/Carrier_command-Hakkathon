const { Router } = require('express');
const { authenticate } = require('../middleware/auth');
const RecommendationController = require('../controllers/recommendation.controller');

const router = Router();
router.use(authenticate);

router.get('/current', RecommendationController.getCurrent);
router.get('/changes', RecommendationController.getChanges);

module.exports = router;

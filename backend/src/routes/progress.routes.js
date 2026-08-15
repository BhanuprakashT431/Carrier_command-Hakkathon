const { Router } = require('express');
const { authenticate } = require('../middleware/auth');
const ProgressController = require('../controllers/progress.controller');

const router = Router();
router.use(authenticate);

router.get('/', ProgressController.getProgress);
router.get('/skills', ProgressController.getSkillProgress);
router.get('/career-readiness', ProgressController.getCareerReadiness);
router.patch('/skills/:skillId', ProgressController.updateSkillProgress);

module.exports = router;

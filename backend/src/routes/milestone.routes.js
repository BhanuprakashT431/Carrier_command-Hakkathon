const { Router } = require('express');
const { authenticate } = require('../middleware/auth');
const MilestoneController = require('../controllers/milestone.controller');

const router = Router();
router.use(authenticate);

router.get('/', MilestoneController.getMilestones);
router.get('/weekly-plan', MilestoneController.getWeeklyPlan);
router.post('/:id/start', MilestoneController.startMilestone);
router.post('/:id/complete', MilestoneController.completeMilestone);
router.post('/:id/skip', MilestoneController.skipMilestone);

module.exports = router;

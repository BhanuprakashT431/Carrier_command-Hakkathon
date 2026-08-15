const { Router } = require('express');
const { authenticate } = require('../middleware/auth');
const CopilotController = require('../controllers/copilot.controller');

const router = Router();
router.use(authenticate);

router.post('/message', CopilotController.sendMessage);
router.get('/conversations', CopilotController.getConversations);
router.get('/conversations/:id', CopilotController.getConversation);
router.delete('/conversations/:id', CopilotController.deleteConversation);

module.exports = router;

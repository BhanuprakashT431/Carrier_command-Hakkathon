'use strict';

const { Router } = require('express');
const SimulationController = require('../controllers/simulation.controller');
const { authenticate } = require('../middleware/auth');

const router = Router();

router.use(authenticate);

router.post('/', SimulationController.runSimulation);
router.get('/', SimulationController.getSimulations);
router.get('/:id', SimulationController.getSimulation);
router.delete('/:id', SimulationController.deleteSimulation);

module.exports = router;

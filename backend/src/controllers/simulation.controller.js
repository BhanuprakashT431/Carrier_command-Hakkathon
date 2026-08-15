'use strict';

const SimulationService = require('../services/simulation.service');
const { success: successResponse, error: errorResponse } = require('../utils/response');

class SimulationController {
  static async runSimulation(req, res) {
    try {
      const { baseAnalysisId, scenarioType, scenarioParams, dataMode } = req.body;
      
      if (!scenarioType) {
        return errorResponse(res, 'scenarioType is required', 400);
      }
      
      const sim = await SimulationService.runSimulation(
        req.user.userId,
        baseAnalysisId,
        scenarioType,
        scenarioParams,
        dataMode
      );
      return successResponse(res, sim, 'Simulation run successfully', 201);
    } catch (err) {
      return errorResponse(res, err.message, 400);
    }
  }

  static async getSimulations(req, res) {
    try {
      const sims = await SimulationService.getSimulations(req.user.id);
      return successResponse(res, sims, 'Simulations retrieved');
    } catch (err) {
      return errorResponse(res, err.message, 400);
    }
  }

  static async getSimulation(req, res) {
    try {
      const sim = await SimulationService.getSimulation(req.user.id, req.params.id);
      return successResponse(res, sim, 'Simulation retrieved');
    } catch (err) {
      return errorResponse(res, err.message, 404);
    }
  }

  static async deleteSimulation(req, res) {
    try {
      await SimulationService.deleteSimulation(req.user.id, req.params.id);
      return successResponse(res, null, 'Simulation deleted');
    } catch (err) {
      return errorResponse(res, err.message, 404);
    }
  }
}

module.exports = SimulationController;

'use strict';

const axios = require('axios');
const prisma = require('../config/database');
const env = require('../config/env');
const logger = require('../utils/logger');

class SimulationService {
  /**
   * Run a What-If Simulation
   */
  static async runSimulation(userId, baseAnalysisId, scenarioType, scenarioParams, dataMode = 'DEMO') {
    // 1. Validate analysis exists and belongs to user
    const analysis = await prisma.analysis.findUnique({
      where: { id: baseAnalysisId },
      include: { careerDecision: true }
    });

    if (!analysis || analysis.userId !== userId) {
      console.log("SimulationService error: analysis=", analysis, "userId=", userId);
      throw new Error('Analysis not found or unauthorized');
    }

    // 2. Reconstruct AnalysisResponse for python
    const agentRuns = await prisma.agentRun.findMany({
      where: { analysisId: baseAnalysisId }
    });

    const agentData = {};
    const agentsCompleted = [];
    for (const run of agentRuns) {
      agentData[run.agentName] = run.outputJson;
      agentsCompleted.push(run.agentName);
    }
    
    let finalDecision = null;
    if (analysis.careerDecision) {
      finalDecision = {
        original_suitability_score: analysis.careerDecision.suitabilityScore || 0,
        stress_adjusted_score: analysis.careerDecision.stressAdjustedScore || 0,
        risk_score: analysis.careerDecision.riskScore || 0,
        stress_test_robustness: analysis.careerDecision.robustnessScore || 0,
        recommendation_stability: analysis.careerDecision.stabilityScore || 0,
        evidence_coverage: analysis.careerDecision.evidenceCoverage || 0,
        unsupported_claim_rate: 0,
        overall_confidence: analysis.careerDecision.confidence || 0
      };
    }

    const baseAnalysisResponse = {
      analysis_id: baseAnalysisId,
      status: analysis.status.toLowerCase(),
      data_mode: analysis.dataMode.toLowerCase(),
      agents_completed: agentsCompleted,
      agent_data: agentData,
      final_decision: finalDecision,
      message: 'Reconstructed for simulation'
    };

    // Call Python Simulation Engine
    let response;
    try {
      response = await axios.post(`${env.AGENTS_SERVICE_URL}/api/simulations`, {
        base_analysis: baseAnalysisResponse,
        scenario: {
          type: scenarioType,
          changes: scenarioParams
        }
      }, { timeout: 60000 });
    } catch (err) {
      logger.error(`Simulation Engine failed: ${err.message}`);
      throw new Error('Simulation engine failed to complete');
    }

    const result = response.data;
    
    // 3. Persist Simulation result to DB
    const simulation = await prisma.simulation.create({
      data: {
        userId,
        baseAnalysisId,
        scenarioType,
        scenarioParams: scenarioParams,
        originalScores: result.original_score != null ? { score: result.original_score } : (result.original || {}),
        simulatedScores: result.new_score != null ? { score: result.new_score } : (result.simulated || {}),
        rankingChanges: result.delta != null ? [{ role: 'Target Role', scoreDelta: result.delta, beforeScore: result.original_score, afterScore: result.new_score, rankingChange: 0 }] : (result.changes || []),
        dataMode: (dataMode || 'DEMO').toUpperCase()
      }
    });

    return simulation;
  }

  static async getSimulations(userId) {
    return prisma.simulation.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });
  }

  static async getSimulation(userId, id) {
    const sim = await prisma.simulation.findUnique({ where: { id } });
    if (!sim || sim.userId !== userId) {
      throw new Error('Simulation not found or unauthorized');
    }
    return sim;
  }

  static async deleteSimulation(userId, id) {
    const sim = await this.getSimulation(userId, id);
    await prisma.simulation.delete({ where: { id: sim.id } });
    return true;
  }
}

module.exports = SimulationService;

'use strict';

const axios = require('axios');
const prisma = require('../config/database');
const env = require('../config/env');
const logger = require('../utils/logger');
const ProfileService = require('./profile.service');

class AnalysisService {
  /**
   * Starts an analysis run.
   * 1. Creates an Analysis record in DB.
   * 2. Fires off async request to Python service.
   * 3. Returns the analysis_id immediately.
   */
  static async startAnalysis(userId, dataMode = 'DEMO') {
    // 1. Fetch full user profile
    const profile = await ProfileService.getFullProfile(userId);
    if (!profile) {
      throw new Error('Profile must be created before running analysis');
    }

    // 2. Create Analysis record
    const analysis = await prisma.analysis.create({
      data: {
        userId,
        status: 'PENDING',
        dataMode,
        currentPhase: 'QUEUED',
        progress: 0,
      }
    });

    // Log audit
    await prisma.auditLog.create({
      data: {
        userId,
        analysisId: analysis.id,
        action: 'ANALYSIS_STARTED',
        resource: 'analysis',
        status: 'SUCCESS',
        details: { dataMode }
      }
    });

    // 3. Fire-and-forget call to Python Orchestrator
    // We do NOT await this in the controller; we run it in background.
    this.runOrchestratorAsync(analysis.id, userId, profile, dataMode).catch(err => {
      logger.error(`Orchestrator background run failed: ${err.message}`);
    });

    return analysis.id;
  }

  /**
   * Background runner that calls the Python orchestrator and handles the result.
   */
  static async runOrchestratorAsync(analysisId, userId, profile, dataMode) {
    try {
      // Mark as RUNNING
      await prisma.analysis.update({
        where: { id: analysisId },
        data: { status: 'RUNNING', currentPhase: 'PROFILE_RUNNING', progress: 5 }
      });

      // Call Python Orchestrator
      // Using a high timeout for Phase 3 since we run 5 agents.
      const response = await axios.post(`${env.AGENTS_SERVICE_URL}/analysis/run`, {
        analysis_id: analysisId,
        user_id: userId,
        profile,
        data_mode: (dataMode || 'demo').toLowerCase()
      }, { timeout: 60000 });

      const result = response.data;

      // Handle orchestrator failure response
      if (result.status === 'failed') {
         await this.markAnalysisFailed(analysisId, result.message || 'Orchestrator failed to complete');
         return;
      }
      
      if (result.status === 'partial') {
         // Partial success
         await prisma.analysis.update({
           where: { id: analysisId },
           data: { status: 'PARTIAL', currentPhase: 'PARTIAL', progress: 100, completedAt: new Date() }
         });
         await this.persistAnalysisResults(analysisId, result);
         return;
      }

      await this.persistAnalysisResults(analysisId, result);

      await prisma.analysis.update({
        where: { id: analysisId },
        data: { 
          status: 'COMPLETED', 
          progress: 100, 
          currentPhase: 'COMPLETED',
          completedAt: new Date()
        }
      });

    } catch (err) {
      logger.error(`Error in runOrchestratorAsync: ${err.message}`);
      await this.markAnalysisFailed(analysisId, err.message);
    }
  }

  static async markAnalysisFailed(analysisId, errorMessage) {
    try {
      await prisma.analysis.update({
        where: { id: analysisId },
        data: { status: 'FAILED', error: errorMessage, currentPhase: 'FAILED', progress: 0 }
      });
    } catch (e) {
      logger.error(`Failed to mark analysis failed: ${e.message}`);
    }
  }

  /**
   * Saves the structured results from the Orchestrator to the Database.
   */
  static async persistAnalysisResults(analysisId, orchestratorOutput) {
    // orchestratorOutput should contain agent_runs and final_decision.
    
    const { final_decision, agent_data } = orchestratorOutput;
    const career_decision = final_decision || (agent_data && agent_data.career_agent) || null;
    const skill_gaps = agent_data && agent_data.skill_gap_agent ? agent_data.skill_gap_agent.gaps : null;
    const risk_assessment = agent_data && agent_data.risk_agent ? agent_data.risk_agent : null;
    const agents_completed = orchestratorOutput.agents_completed || [];
    
    // 1. Agent Runs
    if (agents_completed && agents_completed.length > 0) {
      const runsData = agents_completed.map(agentName => {
        const run = (agent_data && agent_data[agentName]) || {};
        return {
          analysisId,
          agentName: agentName,
          status: run.status === 'success' ? 'COMPLETED' : (run.status === 'failed' ? 'FAILED' : 'COMPLETED'),
          phase: run.phase || 1,
          outputJson: run.output || run,
          confidence: run.confidence || 0,
          dataMode: (run.data_mode || 'DEMO').toUpperCase(),
          latencyMs: run.processing_time_ms || 0
        };
      });
      logger.info(`Inserting ${runsData.length} agent runs for analysis ${analysisId}`);
      try {
        await prisma.agentRun.createMany({ data: runsData });
        logger.info(`Agent runs inserted for analysis ${analysisId}`);
      } catch (e) {
        logger.error(`AgentRun createMany failed for analysis ${analysisId}: ${e.message}`);
      }
    }

    // 2. Career Decision
    if (career_decision) {
      const top = career_decision;
      const careerAgent = agent_data && agent_data.career_agent ? agent_data.career_agent : {};
      const profileAgent = agent_data && agent_data.profile_agent ? agent_data.profile_agent : {};
      const riskAgent = agent_data && agent_data.risk_agent ? agent_data.risk_agent : {};
      const evidenceAgent = agent_data && agent_data.evidence_agent ? agent_data.evidence_agent : {};
      const advAgent = agent_data && agent_data.adversarial_agent ? agent_data.adversarial_agent : {};

      await prisma.careerDecision.create({
        data: {
          analysisId,
          career: careerAgent.career || top.career || 'Unknown',
          suitabilityScore: top.original_suitability_score || careerAgent.final_score || 0,
          stressAdjustedScore: top.stress_adjusted_score || 0,
          riskScore: top.risk_score || 0,
          stressTestRobustness: top.stress_test_robustness || 0,
          stabilityScore: top.recommendation_stability || 0,
          overallConfidence: top.overall_confidence || 0,
          unsupportedClaimRate: top.unsupported_claim_rate || 0,
          evidenceCoverage: top.evidence_coverage || 0,
          agentAgreementRate: top.agent_agreement_rate || 1,
          dataMode: (top.data_mode || 'DEMO').toUpperCase(),
          scoreDisclaimer: top.score_disclaimer || 'System-generated.',
          strengths: profileAgent.inferences?.strengths || top.strengths || [],
          skillGaps: top.skill_gaps || [],
          risks: riskAgent.risks || top.risks || [],
          evidence: evidenceAgent.verifications || top.evidence || [],
          alternativeCareers: careerAgent.alternatives || top.alternatives || [],
          stressTestResults: advAgent.scenarios || top.stress_tests || [],
          agentDisagreements: top.agent_disagreements || [],
          assumptions: top.assumptions || [],
          uncertainties: top.uncertainties || [],
          finalReasoning: top.final_reasoning || '',
          nextActions: top.next_actions || []
        }
      });
    }

    // 3. Skill Gaps
    if (skill_gaps && skill_gaps.length > 0) {
      await prisma.skillGap.createMany({
        data: skill_gaps.map(gap => ({
          analysisId,
          career: gap.career,
          skillName: gap.skill_name,
          currentLevel: gap.current_level,
          requiredLevel: gap.required_level,
          gapSize: gap.gap_size,
          priority: gap.priority,
          dataMode: gap.data_mode || 'DEMO'
        }))
      });
    }

    // 4. Risk Assessment
    if (risk_assessment && risk_assessment.factors) {
      await prisma.riskAssessment.create({
        data: {
          analysisId,
          career: risk_assessment.career || 'General',
          overallRisk: risk_assessment.overall_risk || 'MEDIUM',
          riskScore: risk_assessment.risk_score || 50,
          factors: risk_assessment.factors || [],
          mitigations: risk_assessment.mitigations || [],
          dataMode: risk_assessment.data_mode || 'DEMO'
        }
      });
    }

    // 5. Learning Plan
    const learning_plan = agent_data && agent_data.learning_agent ? agent_data.learning_agent : null;
    if (learning_plan) {
      await prisma.learningPlan.create({
        data: {
          analysisId,
          career: learning_plan.career || 'General',
          day30Plan: learning_plan.day30_plan || {},
          day60Plan: learning_plan.day60_plan || {},
          day90Plan: learning_plan.day90_plan || {},
          month6Plan: learning_plan.month6_plan || {},
          resources: learning_plan.resources || [],
          totalDuration: learning_plan.total_duration || '6 months',
          dataMode: (learning_plan.data_mode || 'DEMO').toUpperCase()
        }
      });
    }

    // 6. Stress Test & Scenarios
    const stress_test = agent_data && agent_data.adversarial_agent ? agent_data.adversarial_agent : null;
    if (stress_test) {
      const createdStressTest = await prisma.stressTest.create({
        data: {
          analysisId,
          robustnessScore: stress_test.robustness_score || 0,
          scenariosSurvived: stress_test.scenarios_survived || 0,
          scenariosFailed: stress_test.scenarios_failed || 0,
          scenariosPartial: stress_test.scenarios_partial || 0,
          totalScenarios: stress_test.total_scenarios || 10,
          instabilityDetected: stress_test.instability_detected || false,
          stabilityDelta: stress_test.stability_delta || 0,
          dataMode: (stress_test.data_mode || 'DEMO').toUpperCase()
        }
      });

      if (stress_test.scenarios && stress_test.scenarios.length > 0) {
        await prisma.stressScenario.createMany({
          data: stress_test.scenarios.map(sc => ({
            stressTestId: createdStressTest.id,
            scenarioId: sc.scenario_id || 0,
            name: sc.name || 'Unknown',
            description: sc.description || '',
            result: sc.result || 'FAILED',
            impact: sc.impact || 'MEDIUM',
            scoreDelta: sc.score_delta || 0,
            reasoning: sc.reasoning || ''
          }))
        });
      }
    }

    // 7. Evidence Tracking
    const evidence_agent = agent_data && agent_data.evidence_agent ? agent_data.evidence_agent : null;
    const evidence = evidence_agent ? evidence_agent.verifications : null;
    if (evidence && evidence.length > 0) {
      await prisma.evidence.createMany({
        data: evidence.map(ev => ({
          analysisId,
          agentName: ev.agent_name || 'EvidenceAgent',
          claim: ev.claim,
          source: ev.source || null,
          sourceDate: ev.source_date || null,
          sourceType: ev.source_type || null,
          confidence: ev.confidence || 0,
          isSupported: ev.status === 'VERIFIED',
          dataMode: (ev.data_mode || 'DEMO').toUpperCase()
        }))
      });
    }
  }

  static async getAnalysisStatus(userId, analysisId) {
    const analysis = await prisma.analysis.findUnique({
      where: { id: analysisId, userId }
    });
    if (!analysis) throw new Error('Analysis not found');
    return analysis;
  }

  static async getLatestAnalysis(userId) {
    const analysis = await prisma.analysis.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });
    return analysis;
  }

  static async getAnalysisResults(userId, analysisId) {
    const analysis = await prisma.analysis.findUnique({
      where: { id: analysisId, userId },
      include: {
        careerDecision: true,
        skillGaps: true,
        riskAssessment: true,
        agentRuns: true
      }
    });
    if (!analysis) throw new Error('Analysis not found');
    return analysis;
  }

  static async getAnalysisSpecificResult(userId, analysisId, relation) {
    const includeObj = {};
    if (relation === 'stressTest') {
      includeObj.stressTest = { include: { scenarios: true } };
    } else {
      includeObj[relation] = true;
    }

    const analysis = await prisma.analysis.findUnique({
      where: { id: analysisId, userId },
      include: includeObj
    });
    
    if (!analysis) throw new Error('Analysis not found');
    return analysis[relation] || null;
  }
}

module.exports = AnalysisService;

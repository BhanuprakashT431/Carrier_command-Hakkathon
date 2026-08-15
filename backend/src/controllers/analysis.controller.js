'use strict';

const AnalysisService = require('../services/analysis.service');
const { success } = require('../utils/response');
const { AppError } = require('../middleware/errorHandler');

class AnalysisController {
  static async runAnalysis(req, res, next) {
    try {
      const dataMode = req.body.dataMode || 'DEMO';
      const analysisId = await AnalysisService.startAnalysis(req.user.userId, dataMode);
      
      return res.status(202).json({
        success: true,
        data: { analysisId },
        message: 'Analysis queued successfully'
      });
    } catch (err) {
      if (err.message.includes('Profile must be created')) {
        return next(new AppError(err.message, 400));
      }
      next(err);
    }
  }

  static async getLatestAnalysis(req, res, next) {
    try {
      const AnalysisService = require('../services/analysis.service');
      const latest = await AnalysisService.getLatestAnalysis(req.user.userId);
      if (!latest) {
        return success(res, null, 'No analysis found');
      }
      return success(res, latest, 'Latest analysis retrieved');
    } catch (err) {
      next(err);
    }
  }

  static async getAnalysisStatus(req, res, next) {
    try {
      const { id } = req.params;
      const status = await AnalysisService.getAnalysisStatus(req.user.userId, id);
      return success(res, status, 'Analysis status retrieved');
    } catch (err) {
      if (err.message === 'Analysis not found') {
        return next(new AppError(err.message, 404));
      }
      next(err);
    }
  }

  static async getAnalysisResults(req, res, next) {
    try {
      const { id } = req.params;
      const results = await AnalysisService.getAnalysisResults(req.user.userId, id);
      return success(res, results, 'Analysis results retrieved');
    } catch (err) {
      if (err.message === 'Analysis not found') {
        return next(new AppError(err.message, 404));
      }
      next(err);
    }
  }
  static async getStressTest(req, res, next) {
    try {
      const { id } = req.params;
      const results = await AnalysisService.getAnalysisSpecificResult(req.user.userId, id, 'stressTest');
      return success(res, results, 'Stress test retrieved');
    } catch (err) {
      if (err.message === 'Analysis not found') return next(new AppError(err.message, 404));
      next(err);
    }
  }

  static async getEvidence(req, res, next) {
    try {
      const { id } = req.params;
      const results = await AnalysisService.getAnalysisSpecificResult(req.user.userId, id, 'evidence');
      return success(res, results, 'Evidence retrieved');
    } catch (err) {
      if (err.message === 'Analysis not found') return next(new AppError(err.message, 404));
      next(err);
    }
  }

  static async getLearningRoadmap(req, res, next) {
    try {
      const { id } = req.params;
      const results = await AnalysisService.getAnalysisSpecificResult(req.user.userId, id, 'learningPlan');
      return success(res, results, 'Learning roadmap retrieved');
    } catch (err) {
      if (err.message === 'Analysis not found') return next(new AppError(err.message, 404));
      next(err);
    }
  }

  static async getDecision(req, res, next) {
    try {
      const { id } = req.params;
      const results = await AnalysisService.getAnalysisSpecificResult(req.user.userId, id, 'careerDecision');
      return success(res, results, 'Final decision retrieved');
    } catch (err) {
      if (err.message === 'Analysis not found') return next(new AppError(err.message, 404));
      next(err);
    }
  }

  static async getExplain(req, res, next) {
    try {
      const { id } = req.params;
      const analysis = await AnalysisService.getAnalysisResults(req.user.userId, id);
      const decision = analysis.careerDecision || {};
      const evidence = await AnalysisService.getAnalysisSpecificResult(req.user.userId, id, 'evidence');
      
      const explain = {
        why_recommended: decision.strengths || [],
        weaknesses: decision.risks || decision.skillGaps || [],
        evidence: evidence || [],
        what_could_change: decision.uncertainties || [],
        confidence: decision.overallConfidence || 0
      };

      return success(res, explain, 'Explanation retrieved');
    } catch (err) {
      if (err.message === 'Analysis not found') return next(new AppError(err.message, 404));
      next(err);
    }
  }
}

module.exports = AnalysisController;

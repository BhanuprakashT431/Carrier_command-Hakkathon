'use strict';

const prisma = require('../config/database');

class RecommendationService {
  /**
   * Get current career recommendation from latest completed analysis + snapshot.
   */
  async getCurrentRecommendation(userId) {
    const analysis = await prisma.analysis.findFirst({
      where: { userId, status: 'COMPLETED' },
      orderBy: { completedAt: 'desc' },
      include: { careerDecision: true },
    });

    const snapshot = await prisma.progressSnapshot.findFirst({
      where: { userId },
      orderBy: { snapshotDate: 'desc' },
    });

    if (!analysis?.careerDecision) {
      return {
        career: null,
        suitabilityScore: null,
        stressAdjustedScore: null,
        robustness: null,
        stability: null,
        careerReadiness: snapshot?.careerReadiness ?? null,
        message: 'No completed career analysis found. Run a Career Intelligence Analysis first.',
      };
    }

    const dec = analysis.careerDecision;
    return {
      career: dec.career,
      suitabilityScore: dec.suitabilityScore,
      stressAdjustedScore: dec.stressAdjustedScore,
      robustness: dec.stressTestRobustness,
      stability: dec.stabilityScore,
      riskScore: dec.riskScore,
      overallConfidence: dec.overallConfidence,
      careerReadiness: snapshot?.careerReadiness ?? null,
      dataMode: dec.dataMode,
      scoreDisclaimer: dec.scoreDisclaimer,
    };
  }

  /**
   * Detect if career recommendation changed between last 2 snapshots.
   * Does NOT auto-change the user's target career.
   */
  async detectRecommendationChange(userId) {
    const snapshots = await prisma.progressSnapshot.findMany({
      where: { userId },
      orderBy: { snapshotDate: 'desc' },
      take: 2,
    });

    if (snapshots.length < 2) {
      return {
        recommendation_changed: false,
        reason: 'Insufficient history — take progress snapshots over time to detect changes.',
        notice: 'Use POST /api/progress/snapshot to capture a snapshot.',
      };
    }

    const [after, before] = snapshots;
    const changed_metrics = [];

    if (before.topCareer !== after.topCareer && before.topCareer && after.topCareer) {
      changed_metrics.push({
        metric: 'topCareer',
        before: before.topCareer,
        after: after.topCareer,
      });
    }

    if (before.suitabilityScore !== null && after.suitabilityScore !== null) {
      const diff = (after.suitabilityScore ?? 0) - (before.suitabilityScore ?? 0);
      if (Math.abs(diff) >= 5) {
        changed_metrics.push({
          metric: 'suitabilityScore',
          before: before.suitabilityScore,
          after: after.suitabilityScore,
          delta: Math.round(diff * 10) / 10,
        });
      }
    }

    const careerReadinessDiff = (after.careerReadiness ?? 0) - (before.careerReadiness ?? 0);
    if (Math.abs(careerReadinessDiff) >= 5) {
      changed_metrics.push({
        metric: 'careerReadiness',
        before: before.careerReadiness,
        after: after.careerReadiness,
        delta: Math.round(careerReadinessDiff * 10) / 10,
      });
    }

    const recommendation_changed = changed_metrics.length > 0;

    return {
      recommendation_changed,
      before: {
        topCareer: before.topCareer,
        suitabilityScore: before.suitabilityScore,
        stressAdjustedScore: before.stressAdjustedScore,
        robustnessScore: before.robustnessScore,
        careerReadiness: before.careerReadiness,
        snapshotDate: before.snapshotDate,
      },
      after: {
        topCareer: after.topCareer,
        suitabilityScore: after.suitabilityScore,
        stressAdjustedScore: after.stressAdjustedScore,
        robustnessScore: after.robustnessScore,
        careerReadiness: after.careerReadiness,
        snapshotDate: after.snapshotDate,
      },
      changed_metrics,
      reason: recommendation_changed
        ? 'Career metrics changed significantly between snapshots.'
        : 'No significant change detected between snapshots.',
      notice:
        'Your target career has NOT been changed automatically. ' +
        'Run a new Career Intelligence Analysis to update your full recommendation.',
    };
  }
}

module.exports = new RecommendationService();

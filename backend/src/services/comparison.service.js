'use strict';

const prisma = require('../config/database');

class ComparisonService {
  /**
   * Deterministic Robustness-Aware Comparison
   */
  static async compareCareers(userId, analysisId, careers) {
    if (!careers || careers.length < 2 || careers.length > 5) {
      throw new Error('Must compare between 2 and 5 careers');
    }

    const analysis = await prisma.analysis.findUnique({
      where: { id: analysisId },
      include: {
        careerDecision: true,
        stressTest: {
          include: { scenarios: true }
        },
        skillGaps: true
      }
    });

    if (!analysis || analysis.userId !== userId) {
      console.log("ComparisonService error: analysis=", analysis, "userId=", userId);
      throw new Error('Analysis not found or unauthorized');
    }

    const dec = analysis.careerDecision;
    if (!dec) {
      throw new Error('No career decision found for this analysis');
    }

    const results = [];
    const gapsMap = {};
    if (analysis.skillGaps) {
      analysis.skillGaps.forEach(g => {
        if (!gapsMap[g.career]) gapsMap[g.career] = 0;
        gapsMap[g.career] += g.gapSize;
      });
    }

    // The careers to compare must exist in the top alternativeCareers
    const ranking = typeof dec.alternativeCareers === 'string' ? JSON.parse(dec.alternativeCareers || '[]') : (dec.alternativeCareers || []);
    
    for (const career of careers) {
      const rankData = ranking.find(r => r.career === career);
      if (!rankData) continue;
      
      const suitability = rankData.score || 0;
      const stressAdjusted = rankData.stress_adjusted_score || suitability;
      const risk = rankData.risk_score || 0;
      // if robustness is global, we use global, if per-career we use it. We'll use global for simplicity if not per-career
      const robustness = analysis.stressTest?.robustnessScore || 0;
      
      // Composite = (Suitability * 0.4) + (StressAdjusted * 0.4) + (Robustness * 0.2) - (Risk * 0.2)
      const composite = (suitability * 0.4) + (stressAdjusted * 0.4) + (robustness * 0.2) - (risk * 0.2);

      results.push({
        career,
        suitability,
        stressAdjusted,
        risk,
        robustness,
        skillGap: gapsMap[career] || 0,
        compositeScore: composite,
        growthOpportunity: "DATA_UNAVAILABLE", // Demo mode implies insufficient evidence
        stability: robustness
      });
    }

    results.sort((a, b) => b.compositeScore - a.compositeScore);
    const bestOverall = results[0]?.career;
    
    let mostRobust = [...results].sort((a, b) => b.robustness - a.robustness)[0]?.career;
    let lowestRisk = [...results].sort((a, b) => a.risk - b.risk)[0]?.career;
    let fastestReadiness = [...results].sort((a, b) => a.skillGap - b.skillGap)[0]?.career;
    let bestAlternative = results[1]?.career || null;

    return {
      comparison: results,
      recommendations: {
        bestOverall,
        mostRobust,
        lowestRisk,
        fastestReadiness,
        bestAlternative,
        highestGrowth: "Growth ranking unavailable — insufficient market evidence."
      }
    };
  }
}

module.exports = ComparisonService;

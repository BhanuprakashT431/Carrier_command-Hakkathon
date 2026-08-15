'use strict';

const prisma = require('../config/database');

// ============================================================
// Career Readiness Formula — Deterministic, no LLM
//
// ReadinessScore =
//   100 × (
//     0.40 × skill_coverage       [clamp(1 - avg_normalized_gap, 0, 1)]
//   + 0.20 × learning_progress    [clamp(completed / total, 0, 1)]
//   + 0.20 × project_evidence     [clamp(projects / max(3, required), 0, 1)]
//   + 0.10 × cert_evidence        [clamp(certs / max(1, 1), 0, 1)]
//   + 0.10 × experience_factor    [clamp(experience_years / max(1, 2), 0, 1)]
//   )
//
// Label: "System-generated career readiness score — not scientific probability."
// ============================================================

function clamp(val, min, max) {
  return Math.max(min, Math.min(max, val));
}

/**
 * Calculate career readiness deterministically from real DB data.
 * Returns: { careerReadiness, skillCoverage, learningProgress, projectEvidence, certEvidence, experienceFactor }
 */
async function calculateCareerReadiness(userId) {
  const profile = await prisma.profile.findUnique({
    where: { userId },
    include: {
      userSkills: true,
      projects: true,
      certifications: true,
      experiences: true,
    },
  });

  // 1. skill_coverage — from latest analysis skill gaps
  let skillCoverage = 0.5; // default if no analysis
  const latestAnalysis = await prisma.analysis.findFirst({
    where: { userId, status: 'COMPLETED' },
    orderBy: { completedAt: 'desc' },
    include: { skillGaps: true },
  });

  if (latestAnalysis && latestAnalysis.skillGaps.length > 0) {
    const avgNormalizedGap =
      latestAnalysis.skillGaps.reduce((sum, g) => sum + g.gapSize / 100, 0) /
      latestAnalysis.skillGaps.length;
    skillCoverage = clamp(1 - avgNormalizedGap, 0, 1);
  } else if (profile?.userSkills?.length > 0) {
    // Fallback: no analysis yet — estimate from skill confidence
    const avgConf =
      profile.userSkills.reduce((s, sk) => s + sk.confidence, 0) /
      profile.userSkills.length;
    skillCoverage = clamp(avgConf / 100, 0, 1);
  }

  // 2. learning_progress — milestones
  const [completedMilestones, totalMilestones] = await Promise.all([
    prisma.learningMilestone.count({ where: { userId, status: 'COMPLETED' } }),
    prisma.learningMilestone.count({ where: { userId } }),
  ]);
  const learningProgress = totalMilestones > 0
    ? clamp(completedMilestones / totalMilestones, 0, 1)
    : 0;

  // 3. project_evidence — projects with github or deployment URL = "evidenced"
  const projectCount = profile?.projects?.filter(
    (p) => p.githubUrl || p.deploymentUrl
  ).length ?? 0;
  const projectEvidence = clamp(projectCount / Math.max(3, 3), 0, 1);

  // 4. cert_evidence — certifications
  const certCount = profile?.certifications?.length ?? 0;
  const certEvidence = clamp(certCount / Math.max(1, 1), 0, 1);

  // 5. experience_factor — total experience in years
  const now = new Date();
  let totalMonths = 0;
  for (const exp of (profile?.experiences ?? [])) {
    const end = exp.isCurrent ? now : (exp.endDate ? new Date(exp.endDate) : now);
    const start = new Date(exp.startDate);
    const months = (end.getFullYear() - start.getFullYear()) * 12 +
      (end.getMonth() - start.getMonth());
    totalMonths += Math.max(0, months);
  }
  const experienceYears = totalMonths / 12;
  const experienceFactor = clamp(experienceYears / Math.max(1, 2), 0, 1);

  // Final weighted score — all components already clamped to [0,1]
  const rawScore =
    0.40 * skillCoverage +
    0.20 * learningProgress +
    0.20 * projectEvidence +
    0.10 * certEvidence +
    0.10 * experienceFactor;

  const careerReadiness = clamp(Math.round(rawScore * 100 * 10) / 10, 0, 100);

  return {
    careerReadiness,
    skillCoverage,
    learningProgress,
    projectEvidence,
    certEvidence,
    experienceFactor,
    disclaimer: 'System-generated career readiness score — not scientific probability.',
  };
}

class ProgressService {
  /**
   * Get all Progress records for a user.
   */
  async getProgress(userId) {
    return prisma.progress.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
    });
  }

  /**
   * Get all user skills with comparison to previous snapshot.
   */
  async getSkillProgress(userId) {
    const profile = await prisma.profile.findUnique({ where: { userId } });
    if (!profile) return [];

    const skills = await prisma.userSkill.findMany({
      where: { profileId: profile.id },
      orderBy: { updatedAt: 'desc' },
    });

    // Get the latest progress snapshot to compare against
    const latestSnapshot = await prisma.progressSnapshot.findFirst({
      where: { userId },
      orderBy: { snapshotDate: 'desc' },
    });

    const snapshotSkills = latestSnapshot?.skills ?? [];

    return skills.map((skill) => {
      const prev = snapshotSkills.find((s) => s.name === skill.skillName);
      return {
        ...skill,
        previousLevel: prev?.level ?? null,
        delta: prev ? skill.confidence - prev.level : null,
      };
    });
  }

  /**
   * Calculate career readiness from real data and return all formula components.
   */
  async getCareerReadiness(userId) {
    return calculateCareerReadiness(userId);
  }

  /**
   * Take a point-in-time progress snapshot.
   */
  async takeSnapshot(userId) {
    const readinessData = await calculateCareerReadiness(userId);

    const profile = await prisma.profile.findUnique({
      where: { userId },
      include: { userSkills: true },
    });

    const latestAnalysis = await prisma.analysis.findFirst({
      where: { userId, status: 'COMPLETED' },
      orderBy: { completedAt: 'desc' },
      include: { careerDecision: true },
    });

    const skills = (profile?.userSkills ?? []).map((s) => ({
      name: s.skillName,
      level: s.confidence,
      proficiency: s.proficiency,
    }));

    return prisma.progressSnapshot.create({
      data: {
        userId,
        skills,
        careerReadiness: readinessData.careerReadiness,
        skillCoverage: readinessData.skillCoverage,
        learningProgress: readinessData.learningProgress,
        projectEvidence: readinessData.projectEvidence,
        certEvidence: readinessData.certEvidence,
        experienceFactor: readinessData.experienceFactor,
        topCareer: latestAnalysis?.careerDecision?.career ?? null,
        suitabilityScore: latestAnalysis?.careerDecision?.suitabilityScore ?? null,
        stressAdjustedScore: latestAnalysis?.careerDecision?.stressAdjustedScore ?? null,
        robustnessScore: latestAnalysis?.careerDecision?.stressTestRobustness ?? null,
        rankingSnapshot: latestAnalysis?.careerDecision?.alternativeCareers ?? [],
      },
    });
  }

  /**
   * Detect if career recommendation changed between last 2 snapshots.
   */
  async detectRecommendationChange(userId) {
    const snapshots = await prisma.progressSnapshot.findMany({
      where: { userId },
      orderBy: { snapshotDate: 'desc' },
      take: 2,
    });

    if (snapshots.length < 2) {
      return { recommendation_changed: false, reason: 'Insufficient history — take more snapshots over time.' };
    }

    const [after, before] = snapshots;
    const changed_metrics = [];

    if (before.topCareer !== after.topCareer) {
      changed_metrics.push({
        metric: 'topCareer',
        before: before.topCareer,
        after: after.topCareer,
      });
    }
    if (before.suitabilityScore !== null && after.suitabilityScore !== null) {
      const diff = Math.abs((after.suitabilityScore ?? 0) - (before.suitabilityScore ?? 0));
      if (diff >= 5) {
        changed_metrics.push({
          metric: 'suitabilityScore',
          before: before.suitabilityScore,
          after: after.suitabilityScore,
          delta: after.suitabilityScore - before.suitabilityScore,
        });
      }
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
        : 'No significant change detected.',
      notice: 'Your target career has NOT been changed automatically. Run a new analysis to update your full recommendation.',
    };
  }

  /**
   * Update skill progress via controlled, validated API.
   * ALLOWED sources: SELF_REPORTED, ASSESSMENT, PROJECT, CERTIFICATION, ADMIN_VERIFIED
   * Does NOT automatically take snapshot — user triggers that separately.
   */
  async updateSkillProgress(userId, skillId, { proficiency, reason, source, evidence, confidence }) {
    // Validate proficiency range
    if (proficiency === undefined || proficiency === null) throw new Error('proficiency is required');
    const profNum = Number(proficiency);
    if (isNaN(profNum) || profNum < 0 || profNum > 100) {
      throw new Error('Invalid proficiency: must be 0–100');
    }

    // Validate confidence range
    if (confidence === undefined || confidence === null) throw new Error('confidence is required');
    const confNum = Number(confidence);
    if (isNaN(confNum) || confNum < 0 || confNum > 1) {
      throw new Error('Invalid confidence: must be 0–1');
    }

    // Validate source
    const validSources = ['SELF_REPORTED', 'ASSESSMENT', 'PROJECT', 'CERTIFICATION', 'ADMIN_VERIFIED'];
    if (!source || !validSources.includes(source)) {
      throw new Error(`Invalid source: must be one of ${validSources.join(', ')}`);
    }

    // Validate skill ownership
    const profile = await prisma.profile.findUnique({ where: { userId } });
    if (!profile) throw new Error('Profile not found');

    const userSkill = await prisma.userSkill.findUnique({ where: { id: skillId } });
    if (!userSkill) throw new Error('Skill not found');
    if (userSkill.profileId !== profile.id) throw new Error('Unauthorized: skill belongs to another user');

    // Update skill — confidence stored as 0-100 in DB
    const updated = await prisma.userSkill.update({
      where: { id: skillId },
      data: {
        confidence: Math.round(confNum * 100),
        isVerified: source !== 'SELF_REPORTED',
        verifiedBy: source !== 'SELF_REPORTED' ? source : undefined,
      },
    });

    // Audit log
    await prisma.auditLog.create({
      data: {
        userId,
        action: 'UPDATE_SKILL_PROGRESS',
        resource: 'skill',
        details: { skillId, proficiency: profNum, reason, source, evidenceUrl: evidence },
        status: 'SUCCESS',
      },
    });

    return { skill: updated, message: 'Skill progress updated.' };
  }
}

module.exports = new ProgressService();

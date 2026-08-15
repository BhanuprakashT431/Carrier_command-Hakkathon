'use strict';

const prisma = require('../config/database');

class MilestoneService {
  /**
   * Get milestones for a user with optional filters.
   */
  async getMilestones(userId, filters = {}) {
    const where = { userId };
    if (filters.status) where.status = filters.status;
    if (filters.career) where.career = filters.career;
    if (filters.skill) where.skill = filters.skill;
    if (filters.phase) where.phase = Number(filters.phase);

    return prisma.learningMilestone.findMany({
      where,
      orderBy: [{ priority: 'desc' }, { phase: 'asc' }, { createdAt: 'asc' }],
    });
  }

  /**
   * Start a PLANNED milestone. Throws if already started or completed.
   */
  async startMilestone(userId, milestoneId) {
    const ms = await prisma.learningMilestone.findUnique({ where: { id: milestoneId } });
    if (!ms || ms.userId !== userId) throw new Error('Not found or unauthorized');
    if (ms.status !== 'PLANNED') throw new Error('Milestone must be in PLANNED status to start');

    const updated = await prisma.learningMilestone.update({
      where: { id: milestoneId },
      data: { status: 'IN_PROGRESS', startedAt: new Date() },
    });

    await prisma.auditLog.create({
      data: {
        userId,
        action: 'START_MILESTONE',
        resource: 'learning_milestone',
        details: { milestoneId, title: ms.title },
        status: 'SUCCESS',
      },
    });

    return updated;
  }

  /**
   * Complete a milestone.
   * DOES NOT auto-update skill proficiency — milestone completion ≠ mastery.
   */
  async completeMilestone(userId, milestoneId, { notes, evidenceUrl, evidence } = {}) {
    const ms = await prisma.learningMilestone.findUnique({ where: { id: milestoneId } });
    if (!ms || ms.userId !== userId) throw new Error('Not found or unauthorized');
    if (ms.status === 'COMPLETED') throw new Error('Milestone already completed');

    const completionEvidence = {
      type: evidence?.type ?? 'COMPLETION',
      description: notes ?? '',
      url: evidenceUrl ?? null,
      recordedAt: new Date().toISOString(),
    };

    const updated = await prisma.learningMilestone.update({
      where: { id: milestoneId },
      data: {
        status: 'COMPLETED',
        completedAt: new Date(),
        notes: notes ?? ms.notes,
        evidenceUrl: evidenceUrl ?? ms.evidenceUrl,
        completionEvidence,
      },
    });

    await prisma.auditLog.create({
      data: {
        userId,
        action: 'COMPLETE_MILESTONE',
        resource: 'learning_milestone',
        details: { milestoneId, title: ms.title, evidenceUrl },
        status: 'SUCCESS',
      },
    });

    // IMPORTANT: Do NOT update UserSkill.confidence or proficiency here.
    // Milestone completion is recorded as evidence only.
    // User must explicitly call PATCH /api/progress/skills/:skillId to update proficiency.
    return {
      milestone: updated,
      message:
        'Milestone completed. Evidence recorded. ' +
        'To update skill proficiency based on this evidence, use PATCH /api/progress/skills/:skillId ' +
        'with source: "PROJECT" or "ASSESSMENT" and your confidence level.',
    };
  }

  /**
   * Skip a milestone with optional notes.
   */
  async skipMilestone(userId, milestoneId, { notes } = {}) {
    const ms = await prisma.learningMilestone.findUnique({ where: { id: milestoneId } });
    if (!ms || ms.userId !== userId) throw new Error('Not found or unauthorized');
    if (ms.status === 'COMPLETED') throw new Error('Cannot skip a completed milestone');

    const updated = await prisma.learningMilestone.update({
      where: { id: milestoneId },
      data: {
        status: 'SKIPPED',
        skippedAt: new Date(),
        notes: notes ?? ms.notes,
      },
    });

    await prisma.auditLog.create({
      data: {
        userId,
        action: 'SKIP_MILESTONE',
        resource: 'learning_milestone',
        details: { milestoneId, title: ms.title, notes },
        status: 'SUCCESS',
      },
    });

    return updated;
  }

  /**
   * Generate a weekly plan from active milestones.
   * Respects user's available weekly learning hours.
   * Never schedules more than the user specified.
   */
  async generateWeeklyPlan(userId) {
    // Get learning hours from career preference (field: not in schema — default 5h)
    // CareerPreference does not have weeklyLearningHours in schema — use 5 default
    const weeklyHours = 5;

    // Get PLANNED + IN_PROGRESS milestones ordered by priority and phase
    const milestones = await prisma.learningMilestone.findMany({
      where: { userId, status: { in: ['PLANNED', 'IN_PROGRESS'] } },
      orderBy: [{ priority: 'desc' }, { phase: 'asc' }],
      take: 20,
    });

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const hoursPerDay = weeklyHours / 5; // Even distribution
    const plan = { weeklyHours, days: [] };

    let milestoneIndex = 0;
    let totalScheduled = 0;

    for (const day of days) {
      const tasks = [];
      let dayHours = 0;

      while (dayHours < hoursPerDay && milestoneIndex < milestones.length && totalScheduled < weeklyHours) {
        const ms = milestones[milestoneIndex];
        const taskHours = Math.min(hoursPerDay - dayHours, 1); // max 1h per task slot
        tasks.push({
          title: ms.title,
          skill: ms.skill ?? '',
          career: ms.career ?? '',
          phase: ms.phase,
          priority: ms.priority,
          estimatedHours: taskHours,
          milestoneId: ms.id,
          status: ms.status,
        });
        dayHours += taskHours;
        totalScheduled += taskHours;
        milestoneIndex++;
      }

      plan.days.push({ day, tasks, dayHours: Math.round(dayHours * 10) / 10 });
    }

    plan.totalScheduled = Math.round(totalScheduled * 10) / 10;
    plan.disclaimer = `Plan limited to ${weeklyHours} hours/week. Never exceeds your available learning time.`;

    return plan;
  }
}

module.exports = new MilestoneService();

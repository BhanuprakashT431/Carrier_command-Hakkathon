'use strict';

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function demoReset() {
  // 1. Safety Checks
  if (process.env.DEMO_MODE !== 'true') {
    console.error('Error: DEMO_MODE must be true');
    process.exit(1);
  }

  if (process.env.NODE_ENV === 'production') {
    console.error('Error: Cannot run demo reset in production environment');
    process.exit(1);
  }

  const dbUrl = process.env.DATABASE_URL || '';
  if (!dbUrl.includes('test') && !dbUrl.includes('demo')) {
    console.error('Error: DATABASE_URL must contain "test" or "demo"');
    process.exit(1);
  }

  if (process.env.DEMO_RESET_CONFIRM !== 'true') {
    console.error('Error: DEMO_RESET_CONFIRM must be true');
    process.exit(1);
  }

  console.log('Safety checks passed. Wiping database...');

  try {
    // 2. Wipe Database (Order matters due to foreign keys)
    await prisma.$transaction([
      prisma.evidence.deleteMany(),
      prisma.stressScenario.deleteMany(),
      prisma.stressTest.deleteMany(),
      prisma.learningPlan.deleteMany(),
      prisma.riskAssessment.deleteMany(),
      prisma.skillGap.deleteMany(),
      prisma.careerDecision.deleteMany(),
      prisma.agentRun.deleteMany(),
      prisma.auditLog.deleteMany(),
      prisma.analysis.deleteMany(),
      prisma.careerGoal.deleteMany(),
      prisma.certification.deleteMany(),
      prisma.project.deleteMany(),
      prisma.userSkill.deleteMany(),
      prisma.experience.deleteMany(),
      prisma.education.deleteMany(),
      prisma.careerPreference.deleteMany(),
      prisma.profile.deleteMany(),
      prisma.refreshToken.deleteMany(),
      prisma.user.deleteMany(),
    ]);

    console.log('Database wiped successfully.');

    // 3. Seed Demo User (Phase6 User)
    const email = 'demo@example.com';
    const passwordHash = await bcrypt.hash('demo123', 12);

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        role: 'USER',
        isActive: true,
        profile: {
          create: {
            firstName: 'Demo',
            lastName: 'User',
            bio: 'A demo user for Phase 6.',
          }
        }
      }
    });

    console.log(`Demo user created with email: ${email}`);
    process.exit(0);
  } catch (error) {
    console.error('Error during demo reset:', error);
    process.exit(1);
  }
}

demoReset();

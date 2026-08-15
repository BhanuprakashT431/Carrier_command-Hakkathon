'use strict';

/**
 * Robust mock data for Demo Mode when PostgreSQL is not available.
 * These objects match the Prisma schema to allow the application to function without a DB.
 */

const DEMO_USER_ID = 'demo-user-123';
const DEMO_PROFILE_ID = 'demo-profile-123';
const DEMO_ANALYSIS_ID = 'demo-analysis-123';

const mockUser = {
  id: DEMO_USER_ID,
  email: 'demo@careercommand.ai',
  // bcrypt hash for 'demo123'
  passwordHash: '$2a$12$Rc9VJqugQhW3pbClVZK7Hezo6O3S7LndVlsfcy86rODt1T33mPAM.',
  role: 'USER',
  isActive: true,
  deletedAt: null,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockProfile = {
  id: DEMO_PROFILE_ID,
  userId: DEMO_USER_ID,
  firstName: 'Demo',
  lastName: 'User',
  bio: 'Software Engineer exploring new career opportunities in AI.',
  phone: '+1 555-0199',
  linkedinUrl: 'https://linkedin.com/in/demouser',
  githubUrl: 'https://github.com/demouser',
  portfolioUrl: null,
  resumeUrl: null,
  resumeText: 'Demo Resume Text',
  resumeFileName: 'demo_resume.pdf',
  location: 'San Francisco, CA',
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockAnalysis = {
  id: DEMO_ANALYSIS_ID,
  userId: DEMO_USER_ID,
  status: 'COMPLETED',
  dataMode: 'DEMO',
  currentPhase: 'Complete',
  currentAgent: null,
  progress: 100,
  error: null,
  createdAt: new Date(),
  updatedAt: new Date(),
  completedAt: new Date(),
};

const mockCareerDecision = {
  id: 'demo-decision-123',
  analysisId: DEMO_ANALYSIS_ID,
  career: 'AI Engineer',
  suitabilityScore: 88.5,
  stressAdjustedScore: 82.0,
  riskScore: 15.0,
  stressTestRobustness: 90.0,
  stabilityScore: 85.0,
  overallConfidence: 0.92,
  unsupportedClaimRate: 0.05,
  evidenceCoverage: 0.88,
  agentAgreementRate: 0.95,
  dataMode: 'DEMO',
  scoreDisclaimer: 'Demo Data',
  strengths: ['Python', 'Machine Learning', 'Problem Solving'],
  skillGaps: ['Deep Learning', 'MLOps'],
  risks: ['Fast changing technology landscape'],
  evidence: [],
  alternativeCareers: ['Data Scientist', 'Backend Engineer'],
  stressTestResults: [],
  agentDisagreements: [],
  assumptions: [],
  uncertainties: [],
  finalReasoning: 'Strong foundation in software engineering makes transitioning to AI Engineering highly viable.',
  nextActions: ['Take Deep Learning Specialization', 'Build an end-to-end MLOps pipeline'],
  createdAt: new Date(),
};

const mockSkillGaps = [
  {
    id: 'gap-1',
    analysisId: DEMO_ANALYSIS_ID,
    career: 'AI Engineer',
    skillName: 'MLOps',
    currentLevel: 2,
    requiredLevel: 4,
    gapSize: 2,
    priority: 'HIGH',
    difficulty: 'HARD',
    dependency: null,
    dataMode: 'DEMO',
    createdAt: new Date(),
  },
];

const mockProgress = [
  {
    id: 'prog-1',
    userId: DEMO_USER_ID,
    type: 'COURSE',
    itemId: 'course-1',
    itemName: 'Deep Learning Specialization',
    status: 'IN_PROGRESS',
    completedAt: null,
    notes: 'On course 3 of 5.',
    createdAt: new Date(),
    updatedAt: new Date(),
  }
];

const mockCopilotConversation = {
  id: 'demo-conv-1',
  userId: DEMO_USER_ID,
  title: 'Transition to AI Engineering',
  dataMode: 'DEMO',
  createdAt: new Date(),
  updatedAt: new Date(),
  messages: [
    {
      id: 'msg-1',
      conversationId: 'demo-conv-1',
      role: 'assistant',
      content: 'Hello! I see you are exploring a transition to AI Engineering. How can I help you today?',
      createdAt: new Date(),
    }
  ]
};

/**
 * The core handler for the Prisma Proxy.
 * Intercepts method calls and returns the appropriate mock data.
 */
function handleMockQuery(model, method, args) {
  const where = args[0]?.where || {};

  // FindUnique / FindFirst
  if (method === 'findUnique' || method === 'findFirst') {
    if (model === 'user') {
      if (where.email === mockUser.email || where.id === DEMO_USER_ID) return mockUser;
      return null; // Simulate user not found
    }
    if (model === 'profile') return mockProfile;
    if (model === 'analysis') return mockAnalysis;
    if (model === 'careerDecision') return mockCareerDecision;
    if (model === 'refreshToken') {
      return { token: where.token, userId: DEMO_USER_ID, user: mockUser, expiresAt: new Date(Date.now() + 86400000), isRevoked: false };
    }
    return null;
  }

  // FindMany
  if (method === 'findMany') {
    if (model === 'skillGap') return mockSkillGaps;
    if (model === 'progress') return mockProgress;
    if (model === 'copilotConversation') return [mockCopilotConversation];
    if (model === 'copilotMessage') return mockCopilotConversation.messages;
    if (model === 'analysis') return [mockAnalysis];
    return [];
  }

  // Create / Update
  if (method === 'create' || method === 'update' || method === 'upsert') {
    if (model === 'user') return mockUser;
    if (model === 'profile') return mockProfile;
    if (model === 'analysis') return mockAnalysis;
    if (model === 'progress') return mockProgress[0];
    if (model === 'copilotConversation') return mockCopilotConversation;
    if (model === 'copilotMessage') return mockCopilotConversation.messages[0];
    return {};
  }

  // Delete / DeleteMany / UpdateMany
  if (method === 'delete' || method === 'deleteMany' || method === 'updateMany') {
    return { count: 1 };
  }

  // Count
  if (method === 'count') {
    return 1;
  }

  return null;
}

module.exports = { handleMockQuery, DEMO_USER_ID };

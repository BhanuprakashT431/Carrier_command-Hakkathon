const prisma = require('../config/database');

const tools = {
  get_profile: {
    name: 'get_profile',
    description: 'Get user profile basics',
    inputSchema: {},
    permission: 'user',
    auditAction: 'COPILOT_GET_PROFILE',
    ownershipRequired: true
  },
  get_current_analysis: {
    name: 'get_current_analysis',
    description: 'Get latest career analysis',
    inputSchema: {},
    permission: 'user',
    auditAction: 'COPILOT_GET_ANALYSIS',
    ownershipRequired: true
  },
  get_skill_gaps: {
    name: 'get_skill_gaps',
    description: 'Get user skill gaps',
    inputSchema: {},
    permission: 'user',
    auditAction: 'COPILOT_GET_SKILL_GAPS',
    ownershipRequired: true
  },
  get_learning_plan: {
    name: 'get_learning_plan',
    description: 'Get active learning plan',
    inputSchema: {},
    permission: 'user',
    auditAction: 'COPILOT_GET_LEARNING_PLAN',
    ownershipRequired: true
  },
  get_stress_tests: {
    name: 'get_stress_tests',
    description: 'Get recent stress test results',
    inputSchema: {},
    permission: 'user',
    auditAction: 'COPILOT_GET_STRESS_TESTS',
    ownershipRequired: true
  },
  get_evidence: {
    name: 'get_evidence',
    description: 'Get user evidence (projects, certs)',
    inputSchema: {},
    permission: 'user',
    auditAction: 'COPILOT_GET_EVIDENCE',
    ownershipRequired: true
  },
  get_comparison: {
    name: 'get_comparison',
    description: 'Get career comparison',
    inputSchema: {},
    permission: 'user',
    auditAction: 'COPILOT_GET_COMPARISON',
    ownershipRequired: true
  },
  run_simulation: {
    name: 'run_simulation',
    description: 'Run career simulation',
    inputSchema: { scenario: 'string' },
    permission: 'user',
    auditAction: 'COPILOT_RUN_SIMULATION',
    ownershipRequired: true
  },
  get_progress: {
    name: 'get_progress',
    description: 'Get career readiness progress',
    inputSchema: {},
    permission: 'user',
    auditAction: 'COPILOT_GET_PROGRESS',
    ownershipRequired: true
  },
  get_projects: {
    name: 'get_projects',
    description: 'Get user projects',
    inputSchema: {},
    permission: 'user',
    auditAction: 'COPILOT_GET_PROJECTS',
    ownershipRequired: true
  },
  get_certifications: {
    name: 'get_certifications',
    description: 'Get user certifications',
    inputSchema: {},
    permission: 'user',
    auditAction: 'COPILOT_GET_CERTIFICATIONS',
    ownershipRequired: true
  }
};

async function executeTool(userId, toolName, args) {
  const tool = tools[toolName];
  if (!tool) throw new Error(`Tool ${toolName} not found`);

  try {
    await prisma.auditLog.create({
      data: {
        userId,
        action: tool.auditAction,
        resource: 'copilot',
        details: { toolName, args },
        status: 'SUCCESS',
      },
    });
  } catch (e) {
    // Audit log failure should not break tool execution
    console.warn('AuditLog create failed:', e.message);
  }

  return { success: true, message: `Executed ${toolName} successfully`, toolName };
}

module.exports = { tools, executeTool };

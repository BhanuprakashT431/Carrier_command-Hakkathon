const { prisma } = require('../config/database');

const INTENT_PATTERNS = {
  CAREER_QUESTION: ['why', 'recommend', 'score', 'suitability', 'robust', 'stress', 'career', 'rank'],
  SKILL_QUESTION: ['skill', 'learn', 'improve', 'gap', 'proficiency'],
  LEARNING_QUESTION: ['study', 'week', 'today', 'milestone', 'project', 'roadmap', 'plan'],
  SIMULATION_QUESTION: ['what if', 'improve', 'would', 'simulate', 'scenario'],
  PROGRESS_QUESTION: ['progress', 'how much', 'am i closer', 'changed', 'readiness'],
  EVIDENCE_QUESTION: ['why do you', 'evidence', 'source', 'believe', 'support', 'prove']
};

function detectIntent(userMessage) {
  const msg = userMessage.toLowerCase();
  for (const [intent, keywords] of Object.entries(INTENT_PATTERNS)) {
    if (keywords.some(kw => msg.includes(kw))) {
      switch(intent) {
        case 'CAREER_QUESTION': return { intent, selectedTools: ['get_current_analysis'] };
        case 'SKILL_QUESTION': return { intent, selectedTools: ['get_skill_gaps'] };
        case 'LEARNING_QUESTION': return { intent, selectedTools: ['get_learning_plan'] };
        case 'SIMULATION_QUESTION': return { intent, selectedTools: ['run_simulation'] };
        case 'PROGRESS_QUESTION': return { intent, selectedTools: ['get_progress'] };
        case 'EVIDENCE_QUESTION': return { intent, selectedTools: ['get_evidence'] };
      }
    }
  }
  return { intent: 'GENERAL_QUESTION', selectedTools: ['get_profile'] };
}

async function buildContext(userId) {
  return { userId, info: "context summary mock" };
}

function sanitizeInput(input) {
  let cleaned = input.replace(/<\||\[INST\]|\[SYS\]|###|```system|ignore previous|forget instructions/gi, '');
  return cleaned.substring(0, 2000);
}

module.exports = { detectIntent, buildContext, sanitizeInput };

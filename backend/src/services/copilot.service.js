const prisma = require('../config/database');
const { detectIntent, buildContext, sanitizeInput } = require('./copilot.engine');
const { executeTool } = require('./copilot.tools');
const axios = require('axios');

class CopilotService {
  async sendMessage(userId, conversationId, userMessage) {
    const sanitized = sanitizeInput(userMessage);
    
    if (!conversationId) {
      const conv = await prisma.copilotConversation.create({
        data: { userId, title: 'New Conversation' }
      });
      conversationId = conv.id;
    } else {
      const conv = await prisma.copilotConversation.findUnique({ where: { id: conversationId } });
      if (!conv || conv.userId !== userId) throw new Error('Conversation not found or unauthorized');
    }

    const context = await buildContext(userId);
    const { intent, selectedTools } = detectIntent(sanitized);
    
    const tools_results = {};
    for (const tool of selectedTools) {
      tools_results[tool] = await executeTool(userId, tool, {});
    }

    await prisma.copilotMessage.create({
      data: {
        conversationId,
        role: 'user',
        content: sanitized
      }
    });

    const recentMessages = await prisma.copilotMessage.findMany({
      where: { conversationId },
      orderBy: { createdAt: 'desc' },
      take: 10
    });
    
    // Build fallback context-based answer if Python is offline
    let aiAnswer = 'I am your Career Copilot. Your career intelligence data is loaded. Ask me about your career recommendation, skill gaps, learning plan, or progress.';
    let aiIntent = intent;
    let aiDataUsed = Object.keys(tools_results);
    let aiConfidence = 0.6;
    let aiDataMode = 'DEMO';
    let aiLimitations = ['Python AI service unavailable — using structured fallback response.'];
    let aiRecommendations = [];
    let aiActions = [];
    let aiEvidence = [];

    try {
      if (process.env.AGENTS_SERVICE_URL) {
        const res = await axios.post(
          `${process.env.AGENTS_SERVICE_URL}/api/copilot/message`,
          {
            user_id: userId,
            message: sanitized,
            intent,
            context,
            tools_results,
            conversation_history: recentMessages.reverse().map((m) => ({
              role: m.role,
              content: m.content,
            })),
          },
          { timeout: 10000 }
        );
        const data = res.data;
        aiAnswer = data.answer ?? aiAnswer;
        aiIntent = data.intent ?? intent;
        aiDataUsed = data.data_used ?? aiDataUsed;
        aiConfidence = data.confidence ?? aiConfidence;
        aiDataMode = data.data_mode ?? aiDataMode;
        aiLimitations = data.limitations ?? [];
        aiRecommendations = data.recommendations ?? [];
        aiActions = data.actions ?? [];
        aiEvidence = data.evidence ?? [];
      }
    } catch (e) {
      console.warn('Python agent unavailable, using structured fallback.');
    }

    const aiMsg = await prisma.copilotMessage.create({
      data: {
        conversationId,
        role: 'assistant',
        content: aiAnswer,
        intent: aiIntent,
        toolsUsed: JSON.stringify(Object.keys(tools_results)),
        dataUsed: JSON.stringify(aiDataUsed),
        recommendations: JSON.stringify(aiRecommendations),
        actions: JSON.stringify(aiActions),
        evidence: JSON.stringify(aiEvidence),
        confidence: aiConfidence,
        dataMode: aiDataMode.toUpperCase() === 'MIXED' ? 'DEMO' : 'DEMO',
        limitations: JSON.stringify(aiLimitations),
      },
    });

    await prisma.auditLog.create({
      data: {
        userId,
        action: 'COPILOT_MESSAGE',
        resource: 'copilot',
        details: JSON.stringify({ conversationId, intent: aiIntent }),
        status: 'SUCCESS',
      },
    });

    return {
      conversationId,
      messageId: aiMsg.id,
      answer: aiAnswer,
      intent: aiIntent,
      data_used: aiDataUsed,
      recommendations: aiRecommendations,
      actions: aiActions,
      evidence: aiEvidence,
      confidence: aiConfidence,
      dataMode: aiDataMode.toUpperCase() === 'LIVE' ? 'LIVE' : 'DEMO',
      limitations: aiLimitations,
    };
  }

  async getConversations(userId) {
    return prisma.copilotConversation.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
      include: {
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      }
    });
  }

  async getConversation(userId, conversationId) {
    const conv = await prisma.copilotConversation.findUnique({
      where: { id: conversationId },
      include: { messages: { orderBy: { createdAt: 'asc' } } }
    });
    if (!conv || conv.userId !== userId) throw new Error('Not found');
    return conv;
  }

  async deleteConversation(userId, conversationId) {
    const conv = await prisma.copilotConversation.findUnique({ where: { id: conversationId } });
    if (!conv || conv.userId !== userId) throw new Error('Not found');
    await prisma.copilotConversation.delete({ where: { id: conversationId } });
    return true;
  }
}

module.exports = new CopilotService();

import { create } from 'zustand';
import { copilotApi } from '../services/copilot.api';

const useCopilotStore = create((set, get) => ({
  conversations: [],
  activeConversationId: null,
  messages: [],
  loading: false,
  error: null,
  suggestedQuestions: {
    Career: [
      "Why was this career path recommended for me?",
      "Which career is the most robust against AI automation?",
      "How did the adversarial stress-test change my recommendation?",
      "What are the top 3 high-impact skills I need right now?"
    ],
    Learning: [
      "What should be my learning focus for the next 30 days?",
      "Which skill should I prioritize to close my largest gap?",
      "What portfolio project would prove my competency best?",
      "Can you break down my 6-month roadmap into weekly milestones?"
    ],
    Simulation: [
      "What if I improve my core technical skill level to 85%?",
      "What happens if market demand drops by 30%?",
      "Would learning MLOps boost my AI Engineer suitability score?",
      "How does reducing learning time to 5 hrs/week impact my timeline?"
    ],
    Progress: [
      "How much overall progress have I achieved so far?",
      "Am I on track to meet my target role benchmarks?",
      "Which verified evidence supports my career readiness?",
      "What should be my immediate next milestone this week?"
    ]
  },

  loadConversations: async () => {
    set({ loading: true, error: null });
    try {
      const { data } = await copilotApi.getConversations();
      set({ conversations: data || [], loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  selectConversation: async (id) => {
    set({ activeConversationId: id, loading: true, error: null });
    try {
      if (id) {
        const { data } = await copilotApi.getConversation(id);
        set({ messages: data.messages, loading: false });
      } else {
        set({ messages: [], loading: false });
      }
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  deleteConversation: async (id) => {
    try {
      await copilotApi.deleteConversation(id);
      const { conversations, activeConversationId } = get();
      set({ conversations: conversations.filter(c => c.id !== id) });
      if (activeConversationId === id) {
        set({ activeConversationId: null, messages: [] });
      }
    } catch (error) {
      set({ error: error.message });
    }
  },

  sendMessage: async (message) => {
    const { activeConversationId, messages } = get();
    const newUserMsg = { role: 'user', content: message, timestamp: new Date().toISOString() };
    set({ messages: [...messages, newUserMsg], loading: true, error: null });

    try {
      const { data } = await copilotApi.sendMessage(message, activeConversationId);
      const newAssistantMsg = {
        role: 'assistant',
        content: data.answer || "No response received",
        timestamp: new Date().toISOString(),
        dataMode: data.data_mode
      };
      set({ 
        messages: [...messages, newUserMsg, newAssistantMsg],
        activeConversationId: data.conversationId,
        loading: false 
      });
      get().loadConversations(); // refresh list
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  clearError: () => set({ error: null })
}));

export default useCopilotStore;

import { create } from 'zustand';
import { copilotApi } from '../services/copilot.api';

const useCopilotStore = create((set, get) => ({
  conversations: [],
  activeConversationId: null,
  messages: [],
  loading: false,
  error: null,
  suggestedQuestions: {
    Career: ["Why was this career recommended?", "Which career is most robust for me?", "How did stress testing change my recommendation?"],
    Learning: ["What should I study today?", "Which skill should I learn next?", "What project should I build next?"],
    Simulation: ["What if I improve Python to 80?", "What happens if I reduce learning time?", "Would MLOps improve my AI Engineer score?"],
    Progress: ["How much progress have I made?", "Am I closer to my target career?", "What should I focus on next?"]
  },

  loadConversations: async () => {
    set({ loading: true, error: null });
    try {
      const { data } = await copilotApi.getConversations();
      set({ conversations: data.conversations, loading: false });
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

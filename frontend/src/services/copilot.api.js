import api from './api';

export const copilotApi = {
  sendMessage: (message, conversationId) =>
    api.post('/copilot/message', { message, conversationId }),
  getConversations: () => api.get('/copilot/conversations'),
  getConversation: (id) => api.get(`/copilot/conversations/${id}`),
  deleteConversation: (id) => api.delete(`/copilot/conversations/${id}`),
};

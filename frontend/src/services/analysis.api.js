import api from './api.js';

export const analysisApi = {
  runAnalysis: (dataMode) => api.post('/analysis/run', { dataMode }),
  getAnalysisStatus: (id) => api.get(`/analysis/${id}/status`),
  getStressTest: (id) => api.get(`/analysis/${id}/stress-test`),
  getEvidence: (id) => api.get(`/analysis/${id}/evidence`),
  getLearningRoadmap: (id) => api.get(`/analysis/${id}/learning-roadmap`),
  getLatestAnalysis: () => api.get('/analysis/latest'),
  getDecision: (id) => api.get(`/analysis/${id}/decision`),
};

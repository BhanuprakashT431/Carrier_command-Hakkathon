import api from './api';

export const progressApi = {
  getProgress: () => api.get('/progress'),
  getSkillProgress: () => api.get('/progress/skills'),
  getCareerReadiness: () => api.get('/progress/career-readiness'),
  updateSkillProgress: (skillId, data) => api.patch(`/progress/skills/${skillId}`, data),
  getMilestones: (params) => api.get('/learning-plan/milestones', { params }),
  startMilestone: (id) => api.post(`/learning-plan/milestones/${id}/start`),
  completeMilestone: (id, data) => api.post(`/learning-plan/milestones/${id}/complete`, data),
  skipMilestone: (id, data) => api.post(`/learning-plan/milestones/${id}/skip`, data),
  getWeeklyPlan: () => api.get('/learning-plan/weekly-plan'),
  getCurrentRecommendation: () => api.get('/recommendations/current'),
  getRecommendationChanges: () => api.get('/recommendations/changes'),
};

import api from './api.js';

export const comparisonApi = {
  /**
   * Run a new career comparison
   * @param {Object} payload 
   * @param {Array<string>} payload.targetRoles - List of roles to compare
   */
  runComparison: (payload) => api.post('/comparisons', payload),

  /**
   * Get past comparisons
   */
  getComparisons: () => api.get('/comparisons'),

  /**
   * Get a specific comparison by ID
   */
  getComparisonById: (id) => api.get(`/comparisons/${id}`)
};

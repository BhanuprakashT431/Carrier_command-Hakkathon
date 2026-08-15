import api from './api.js';

export const simulatorApi = {
  /**
   * Run a new simulation
   * @param {Object} payload 
   * @param {string} payload.scenarioType - The type of scenario (e.g., 'Skill Improvement', 'Market Shift')
   * @param {Object} payload.parameters - Scenario specific parameters
   */
  runSimulation: (payload) => api.post('/simulations', payload),

  /**
   * Get all simulation history for the current user
   */
  getSimulations: () => api.get('/simulations'),

  /**
   * Get a specific simulation by ID
   */
  getSimulationById: (id) => api.get(`/simulations/${id}`)
};

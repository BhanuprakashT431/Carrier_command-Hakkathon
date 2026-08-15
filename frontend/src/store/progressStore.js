import { create } from 'zustand';
import { progressApi } from '../services/progress.api';

const useProgressStore = create((set) => ({
  careerReadiness: null,
  skillProgress: [],
  milestones: [],
  weeklyPlan: null,
  recommendation: null,
  changes: null,
  loading: false,

  loadReadiness: async () => {
    set({ loading: true });
    try {
      const { data } = await progressApi.getCareerReadiness();
      set({ careerReadiness: data, loading: false });
    } catch (error) {
      set({ loading: false });
    }
  },

  loadSkillProgress: async () => {
    set({ loading: true });
    try {
      const { data } = await progressApi.getSkillProgress();
      set({ skillProgress: data || [], loading: false });
    } catch (error) {
      set({ loading: false });
    }
  },

  loadMilestones: async () => {
    set({ loading: true });
    try {
      const { data } = await progressApi.getMilestones();
      set({ milestones: data.milestones, loading: false });
    } catch (error) {
      set({ loading: false });
    }
  },

  completeMilestone: async (id, payload) => {
    try {
      await progressApi.completeMilestone(id, payload);
      const { data } = await progressApi.getMilestones();
      set({ milestones: data.milestones });
    } catch (error) {
      console.error(error);
    }
  },

  loadWeeklyPlan: async () => {
    set({ loading: true });
    try {
      const { data } = await progressApi.getWeeklyPlan();
      set({ weeklyPlan: data, loading: false });
    } catch (error) {
      set({ loading: false });
    }
  },

  loadRecommendation: async () => {
    try {
      const current = await progressApi.getCurrentRecommendation();
      const changes = await progressApi.getRecommendationChanges();
      set({ recommendation: current.data, changes: changes.data });
    } catch (error) {
      console.error(error);
    }
  }
}));

export default useProgressStore;

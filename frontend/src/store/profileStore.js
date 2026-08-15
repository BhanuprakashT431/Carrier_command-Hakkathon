import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { profileApi } from '../services/profile.api.js'

const useProfileStore = create(
  persist(
    (set, get) => ({
      profile: null,
      loading: false,
      error: null,
      
      // Onboarding state
      onboardingStep: 1,

      setOnboardingStep: (step) => set({ onboardingStep: step }),

      fetchProfile: async () => {
        set({ loading: true, error: null })
        try {
          const response = await profileApi.getProfile()
          set({ profile: response.data, loading: false })
          return response.data
        } catch (error) {
          set({ error: error.response?.data?.message || 'Failed to fetch profile', loading: false })
          throw error
        }
      },

      updateProfile: async (updates) => {
        set({ loading: true, error: null })
        try {
          const response = await profileApi.updateProfile(updates)
          set((state) => ({ 
            profile: { ...state.profile, ...response.data },
            loading: false 
          }))
          return response.data
        } catch (error) {
          set({ error: error.response?.data?.message || 'Failed to update profile', loading: false })
          throw error
        }
      },
      
      // Calculate profile completeness
      getCompleteness: () => {
        const { profile } = get()
        if (!profile) return 0
        
        let score = 0
        const weights = {
          education: 15,
          skills: 20,
          projects: 20,
          certifications: 15,
          preferences: 15,
          goals: 15,
        }

        if (profile.education && profile.education.length > 0) score += weights.education
        if (profile.skills && profile.skills.length > 0) score += weights.skills
        if (profile.projects && profile.projects.length > 0) score += weights.projects
        if (profile.certifications && profile.certifications.length > 0) score += weights.certifications
        if (profile.preferences && Object.keys(profile.preferences).length > 0) score += weights.preferences
        if (profile.goals && Object.keys(profile.goals).length > 0) score += weights.goals

        return score
      },
    }),
    {
      name: 'profile-storage',
      // We only want to persist the onboarding step, or maybe the profile to avoid reload flashing
      partialize: (state) => ({ onboardingStep: state.onboardingStep, profile: state.profile }),
    }
  )
)

export default useProfileStore

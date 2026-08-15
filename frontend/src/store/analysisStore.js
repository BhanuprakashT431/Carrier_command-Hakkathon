import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { analysisApi } from '../services/analysis.api.js'

const useAnalysisStore = create(
  persist(
    (set, get) => ({
      analysisId: null,
      status: 'IDLE', // IDLE, PENDING, PROFILE_RUNNING, PARALLEL_AGENTS_RUNNING, COMPLETED, FAILED
      dataMode: 'LIVE',
      results: null,
      error: null,
      agentStatuses: {},
      stressTest: null,
      evidence: null,
      learningRoadmap: null,
      decision: null,

      setDataMode: (mode) => set({ dataMode: mode }),

      currentAnalysis: () => ({
        analysisId: get().analysisId,
        status: get().status,
        results: get().results,
        decision: get().decision,
        learningRoadmap: get().learningRoadmap,
        stressTest: get().stressTest,
        evidence: get().evidence,
        agentStatuses: get().agentStatuses,
      }),

      fetchLatestAnalysis: async () => {
        try {
          const res = await analysisApi.getLatestAnalysis();
          if (res.data) {
            const analysisId = res.data.id;
            set({ analysisId, status: res.data.status, dataMode: res.data.dataMode });
            
            // If it's completed, fetch full sub-states
            if (res.data.status === 'COMPLETED') {
              get().fetchSubStates(analysisId);
            } else if (res.data.status === 'PENDING' || res.data.status === 'RUNNING') {
              // start polling
              get().pollStatus(analysisId);
            }
          }
        } catch (err) {
          console.error("Failed to fetch latest analysis", err);
        }
      },

      runAnalysis: async (dataMode = 'LIVE') => {
        try {
          set({ status: 'PENDING', error: null, dataMode, results: null, agentStatuses: {} })
          const response = await analysisApi.runAnalysis(dataMode)
          const analysisId = response.data.analysisId
          set({ analysisId })
          
          // Start polling
          get().pollStatus(analysisId)
          return response.data
        } catch (error) {
          set({ 
            status: 'FAILED', 
            error: error.response?.data?.message || error.message || 'Failed to start analysis' 
          })
          throw error
        }
      },

      pollStatus: async (analysisId) => {
        const poll = async () => {
          try {
            const response = await analysisApi.getAnalysisStatus(analysisId)
            const data = response.data
            
            set({ 
              status: data.status,
              agentStatuses: data.agentStatuses || {},
              error: data.error || null,
              results: data.results || null
            })
            
            if (data.status === 'COMPLETED') {
              // Fetch phase 4 sub-states
              get().fetchSubStates(analysisId);
              return;
            } else if (data.status === 'FAILED') {
              return;
            } else {
              // Poll again after 2 seconds
              setTimeout(poll, 2000)
            }
          } catch (error) {
            set({ 
              status: 'FAILED', 
              error: error.response?.data?.message || 'Error polling analysis status' 
            })
          }
        }
        
        poll()
      },

      fetchSubStates: async (analysisId) => {
        try {
          const [stress, ev, roadmap, dec] = await Promise.all([
            analysisApi.getStressTest(analysisId),
            analysisApi.getEvidence(analysisId),
            analysisApi.getLearningRoadmap(analysisId),
            analysisApi.getDecision(analysisId),
          ]);
          set({
            stressTest: stress.data,
            evidence: ev.data,
            learningRoadmap: roadmap.data,
            decision: dec.data,
          });
        } catch (err) {
          console.error("Failed to fetch sub-states", err);
        }
      },

      clearAnalysis: () => set({ 
        analysisId: null, 
        status: 'IDLE', 
        results: null, 
        error: null, 
        agentStatuses: {},
        stressTest: null,
        evidence: null,
        learningRoadmap: null,
        decision: null,
      })
    }),
    {
      name: 'analysis-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ 
        analysisId: state.analysisId, 
        status: state.status, 
        dataMode: state.dataMode, 
        results: state.results, 
        agentStatuses: state.agentStatuses,
        stressTest: state.stressTest,
        evidence: state.evidence,
        learningRoadmap: state.learningRoadmap,
        decision: state.decision,
      }), // Persist these fields
    }
  )
)

export default useAnalysisStore

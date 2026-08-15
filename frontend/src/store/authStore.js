import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

/**
 * Auth Zustand Store
 * Persists accessToken in localStorage so sessions survive page refresh.
 * user and isAuthenticated are derived from the persisted token.
 */
const useAuthStore = create(
  persist(
    (set) => ({
      // ── State ───────────────────────────────────────────────────────────────
      user:            null,
      accessToken:     null,
      isAuthenticated: false,
      isLoading:       false,

      // ── Actions ─────────────────────────────────────────────────────────────

      /**
       * Called after successful login or register.
       * @param {Object} user  - { id, email, firstName, lastName, ... }
       * @param {string} token - JWT access token
       */
      setUser: (user, token) =>
        set({
          user,
          accessToken:     token,
          isAuthenticated: true,
          isLoading:       false,
        }),

      /**
       * Clears all auth state (on logout or 401 refresh failure).
       */
      clearAuth: () =>
        set({
          user:            null,
          accessToken:     null,
          isAuthenticated: false,
          isLoading:       false,
        }),

      /**
       * Toggle loading state during async auth operations.
       * @param {boolean} bool
       */
      setLoading: (bool) => set({ isLoading: bool }),
    }),
    {
      name:    'ccc-auth',               // localStorage key
      storage: createJSONStorage(() => localStorage),
      // Only persist the token; user is re-fetched on app load if needed
      partialize: (state) => ({
        accessToken:     state.accessToken,
        user:            state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
)

export default useAuthStore

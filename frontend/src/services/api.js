import axios from 'axios'
import useAuthStore from '../store/authStore.js'

// ── Axios Instance ────────────────────────────────────────────────────────────
const api = axios.create({
  baseURL:         import.meta.env.VITE_API_URL || '/api',
  withCredentials: true, // send cookies (refresh token httpOnly cookie)
  headers: {
    'Content-Type': 'application/json',
  },
})

// ── Request Interceptor ───────────────────────────────────────────────────────
// Attach the Bearer token from the store to every outgoing request.
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().accessToken
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

// ── Response Interceptor ──────────────────────────────────────────────────────
// On 401, attempt a silent token refresh. Retry the original request once.
// If refresh fails, clear auth and redirect to login.

let isRefreshing  = false
let refreshQueue  = [] // pending requests waiting for new token

const processQueue = (error, token = null) => {
  refreshQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })
  refreshQueue = []
}

api.interceptors.response.use(
  (response) => {
    // Centralize API response extraction
    if (response.data && response.data.success !== undefined && response.data.data !== undefined) {
      response.data = response.data.data
    }
    return response
  },
  async (error) => {
    const originalRequest = error.config

    // Only handle 401s that haven't already been retried
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      // Don't try to refresh if the failing request IS the refresh endpoint, login, or register
      !originalRequest.url?.includes('/auth/refresh') &&
      !originalRequest.url?.includes('/auth/login') &&
      !originalRequest.url?.includes('/auth/register')
    ) {
      if (isRefreshing) {
        // Queue this request until the refresh completes
        return new Promise((resolve, reject) => {
          refreshQueue.push({ resolve, reject })
        })
          .then((token) => {
            originalRequest.headers['Authorization'] = `Bearer ${token}`
            return api(originalRequest)
          })
          .catch((err) => Promise.reject(err))
      }

      originalRequest._retry = true
      isRefreshing            = true

      try {
        const { data } = await api.post('/auth/refresh')
        const newToken  = data.accessToken

        // Update the store with the new token (keep existing user)
        useAuthStore.getState().setUser(
          useAuthStore.getState().user,
          newToken,
        )

        // Flush the queue
        processQueue(null, newToken)

        // Retry original request
        originalRequest.headers['Authorization'] = `Bearer ${newToken}`
        return api(originalRequest)
      } catch (refreshError) {
        processQueue(refreshError, null)

        // Refresh failed → clear auth + redirect
        useAuthStore.getState().clearAuth()
        window.location.href = '/auth/login'
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  },
)

// ── Auth API Helpers ──────────────────────────────────────────────────────────
export const authApi = {
  /**
   * Register a new user.
   */
  register: (email, password, firstName, lastName) =>
    api.post('/auth/register', { email, password, firstName, lastName }),

  /**
   * Log in with email + password.
   */
  login: (email, password) =>
    api.post('/auth/login', { email, password }),

  /**
   * Log out (invalidates refresh token on server).
   */
  logout: () =>
    api.post('/auth/logout'),

  /**
   * Silently refresh the access token using the httpOnly refresh-token cookie.
   */
  refresh: () =>
    api.post('/auth/refresh'),

  /**
   * Fetch the currently authenticated user's profile.
   */
  getMe: () =>
    api.get('/auth/me'),
}

export default api

import { Navigate, useLocation } from 'react-router-dom'
import useAuthStore               from '../../store/authStore.js'
import Navbar from '../layout/Navbar.jsx'
import Breadcrumbs from '../layout/Breadcrumbs.jsx'

/**
 * ProtectedRoute
 *
 * Wraps a route that requires authentication.
 * If the user is not authenticated, redirects to /auth/login,
 * preserving the originally requested URL in location state
 * so Login can redirect back after success.
 *
 * Usage:
 *   <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
 */
const ProtectedRoute = ({ children, hideNavigation = false }) => {
  const { isAuthenticated } = useAuthStore()
  const location = useLocation()

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/auth/login"
        state={{ from: location }}
        replace
      />
    )
  }

  // Handle onboarding which might not want full navigation
  if (hideNavigation || location.pathname.startsWith('/onboarding')) {
    return children
  }

  return (
    <div className="flex flex-col min-h-[100dvh]">
      <Navbar />
      <Breadcrumbs />
      <main className="flex-1 flex flex-col relative overflow-x-hidden">
        {children}
      </main>
    </div>
  )
}

export default ProtectedRoute

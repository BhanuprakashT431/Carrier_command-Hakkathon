import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import useAuthStore         from '../../store/authStore.js'
import { authApi }          from '../../services/api.js'
import Button               from '../../components/ui/Button.jsx'
import Input                from '../../components/ui/Input.jsx'
import Navbar               from '../../components/layout/Navbar.jsx'
import AnimatedBackground   from '../Landing/components/AnimatedBackground.jsx'

const LoginPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { setUser, setLoading, isLoading } = useAuthStore()

  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  useEffect(() => {
    if (location.state?.message) {
      setSuccessMsg(location.state.message)
      // Clear state to avoid showing it again on refresh
      navigate(location.pathname, { replace: true, state: {} })
    }
  }, [location, navigate])

  // ── Field change handler ─────────────────────────────────────────────────
  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (error) setError('') // clear error on new input
    if (successMsg) setSuccessMsg('') // clear success on input
  }

  // ── Submit ───────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!form.email || !form.password) {
      setError('Please fill in all fields.')
      return
    }

    setLoading(true)
    setError('')
    setSuccessMsg('')

    try {
      const response = await authApi.login(form.email, form.password)
      const { user, accessToken } = response.data
      setUser(user, accessToken)
      navigate('/dashboard', { replace: true })
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.error   ||
        'Your session has expired or login failed. Please sign in again.'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-surface-50 flex flex-col font-sans text-surface-900 dark:text-white transition-colors duration-300">
      <Navbar />

      <main className="flex-1 flex items-center justify-center p-6 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 z-0">
          <AnimatedBackground />
        </div>

        <div className="w-full max-w-md relative z-10">
          {/* Card */}
          <div className="rounded-2xl bg-white dark:bg-surface-900/80 backdrop-blur-xl border border-surface-200 dark:border-surface-800 p-8 shadow-card dark:shadow-[0_8px_30px_rgb(0,0,0,0.5)] transition-all duration-300">
            {/* Header */}
            <div className="mb-8 text-center">
              <div
                className="inline-flex items-center justify-center w-14 h-14 rounded-2xl
                           bg-primary-50 text-primary-600 text-3xl mb-4 shadow-sm"
                aria-hidden="true"
              >
                🤖
              </div>
              <h1 className="text-2xl font-bold text-surface-900">Welcome back</h1>
              <p className="text-sm text-surface-500 mt-1">
                Sign in to your Career Command Center
              </p>
            </div>

            {/* Success alert */}
            {successMsg && (
              <div
                role="alert"
                className="mb-5 flex items-start gap-2.5 rounded-xl
                           bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800
                           px-4 py-3 text-sm text-emerald-600 dark:text-emerald-400 animate-fade-in"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-4 h-4 shrink-0 mt-0.5"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                    clipRule="evenodd"
                  />
                </svg>
                {successMsg}
              </div>
            )}

            {/* Error alert */}
            {error && (
              <div
                role="alert"
                className="mb-5 flex items-start gap-2.5 rounded-xl
                           bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800
                           px-4 py-3 text-sm text-red-600 dark:text-red-400 animate-fade-in"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-4 h-4 shrink-0 mt-0.5"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z"
                    clipRule="evenodd"
                  />
                </svg>
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              <Input
                label="Email address"
                type="email"
                name="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                autoComplete="email"
                required
              />

              <div>
                <Input
                  label="Password"
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                  required
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                size="md"
                loading={isLoading}
                fullWidth
                className="mt-4 h-12"
              >
                Sign In
              </Button>
            </form>

            {/* Divider */}
            <div className="my-6 flex items-center gap-3">
              <div className="flex-1 h-px bg-surface-200" />
              <span className="text-xs text-surface-400">or</span>
              <div className="flex-1 h-px bg-surface-200" />
            </div>

            {/* Register link */}
            <p className="text-center text-sm text-surface-500">
              Don&apos;t have an account?{' '}
              <Link
                to="/auth/register"
                className="font-semibold text-primary-600 hover:text-primary-700 transition-colors"
              >
                Create one free
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}

export default LoginPage

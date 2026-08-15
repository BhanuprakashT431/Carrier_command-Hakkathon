import { useState }        from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useAuthStore         from '../../store/authStore.js'
import { authApi }          from '../../services/api.js'
import Button               from '../../components/ui/Button.jsx'
import Input                from '../../components/ui/Input.jsx'
import Navbar               from '../../components/layout/Navbar.jsx'
import AnimatedBackground   from '../Landing/components/AnimatedBackground.jsx'

// ── Password strength rules ──────────────────────────────────────────────────
const STRENGTH_RULES = [
  { id: 'length',    label: 'At least 8 characters', test: (p) => p.length >= 8 },
  { id: 'uppercase', label: 'One uppercase letter',  test: (p) => /[A-Z]/.test(p) },
  { id: 'lowercase', label: 'One lowercase letter',  test: (p) => /[a-z]/.test(p) },
  { id: 'number',    label: 'One number',            test: (p) => /\d/.test(p) },
]

const getStrengthColor = (score) => {
  if (score === 0) return 'bg-surface-200'
  if (score === 1) return 'bg-red-500'
  if (score === 2) return 'bg-amber-500'
  if (score === 3) return 'bg-yellow-400'
  return 'bg-emerald-500'
}

const getStrengthLabel = (score) => {
  if (score === 0) return ''
  if (score === 1) return 'Weak'
  if (score === 2) return 'Fair'
  if (score === 3) return 'Good'
  return 'Strong'
}

// ── PasswordStrengthIndicator ────────────────────────────────────────────────
const PasswordStrengthIndicator = ({ password }) => {
  const results = STRENGTH_RULES.map((rule) => ({
    ...rule,
    passed: rule.test(password),
  }))
  const score = results.filter((r) => r.passed).length

  return (
    <div className="mt-2 space-y-2">
      {/* Meter bars */}
      <div className="flex gap-1" aria-label={`Password strength: ${getStrengthLabel(score)}`}>
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
              i < score ? getStrengthColor(score) : 'bg-surface-200'
            }`}
          />
        ))}
      </div>

      {/* Strength label */}
      {password && (
        <p className={`text-xs font-medium ${
          score <= 1 ? 'text-red-500' :
          score === 2 ? 'text-amber-500' :
          score === 3 ? 'text-yellow-600' :
          'text-emerald-500'
        }`}>
          {getStrengthLabel(score)}
        </p>
      )}

      {/* Rules checklist */}
      <ul className="space-y-1">
        {results.map((rule) => (
          <li
            key={rule.id}
            className={`flex items-center gap-2 text-xs transition-colors duration-200 ${
              rule.passed ? 'text-emerald-600' : 'text-surface-500'
            }`}
          >
            <span aria-hidden="true">{rule.passed ? '✓' : '○'}</span>
            {rule.label}
          </li>
        ))}
      </ul>
    </div>
  )
}

// ── Register Page ─────────────────────────────────────────────────────────────
const RegisterPage = () => {
  const navigate = useNavigate()
  const { setUser, setLoading, isLoading } = useAuthStore()

  const [form, setForm] = useState({
    firstName:       '',
    lastName:        '',
    email:           '',
    password:        '',
    confirmPassword: '',
  })
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')

  // ── Field change ───────────────────────────────────────────────────────────
  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    // Clear that specific field error
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
    if (serverError) setServerError('')
  }

  // ── Client validation ──────────────────────────────────────────────────────
  const validate = () => {
    const newErrors = {}

    if (!form.firstName.trim()) newErrors.firstName = 'First name is required.'
    if (!form.lastName.trim())  newErrors.lastName  = 'Last name is required.'

    if (!form.email) {
      newErrors.email = 'Email is required.'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'Please enter a valid email address.'
    }

    const strengthScore = STRENGTH_RULES.filter((r) => r.test(form.password)).length
    if (!form.password) {
      newErrors.password = 'Password is required.'
    } else if (strengthScore < 4) {
      newErrors.password = 'Password must meet all strength requirements.'
    }

    if (!form.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password.'
    } else if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.'
    }

    return newErrors
  }

  // ── Submit ─────────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault()

    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setLoading(true)
    setServerError('')

    try {
      const response = await authApi.register(
        form.email,
        form.password,
        form.firstName,
        form.lastName,
      )
      // Do not auto-login. Redirect to login page so they can sign in.
      // setUser(user, accessToken)
      navigate('/auth/login', { 
        state: { message: 'Account created successfully. Please sign in.' },
        replace: true 
      })
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.error   ||
        'Registration failed. Please try again.'
      setServerError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-surface-50 flex flex-col font-sans text-surface-900 dark:text-white transition-colors duration-300">
      <Navbar />

      <main className="flex-1 flex w-full relative z-10 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 z-0">
          <AnimatedBackground />
        </div>

        <div className="w-full flex relative z-10">
          {/* Left Side: Brand Panel */}
          <div className="hidden lg:flex lg:w-1/2 bg-white/60 dark:bg-surface-900/60 backdrop-blur-md flex-col justify-center px-12 border-r border-surface-200 dark:border-surface-800 transition-colors">
            <div className="max-w-md mx-auto">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary-50 dark:bg-primary-900/30 text-3xl mb-8 shadow-sm">
                🚀
              </div>
              <h1 className="text-4xl font-extrabold text-surface-900 dark:text-white mb-6 tracking-tight">
                Build Your Career Intelligence Profile
              </h1>
              <p className="text-lg text-surface-500 dark:text-surface-400 mb-10 leading-relaxed">
                Create your account and start building a personalized, evidence-aware career strategy.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">✓</div>
                  <p className="text-surface-700 dark:text-surface-300 font-medium">Personalized career analysis</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">✓</div>
                  <p className="text-surface-700 dark:text-surface-300 font-medium">Adversarial stress testing</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">✓</div>
                  <p className="text-surface-700 dark:text-surface-300 font-medium">Adaptive learning roadmap</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Form */}
          <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-transparent">
            <div className="w-full max-w-md bg-white/90 dark:bg-surface-900/90 backdrop-blur-xl rounded-2xl border border-surface-200 dark:border-surface-800 p-8 shadow-card dark:shadow-[0_8px_30px_rgb(0,0,0,0.5)] animate-slide-up transition-colors">
              {/* Header (visible more prominently on mobile) */}
              <div className="mb-7 text-center">
                <h2 className="text-2xl font-bold text-surface-900 dark:text-white">Create your account</h2>
                <p className="text-sm text-surface-500 dark:text-surface-400 mt-1">
                  Start building your career strategy.
                </p>
              </div>

              {/* Server error alert */}
              {serverError && (
                <div
                  role="alert"
                  className="mb-5 flex items-start gap-2.5 rounded-xl
                             bg-red-50 border border-red-200
                             px-4 py-3 text-sm text-red-600 animate-fade-in"
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
                  {serverError}
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} noValidate className="space-y-4">
                {/* Name row */}
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    label="First Name"
                    name="firstName"
                    placeholder="Jane"
                    value={form.firstName}
                    onChange={handleChange}
                    error={errors.firstName}
                    autoComplete="given-name"
                    required
                  />
                  <Input
                    label="Last Name"
                    name="lastName"
                    placeholder="Doe"
                    value={form.lastName}
                    onChange={handleChange}
                    error={errors.lastName}
                    autoComplete="family-name"
                    required
                  />
                </div>

                <Input
                  label="Email address"
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange}
                  error={errors.email}
                  autoComplete="email"
                  required
                />

                <div>
                  <Input
                    label="Password"
                    type="password"
                    name="password"
                    placeholder="Create a strong password"
                    value={form.password}
                    onChange={handleChange}
                    error={errors.password}
                    autoComplete="new-password"
                    required
                  />
                  {/* Password strength indicator */}
                  {form.password && (
                    <PasswordStrengthIndicator password={form.password} />
                  )}
                </div>

                <Input
                  label="Confirm Password"
                  type="password"
                  name="confirmPassword"
                  placeholder="Repeat your password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  error={errors.confirmPassword}
                  autoComplete="new-password"
                  required
                />

                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  loading={isLoading}
                  fullWidth
                  className="mt-2 h-12"
                >
                  Create Account
                </Button>
              </form>

              {/* Divider */}
              <div className="my-6 flex items-center gap-3">
                <div className="flex-1 h-px bg-surface-200" />
                <span className="text-xs text-surface-400">or</span>
                <div className="flex-1 h-px bg-surface-200" />
              </div>

              {/* Login link */}
              <p className="text-center text-sm text-surface-500">
                Already have an account?{' '}
                <Link
                  to="/auth/login"
                  className="font-semibold text-primary-600 hover:text-primary-700 transition-colors"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default RegisterPage

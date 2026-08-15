import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useProfileStore from '../../store/profileStore'

export default function GoalsStep() {
  const { profile, updateProfile, setOnboardingStep } = useProfileStore()
  const navigate = useNavigate()
  const [goals, setGoals] = useState({ shortTerm: '', longTerm: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (profile?.goals) {
      setGoals((prev) => ({ ...prev, ...profile.goals }))
    }
    setOnboardingStep(6)
  }, [profile, setOnboardingStep])

  const handleChange = (field, value) => {
    setGoals((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    try {
      setLoading(true)
      setError(null)
      await updateProfile({ goals })
      navigate('/dashboard')
    } catch (err) {
      setError(err.message || 'Failed to save goals')
    } finally {
      setLoading(false)
    }
  }

  const handlePrev = () => navigate('/onboarding/preferences')

  return (
    <div>
      <h3 className="text-xl font-bold mb-6 text-surface-900">Career Goals</h3>
      {error && <div className="mb-4 text-red-600 text-sm bg-red-50 border border-red-200 p-3 rounded-lg">{error}</div>}
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-surface-700">Short Term Goals (Next 1-2 years)</label>
          <textarea
            rows={4}
            value={goals.shortTerm}
            onChange={(e) => handleChange('shortTerm', e.target.value)}
            className="mt-1 block w-full bg-white border border-surface-200 rounded-lg shadow-sm py-2 px-3 text-surface-900 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            placeholder="e.g. Master React and Next.js, become a team lead..."
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-surface-700">Long Term Goals (3-5+ years)</label>
          <textarea
            rows={4}
            value={goals.longTerm}
            onChange={(e) => handleChange('longTerm', e.target.value)}
            className="mt-1 block w-full bg-white border border-surface-200 rounded-lg shadow-sm py-2 px-3 text-surface-900 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            placeholder="e.g. Become a Software Architect, start my own tech company..."
          />
        </div>
      </div>

      <div className="mt-8 flex justify-between space-x-4">
        <button
          onClick={handlePrev}
          className="inline-flex justify-center py-2.5 px-5 border border-surface-300 shadow-sm text-sm font-medium rounded-lg text-surface-700 bg-white hover:bg-surface-50 focus:outline-none transition-colors"
        >
          Previous
        </button>
        <button
          onClick={handleSave}
          disabled={loading}
          className="inline-flex justify-center py-2.5 px-5 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-status-success hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-status-success focus:ring-offset-white disabled:opacity-50 transition-colors"
        >
          {loading ? 'Saving...' : 'Finish & Go to Dashboard'}
        </button>
      </div>
    </div>
  )
}

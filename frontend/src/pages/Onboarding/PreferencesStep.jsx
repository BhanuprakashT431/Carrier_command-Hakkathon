import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useProfileStore from '../../store/profileStore'

export default function PreferencesStep() {
  const { profile, updateProfile, setOnboardingStep } = useProfileStore()
  const navigate = useNavigate()
  const [preferences, setPreferences] = useState({ jobTitle: '', location: '', remote: false, salary: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (profile?.preferences) {
      setPreferences((prev) => ({ ...prev, ...profile.preferences }))
    }
    setOnboardingStep(5)
  }, [profile, setOnboardingStep])

  const handleChange = (field, value) => {
    setPreferences((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    try {
      setLoading(true)
      setError(null)
      await updateProfile({ preferences })
      navigate('/onboarding/goals')
    } catch (err) {
      setError(err.message || 'Failed to save preferences')
    } finally {
      setLoading(false)
    }
  }

  const handlePrev = () => navigate('/onboarding/certifications')

  return (
    <div>
      <h3 className="text-xl font-bold mb-6 text-surface-900">Job Preferences</h3>
      {error && <div className="mb-4 text-red-600 text-sm bg-red-50 border border-red-200 p-3 rounded-lg">{error}</div>}
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-surface-700">Target Job Title</label>
          <input
            type="text"
            value={preferences.jobTitle}
            onChange={(e) => handleChange('jobTitle', e.target.value)}
            className="mt-1 block w-full bg-white border border-surface-200 rounded-lg shadow-sm py-2 px-3 text-surface-900 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            placeholder="e.g. Senior Frontend Engineer"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-surface-700">Preferred Location</label>
          <input
            type="text"
            value={preferences.location}
            onChange={(e) => handleChange('location', e.target.value)}
            className="mt-1 block w-full bg-white border border-surface-200 rounded-lg shadow-sm py-2 px-3 text-surface-900 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            placeholder="e.g. New York, NY or Remote"
          />
        </div>
        <div className="flex items-center">
          <input
            id="remote"
            type="checkbox"
            checked={preferences.remote}
            onChange={(e) => handleChange('remote', e.target.checked)}
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-surface-300 rounded bg-white"
          />
          <label htmlFor="remote" className="ml-2 block text-sm text-surface-700">
            Open to remote work
          </label>
        </div>
        <div>
          <label className="block text-sm font-medium text-surface-700">Expected Salary (Optional)</label>
          <input
            type="text"
            value={preferences.salary}
            onChange={(e) => handleChange('salary', e.target.value)}
            className="mt-1 block w-full bg-white border border-surface-200 rounded-lg shadow-sm py-2 px-3 text-surface-900 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            placeholder="e.g. $120,000"
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
          className="inline-flex justify-center py-2.5 px-5 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 focus:ring-offset-white disabled:opacity-50 transition-colors"
        >
          {loading ? 'Saving...' : 'Save & Next'}
        </button>
      </div>
    </div>
  )
}

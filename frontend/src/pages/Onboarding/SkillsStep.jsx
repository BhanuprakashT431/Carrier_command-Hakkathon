import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useProfileStore from '../../store/profileStore'

export default function SkillsStep() {
  const { profile, updateProfile, setOnboardingStep } = useProfileStore()
  const navigate = useNavigate()
  const [skillsStr, setSkillsStr] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (profile?.skills?.length > 0) {
      setSkillsStr(profile.skills.join(', '))
    }
    setOnboardingStep(2)
  }, [profile, setOnboardingStep])

  const handleSave = async () => {
    try {
      setLoading(true)
      setError(null)
      const skillsArray = skillsStr.split(',').map(s => s.trim()).filter(s => s !== '')
      await updateProfile({ skills: skillsArray })
      navigate('/onboarding/projects')
    } catch (err) {
      setError(err.message || 'Failed to save skills')
    } finally {
      setLoading(false)
    }
  }

  const handlePrev = () => navigate('/onboarding/education')

  return (
    <div>
      <h3 className="text-xl font-bold mb-6 text-surface-900">Skills</h3>
      <p className="text-sm text-surface-500 mb-4">Enter your skills separated by commas.</p>
      
      {error && <div className="mb-4 text-red-600 text-sm bg-red-50 border border-red-200 p-3 rounded-lg">{error}</div>}
      
      <div>
        <label className="block text-sm font-medium text-surface-700">Skills</label>
        <textarea
          rows={4}
          value={skillsStr}
          onChange={(e) => setSkillsStr(e.target.value)}
          className="mt-1 block w-full bg-white border border-surface-200 rounded-lg shadow-sm py-2 px-3 text-surface-900 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
          placeholder="e.g. JavaScript, React, Node.js, Python"
        />
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

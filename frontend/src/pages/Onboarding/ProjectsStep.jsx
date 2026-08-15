import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useProfileStore from '../../store/profileStore'

export default function ProjectsStep() {
  const { profile, updateProfile, setOnboardingStep } = useProfileStore()
  const navigate = useNavigate()
  const [projects, setProjects] = useState([{ title: '', description: '', url: '' }])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (profile?.projects?.length > 0) {
      setProjects(profile.projects)
    }
    setOnboardingStep(3)
  }, [profile, setOnboardingStep])

  const handleChange = (index, field, value) => {
    const newProj = [...projects]
    newProj[index][field] = value
    setProjects(newProj)
  }

  const handleAdd = () => {
    setProjects([...projects, { title: '', description: '', url: '' }])
  }

  const handleRemove = (index) => {
    const newProj = projects.filter((_, i) => i !== index)
    setProjects(newProj)
  }

  const handleSave = async () => {
    try {
      setLoading(true)
      setError(null)
      const validProj = projects.filter(p => p.title.trim() !== '')
      await updateProfile({ projects: validProj })
      navigate('/onboarding/certifications')
    } catch (err) {
      setError(err.message || 'Failed to save projects')
    } finally {
      setLoading(false)
    }
  }

  const handlePrev = () => navigate('/onboarding/skills')

  return (
    <div>
      <h3 className="text-xl font-bold mb-6 text-surface-900">Projects</h3>
      {error && <div className="mb-4 text-red-600 text-sm bg-red-50 border border-red-200 p-3 rounded-lg">{error}</div>}
      
      {projects.map((proj, index) => (
        <div key={index} className="mb-6 p-5 border border-surface-200 rounded-xl bg-surface-50/50">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-sm font-semibold text-surface-900">Project {index + 1}</h4>
            {projects.length > 1 && (
              <button onClick={() => handleRemove(index)} className="text-red-500 hover:text-red-600 text-sm font-medium transition-colors">
                Remove
              </button>
            )}
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-surface-700">Project Title</label>
              <input
                type="text"
                value={proj.title}
                onChange={(e) => handleChange(index, 'title', e.target.value)}
                className="mt-1 block w-full bg-white border border-surface-200 rounded-lg shadow-sm py-2 px-3 text-surface-900 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-surface-700">Description</label>
              <textarea
                rows={3}
                value={proj.description}
                onChange={(e) => handleChange(index, 'description', e.target.value)}
                className="mt-1 block w-full bg-white border border-surface-200 rounded-lg shadow-sm py-2 px-3 text-surface-900 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-surface-700">Project URL (optional)</label>
              <input
                type="url"
                value={proj.url}
                onChange={(e) => handleChange(index, 'url', e.target.value)}
                className="mt-1 block w-full bg-white border border-surface-200 rounded-lg shadow-sm py-2 px-3 text-surface-900 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                placeholder="https://"
              />
            </div>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={handleAdd}
        className="mt-2 inline-flex items-center px-4 py-2 border border-dashed border-surface-300 rounded-lg shadow-sm text-sm font-medium text-surface-700 bg-white hover:bg-surface-50 focus:outline-none transition-colors"
      >
        + Add Another Project
      </button>

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

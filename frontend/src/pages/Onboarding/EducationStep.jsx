import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useProfileStore from '../../store/profileStore'

export default function EducationStep() {
  const { profile, updateProfile, setOnboardingStep } = useProfileStore()
  const navigate = useNavigate()
  const [education, setEducation] = useState([{ institution: '', degree: '', fieldOfStudy: '', startDate: '', endDate: '' }])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (profile?.education?.length > 0) {
      setEducation(profile.education)
    }
    setOnboardingStep(1)
  }, [profile, setOnboardingStep])

  const handleChange = (index, field, value) => {
    const newEdu = [...education]
    newEdu[index][field] = value
    setEducation(newEdu)
  }

  const handleAdd = () => {
    setEducation([...education, { institution: '', degree: '', fieldOfStudy: '', startDate: '', endDate: '' }])
  }

  const handleRemove = (index) => {
    const newEdu = education.filter((_, i) => i !== index)
    setEducation(newEdu)
  }

  const handleSave = async () => {
    try {
      setLoading(true)
      setError(null)
      // Filter out completely empty rows
      const validEdu = education.filter(e => e.institution.trim() !== '')
      await updateProfile({ education: validEdu })
      navigate('/onboarding/skills')
    } catch (err) {
      setError(err.message || 'Failed to save education')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h3 className="text-xl font-bold mb-6 text-surface-900">Education History</h3>
      {error && <div className="mb-4 text-red-600 text-sm bg-red-50 border border-red-200 p-3 rounded-lg">{error}</div>}
      
      {education.map((edu, index) => (
        <div key={index} className="mb-6 p-5 border border-surface-200 rounded-xl bg-surface-50/50">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-sm font-semibold text-surface-900">Institution {index + 1}</h4>
            {education.length > 1 && (
              <button onClick={() => handleRemove(index)} className="text-red-500 hover:text-red-600 text-sm font-medium transition-colors">
                Remove
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-surface-700">Institution / University</label>
              <input
                type="text"
                value={edu.institution}
                onChange={(e) => handleChange(index, 'institution', e.target.value)}
                className="mt-1 block w-full bg-white border border-surface-200 rounded-lg shadow-sm py-2 px-3 text-surface-900 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-surface-700">Degree</label>
              <input
                type="text"
                value={edu.degree}
                onChange={(e) => handleChange(index, 'degree', e.target.value)}
                className="mt-1 block w-full bg-white border border-surface-200 rounded-lg shadow-sm py-2 px-3 text-surface-900 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                placeholder="e.g. B.S., M.S."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-surface-700">Field of Study</label>
              <input
                type="text"
                value={edu.fieldOfStudy}
                onChange={(e) => handleChange(index, 'fieldOfStudy', e.target.value)}
                className="mt-1 block w-full bg-white border border-surface-200 rounded-lg shadow-sm py-2 px-3 text-surface-900 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-surface-700">Start Date</label>
              <input
                type="month"
                value={edu.startDate}
                onChange={(e) => handleChange(index, 'startDate', e.target.value)}
                className="mt-1 block w-full bg-white border border-surface-200 rounded-lg shadow-sm py-2 px-3 text-surface-900 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-surface-700">End Date</label>
              <input
                type="month"
                value={edu.endDate}
                onChange={(e) => handleChange(index, 'endDate', e.target.value)}
                className="mt-1 block w-full bg-white border border-surface-200 rounded-lg shadow-sm py-2 px-3 text-surface-900 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
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
        + Add Another Institution
      </button>

      <div className="mt-8 flex justify-end space-x-4">
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

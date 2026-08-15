import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useProfileStore from '../../store/profileStore'

export default function CertificationsStep() {
  const { profile, updateProfile, setOnboardingStep } = useProfileStore()
  const navigate = useNavigate()
  const [certifications, setCertifications] = useState([{ name: '', issuer: '', date: '' }])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (profile?.certifications?.length > 0) {
      setCertifications(profile.certifications)
    }
    setOnboardingStep(4)
  }, [profile, setOnboardingStep])

  const handleChange = (index, field, value) => {
    const newCerts = [...certifications]
    newCerts[index][field] = value
    setCertifications(newCerts)
  }

  const handleAdd = () => {
    setCertifications([...certifications, { name: '', issuer: '', date: '' }])
  }

  const handleRemove = (index) => {
    const newCerts = certifications.filter((_, i) => i !== index)
    setCertifications(newCerts)
  }

  const handleSave = async () => {
    try {
      setLoading(true)
      setError(null)
      const validCerts = certifications.filter(c => c.name.trim() !== '')
      await updateProfile({ certifications: validCerts })
      navigate('/onboarding/preferences')
    } catch (err) {
      setError(err.message || 'Failed to save certifications')
    } finally {
      setLoading(false)
    }
  }

  const handlePrev = () => navigate('/onboarding/projects')

  return (
    <div>
      <h3 className="text-xl font-bold mb-6 text-surface-900">Certifications</h3>
      {error && <div className="mb-4 text-red-600 text-sm bg-red-50 border border-red-200 p-3 rounded-lg">{error}</div>}
      
      {certifications.map((cert, index) => (
        <div key={index} className="mb-6 p-5 border border-surface-200 rounded-xl bg-surface-50/50">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-sm font-semibold text-surface-900">Certification {index + 1}</h4>
            {certifications.length > 1 && (
              <button onClick={() => handleRemove(index)} className="text-red-500 hover:text-red-600 text-sm font-medium transition-colors">
                Remove
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-surface-700">Certification Name</label>
              <input
                type="text"
                value={cert.name}
                onChange={(e) => handleChange(index, 'name', e.target.value)}
                className="mt-1 block w-full bg-white border border-surface-200 rounded-lg shadow-sm py-2 px-3 text-surface-900 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-surface-700">Issuer</label>
              <input
                type="text"
                value={cert.issuer}
                onChange={(e) => handleChange(index, 'issuer', e.target.value)}
                className="mt-1 block w-full bg-white border border-surface-200 rounded-lg shadow-sm py-2 px-3 text-surface-900 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-surface-700">Date</label>
              <input
                type="month"
                value={cert.date}
                onChange={(e) => handleChange(index, 'date', e.target.value)}
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
        + Add Another Certification
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

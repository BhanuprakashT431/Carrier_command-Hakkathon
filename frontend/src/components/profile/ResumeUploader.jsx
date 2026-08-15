import { useState, useRef } from 'react'
import { resumeApi } from '../../services/resume.api'
import useProfileStore from '../../store/profileStore'

export default function ResumeUploader() {
  const [dragActive, setDragActive] = useState(false)
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [intelligence, setIntelligence] = useState(null)
  const inputRef = useRef(null)
  const { updateProfile } = useProfileStore()
  
  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0])
    }
  }

  const handleChange = (e) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0])
    }
  }

  const validateAndSetFile = (selectedFile) => {
    setError(null)
    const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
    if (!validTypes.includes(selectedFile.type)) {
      setError('Invalid file type. Please upload a PDF or DOCX.')
      return
    }
    if (selectedFile.size > 10 * 1024 * 1024) {
      setError('File is too large. Max size is 10MB.')
      return
    }
    setFile(selectedFile)
  }

  const onButtonClick = () => {
    inputRef.current.click()
  }

  const handleUpload = async () => {
    if (!file) return
    setLoading(true)
    setError(null)
    try {
      const response = await resumeApi.uploadResume(file)
      setIntelligence(response.data.intelligence || response.data)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to analyze resume.')
    } finally {
      setLoading(false)
    }
  }

  const handleImport = async (dataToImport) => {
    try {
      await updateProfile(dataToImport)
      alert('Profile updated successfully from resume data!')
    } catch (err) {
      alert('Failed to update profile: ' + (err.response?.data?.message || err.message))
    }
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-surface-200">
      <h3 className="text-lg font-bold mb-2 text-surface-900">Resume AI Intelligence Upload</h3>
      <p className="text-sm text-surface-600 mb-6">Upload your PDF or DOCX resume to extract facts and get AI inferences about your career.</p>

      {!intelligence ? (
        <>
          <div 
            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${dragActive ? 'border-primary-500 bg-primary-50' : 'border-surface-300 hover:border-primary-400 hover:bg-surface-50'}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={onButtonClick}
          >
            <input 
              ref={inputRef}
              type="file" 
              className="hidden" 
              accept=".pdf,.docx" 
              onChange={handleChange}
            />
            {file ? (
              <div>
                <p className="text-surface-900 font-semibold">{file.name}</p>
                <p className="text-surface-500 text-xs mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            ) : (
              <div>
                <svg className="mx-auto h-12 w-12 text-surface-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <p className="mt-2 text-sm font-medium text-surface-700">Drag and drop your resume here, or click to select</p>
                <p className="text-xs text-surface-500 mt-1">PDF, DOCX up to 10MB</p>
              </div>
            )}
          </div>

          {error && <div className="mt-4 text-status-error text-sm font-medium">{error}</div>}

          {file && (
            <div className="mt-6 flex justify-end">
              <button 
                onClick={(e) => { e.stopPropagation(); handleUpload(); }}
                disabled={loading}
                className="inline-flex justify-center py-2.5 px-5 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50 transition-colors"
              >
                {loading ? 'Analyzing with AI...' : 'Upload & Analyze'}
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="space-y-6">
          <div className="bg-status-success/10 border border-status-success/20 p-4 rounded-xl">
            <h4 className="text-status-success font-bold mb-1">Resume Analyzed Successfully</h4>
            <button 
              onClick={() => setIntelligence(null)}
              className="text-sm text-surface-600 hover:text-surface-900 underline transition-colors"
            >
              Upload a different resume
            </button>
          </div>

          {/* Extracted Facts Section */}
          <div className="border border-surface-200 rounded-xl overflow-hidden bg-white shadow-sm">
            <div className="bg-surface-50 px-5 py-3 border-b border-surface-200">
              <h4 className="text-base font-bold text-surface-900">Extracted Facts</h4>
              <p className="text-xs text-surface-500 mt-1">Data directly parsed from your document.</p>
            </div>
            <div className="p-5 space-y-5">
              {intelligence.extracted_facts?.skills && (
                <div>
                  <h5 className="text-xs font-bold uppercase tracking-wider text-surface-500">Skills</h5>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {intelligence.extracted_facts.skills.map((s, i) => (
                      <span key={i} className="px-2.5 py-1 bg-surface-100 text-xs font-medium text-surface-700 rounded-md border border-surface-200">{s}</span>
                    ))}
                  </div>
                  <button 
                    onClick={() => handleImport({ skills: intelligence.extracted_facts.skills })}
                    className="mt-3 text-xs font-semibold text-primary-600 hover:text-primary-700 bg-primary-50 hover:bg-primary-100 border border-primary-200 px-3 py-1.5 rounded-md transition-colors"
                  >
                    Import Skills to Profile
                  </button>
                </div>
              )}
              
              {/* Similar blocks could be added for Education/Projects if backend returns them */}
              {intelligence.extracted_facts?.education && (
                <div className="mt-4 border-t border-surface-100 pt-5">
                  <h5 className="text-xs font-bold uppercase tracking-wider text-surface-500 mb-2">Education</h5>
                  <ul className="text-sm text-surface-700 list-disc list-inside space-y-1">
                    {intelligence.extracted_facts.education.map((edu, i) => (
                      <li key={i} className="pl-1"><span className="font-medium text-surface-900">{edu}</span></li>
                    ))}
                  </ul>
                  <button 
                    onClick={() => handleImport({ education: intelligence.extracted_facts.education })}
                    className="mt-3 text-xs font-semibold text-primary-600 hover:text-primary-700 bg-primary-50 hover:bg-primary-100 border border-primary-200 px-3 py-1.5 rounded-md transition-colors"
                  >
                    Import Education to Profile
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* AI Inferences Section */}
          <div className="border border-primary-200 rounded-xl overflow-hidden shadow-sm bg-white">
            <div className="bg-primary-50 px-5 py-3 border-b border-primary-100">
              <h4 className="text-base font-bold text-primary-900">AI Inferences</h4>
              <p className="text-xs text-primary-700 font-medium mt-1">Derived insights, career path suggestions, and identified gaps.</p>
            </div>
            <div className="p-5 space-y-5 text-sm text-surface-700">
              {intelligence.inferences?.strengths && (
                <div>
                  <h5 className="font-bold text-surface-900 mb-1">Key Strengths Identified</h5>
                  <ul className="list-disc list-inside space-y-1">
                    {intelligence.inferences.strengths.map((s, i) => <li key={i} className="pl-1 text-surface-600">{s}</li>)}
                  </ul>
                </div>
              )}
              {intelligence.inferences?.potential_career_alignment && (
                <div>
                  <h5 className="font-bold text-surface-900 mb-1">Suggested Target Roles</h5>
                  <ul className="list-disc list-inside space-y-1">
                    {intelligence.inferences.potential_career_alignment.map((r, i) => <li key={i} className="pl-1 text-surface-600">{r}</li>)}
                  </ul>
                </div>
              )}
              {intelligence.inferences?.potential_skill_gaps && (
                <div>
                  <h5 className="font-bold text-surface-900 mb-1">Gap Analysis</h5>
                  <ul className="list-disc list-inside space-y-1">
                    {intelligence.inferences.potential_skill_gaps.map((g, i) => <li key={i} className="pl-1 text-surface-600">{g}</li>)}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

import api from './api.js'

export const resumeApi = {
  uploadResume: (file) => {
    const formData = new FormData()
    formData.append('resume', file) // adjust 'resume' if backend expects 'file' or something else
    return api.post('/resume/upload', formData, {
      headers: {
        'Content-Type': undefined
      }
    })
  },
}

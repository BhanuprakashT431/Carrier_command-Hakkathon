import { Outlet, useLocation } from 'react-router-dom'
import useProfileStore from '../../store/profileStore'
import Navbar from '../../components/layout/Navbar.jsx'

const steps = [
  { id: 1, name: 'Education', path: 'education' },
  { id: 2, name: 'Skills', path: 'skills' },
  { id: 3, name: 'Projects', path: 'projects' },
  { id: 4, name: 'Certifications', path: 'certifications' },
  { id: 5, name: 'Preferences', path: 'preferences' },
  { id: 6, name: 'Goals', path: 'goals' },
]

export default function OnboardingLayout() {
  const { onboardingStep } = useProfileStore()
  const location = useLocation()

  // Ensure current step matches route
  const currentStepInfo = steps.find(s => location.pathname.includes(s.path))
  const activeStep = currentStepInfo ? currentStepInfo.id : onboardingStep

  return (
    <div className="min-h-screen bg-surface-50 text-surface-900 flex flex-col relative overflow-hidden">
      

      {/* Background blobs behind card */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] pointer-events-none -z-10 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-200/40 rounded-full blur-3xl animate-blob" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-200/40 rounded-full blur-3xl animate-blob animation-delay-2000" />
      </div>

      <main className="flex-1 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-4xl relative z-10">
          <div className="mb-10 text-center animate-slide-up">
            <h2 className="text-3xl font-extrabold text-surface-900 tracking-tight">Complete Your Career Profile</h2>
            <p className="mt-2 text-sm text-surface-500 font-medium">Step {activeStep} of 6</p>
          </div>

          {/* Stepper */}
          <nav aria-label="Progress" className="animate-slide-up animation-delay-100">
            <ol role="list" className="flex items-center justify-between w-full mb-12">
              {steps.map((step, stepIdx) => {
                const isCompleted = activeStep > step.id
                const isActive = activeStep === step.id
                const isUpcoming = activeStep < step.id

                return (
                  <li key={step.name} className={`relative ${stepIdx !== steps.length - 1 ? 'pr-8 sm:pr-20' : ''}`}>
                    {/* Connecting line */}
                    <div className="absolute inset-0 flex items-center" aria-hidden="true">
                      <div className={`h-1 w-full transition-colors duration-300 ${isCompleted ? 'bg-status-success' : 'bg-surface-200'}`} />
                    </div>

                    {/* Step marker */}
                    <div
                      className={`relative flex h-8 w-8 items-center justify-center rounded-full transition-all duration-300 ${
                        isActive
                          ? 'border-2 border-primary-600 bg-white ring-4 ring-primary-50'
                          : isCompleted
                          ? 'bg-status-success text-white'
                          : 'bg-surface-200'
                      }`}
                    >
                      {isCompleted ? (
                        <svg className="w-5 h-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                           <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <span className={`text-sm font-semibold ${isActive ? 'text-primary-600' : 'text-surface-500'}`}>
                          {step.id}
                        </span>
                      )}
                    </div>
                    
                    {/* Step label */}
                    <div className="absolute top-10 left-1/2 -translate-x-1/2 whitespace-nowrap">
                      <span className={`text-xs font-semibold ${
                        isActive ? 'text-primary-600' :
                        isCompleted ? 'text-surface-900' :
                        'text-surface-400'
                      }`}>
                        {step.name}
                      </span>
                    </div>
                  </li>
                )
              })}
            </ol>
          </nav>

          <div className="bg-white shadow-card rounded-2xl p-6 sm:p-10 mt-12 border border-surface-200 animate-slide-up animation-delay-200 relative overflow-hidden">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  )
}

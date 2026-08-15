import { Routes, Route } from 'react-router-dom'
import LandingPage    from './pages/Landing/index.jsx'
import LoginPage      from './pages/Auth/Login.jsx'
import RegisterPage   from './pages/Auth/Register.jsx'
import Dashboard      from './pages/Dashboard/index.jsx'
import NotFound       from './pages/NotFound/index.jsx'
import ProtectedRoute from './components/routing/ProtectedRoute.jsx'
import OnboardingLayout from './pages/Onboarding/OnboardingLayout.jsx'
import EducationStep from './pages/Onboarding/EducationStep.jsx'
import SkillsStep from './pages/Onboarding/SkillsStep.jsx'
import ProjectsStep from './pages/Onboarding/ProjectsStep.jsx'
import CertificationsStep from './pages/Onboarding/CertificationsStep.jsx'
import PreferencesStep from './pages/Onboarding/PreferencesStep.jsx'
import GoalsStep from './pages/Onboarding/GoalsStep.jsx'
import Analysis       from './pages/Analysis/index.jsx'
import Simulator      from './pages/Simulator/index.jsx'
import SimulationsHistory from './pages/Simulations/index.jsx'
import Comparison     from './pages/Comparison/index.jsx'
import Copilot        from './pages/Copilot/index.jsx'
import ProgressPage   from './pages/Progress/index.jsx'
import AdminGuard     from './components/routing/AdminGuard.jsx'
import AdminEvaluation from './pages/Admin/Evaluation.jsx'

function App() {
  const isDemoMode = import.meta.env.VITE_DEMO_MODE === 'true';

  return (
    <>
      {/* Global Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10 bg-surface-50">
        <div className="bg-shape bg-primary-200/50 w-96 h-96 top-[-10%] left-[-10%]"></div>
        <div className="bg-shape bg-indigo-200/50 w-96 h-96 top-[20%] right-[-10%] animation-delay-2000"></div>
        <div className="bg-shape bg-purple-200/50 w-96 h-96 bottom-[-10%] left-[20%] animation-delay-4000"></div>
      </div>
      <Routes>
      <Route path="/"               element={<LandingPage />} />
      <Route path="/auth/login"     element={<LoginPage />} />
      <Route path="/auth/register"  element={<RegisterPage />} />
      
      {/* Onboarding Routes */}
      <Route
        path="/onboarding"
        element={
          <ProtectedRoute>
            <OnboardingLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<EducationStep />} />
        <Route path="education" element={<EducationStep />} />
        <Route path="skills" element={<SkillsStep />} />
        <Route path="projects" element={<ProjectsStep />} />
        <Route path="certifications" element={<CertificationsStep />} />
        <Route path="preferences" element={<PreferencesStep />} />
        <Route path="goals" element={<GoalsStep />} />
      </Route>

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/analysis"
        element={
          <ProtectedRoute>
            <Analysis />
          </ProtectedRoute>
        }
      />
      <Route
        path="/simulator"
        element={
          <ProtectedRoute>
            <Simulator />
          </ProtectedRoute>
        }
      />
      <Route
        path="/simulations"
        element={
          <ProtectedRoute>
            <SimulationsHistory />
          </ProtectedRoute>
        }
      />
      <Route
        path="/comparison"
        element={
          <ProtectedRoute>
            <Comparison />
          </ProtectedRoute>
        }
      />
      <Route
        path="/copilot"
        element={
          <ProtectedRoute>
            <Copilot />
          </ProtectedRoute>
        }
      />
      <Route
        path="/progress"
        element={
          <ProtectedRoute>
            <ProgressPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/evaluation"
        element={
          <AdminGuard>
            <AdminEvaluation />
          </AdminGuard>
        }
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
    </>
  )
}

export default App

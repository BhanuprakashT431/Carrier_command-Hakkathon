import { Link } from 'react-router-dom'
import Navbar    from '../../components/layout/Navbar.jsx'
import Button    from '../../components/ui/Button.jsx'

const NotFound = () => {
  return (
    <div className="min-h-screen bg-surface-50 flex flex-col font-sans">
      <Navbar />

      <main className="flex flex-1 items-center justify-center px-4 py-20 text-center">
        {/* Glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none fixed top-0 left-1/2 -translate-x-1/2
                     h-[400px] w-[600px] rounded-full
                     bg-primary-200/20 blur-[90px]"
        />

        <div className="relative animate-slide-up max-w-md">
          {/* Large 404 text */}
          <p
            className="text-[120px] font-extrabold leading-none
                       bg-clip-text text-transparent
                       bg-gradient-to-br from-primary-600 via-primary-500 to-primary-400
                       select-none mb-2"
            aria-hidden="true"
          >
            404
          </p>

          <h1 className="text-2xl font-bold text-surface-900 mb-3">
            Page not found
          </h1>
          <p className="text-surface-600 text-sm mb-8 leading-relaxed font-medium">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
            Let&apos;s get you back on track.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/">
              <Button variant="primary" size="md">
                ← Back to Home
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button variant="secondary" size="md">
                Go to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}

export default NotFound

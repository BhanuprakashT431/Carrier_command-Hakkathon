import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import useAuthStore from '../../store/authStore.js';
import { authApi } from '../../services/api.js';
import { useTheme } from '../../context/ThemeContext.jsx';

export default function Navbar() {
  const { isAuthenticated, user, clearAuth } = useAuthStore();
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch {
      // ignore server errors on logout
    } finally {
      clearAuth();
      navigate('/auth/login');
    }
  };

  const isActive = (path) => location.pathname.startsWith(path);

  const NavLink = ({ to, children }) => (
    <Link
      to={to}
      className={`relative text-sm font-medium transition-all duration-300 px-4 py-2 rounded-lg flex items-center group
        ${isActive(to) 
          ? 'text-primary-600 dark:text-primary-400 bg-primary-50/80 dark:bg-primary-900/20' 
          : 'text-surface-600 dark:text-surface-300 hover:text-surface-900 dark:hover:text-white hover:bg-surface-100/50 dark:hover:bg-surface-800/50'
        }`}
    >
      {children}
      {isActive(to) && (
        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-[2px] bg-primary-500 rounded-full" />
      )}
    </Link>
  );

  const PublicLinks = () => (
    <>
      <a href="#product" className="text-sm font-medium text-surface-600 dark:text-surface-300 hover:text-surface-900 dark:hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-surface-100/50 dark:hover:bg-surface-800/50">Product</a>
      <a href="#how-it-works" className="text-sm font-medium text-surface-600 dark:text-surface-300 hover:text-surface-900 dark:hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-surface-100/50 dark:hover:bg-surface-800/50">How It Works</a>
      <a href="#intelligence" className="text-sm font-medium text-surface-600 dark:text-surface-300 hover:text-surface-900 dark:hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-surface-100/50 dark:hover:bg-surface-800/50">Intelligence</a>
    </>
  );

  const AuthLinks = () => (
    <>
      <NavLink to="/dashboard">Dashboard</NavLink>
      <NavLink to="/analysis">Analysis</NavLink>
      <NavLink to="/simulator">Simulator</NavLink>
      <NavLink to="/comparison">Comparison</NavLink>
      <NavLink to="/progress">Progress</NavLink>
      <NavLink to="/copilot">Copilot</NavLink>
    </>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b border-surface-200/50 dark:border-surface-800/50 bg-white/70 dark:bg-[#080B14]/70 backdrop-blur-xl transition-colors duration-300">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Left: Logo */}
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600 text-white shadow-glow-primary group-hover:scale-105 transition-transform duration-300">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="hidden sm:block font-bold text-surface-900 dark:text-white text-base tracking-tight group-hover:text-primary-600 transition-colors">
              Command Center
            </span>
          </Link>

          {/* Center: Auth Links Desktop */}
          {isAuthenticated && user && (
            <div className="hidden lg:flex items-center space-x-1 ml-4 border-l border-surface-200 dark:border-surface-800 pl-6">
              <AuthLinks />
            </div>
          )}
          
          {/* Center: Public Links Desktop */}
          {!isAuthenticated && (
            <div className="hidden lg:flex items-center space-x-2 ml-4">
              <PublicLinks />
            </div>
          )}
        </div>

        {/* Right: Actions */}
        <div className="hidden lg:flex items-center gap-3">
          
          {/* Social Links */}
          <div className="flex items-center gap-1 border-r border-surface-200 dark:border-surface-800 pr-3 mr-1">
            <a href="https://github.com/Abhishekkp-12345" target="_blank" rel="noreferrer" className="text-surface-400 hover:text-surface-900 dark:hover:text-white p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800 transition-all">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" /></svg>
            </a>
            <a href="https://x.com/akp63640" target="_blank" rel="noreferrer" className="text-surface-400 hover:text-surface-900 dark:hover:text-white p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800 transition-all">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
            </a>
            <a href="https://www.linkedin.com/in/abhishek-kp-" target="_blank" rel="noreferrer" className="text-surface-400 hover:text-surface-900 dark:hover:text-white p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800 transition-all">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" /></svg>
            </a>
          </div>

          <button 
            onClick={toggleTheme} 
            className="p-2 rounded-lg text-surface-400 hover:text-surface-900 dark:hover:text-white hover:bg-surface-100 dark:hover:bg-surface-800 transition-all"
            title="Toggle Theme"
          >
            {isDarkMode ? (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>
          
          {isAuthenticated && user ? (
            <div className="flex items-center gap-3 ml-2">
              <div className="flex items-center gap-2 bg-surface-100/50 dark:bg-surface-800/50 border border-surface-200/50 dark:border-surface-700/50 px-3 py-1.5 rounded-full text-xs font-medium text-surface-700 dark:text-surface-300">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
                </span>
                AI Active
              </div>
              
              <div className="relative group cursor-pointer">
                <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-primary-600 to-primary-400 text-white flex items-center justify-center font-bold text-sm shadow-sm border-2 border-white dark:border-surface-900">
                  {user.email?.charAt(0).toUpperCase()}
                </div>
                {/* Dropdown hover */}
                <div className="absolute right-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right group-hover:scale-100 scale-95 z-50">
                  <div className="w-48 bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 rounded-xl shadow-premium dark:shadow-dark-premium overflow-hidden">
                    <div className="px-4 py-3 border-b border-surface-100 dark:border-surface-800">
                      <p className="text-sm font-medium text-surface-900 dark:text-white truncate">{user.email}</p>
                    </div>
                    <div className="p-1">
                      <button 
                        onClick={handleLogout}
                        className="w-full text-left px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors flex items-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                        Sign out
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3 ml-2">
              <Link to="/auth/login" className="text-sm font-medium text-surface-600 dark:text-surface-300 hover:text-surface-900 dark:hover:text-white transition-colors">
                Log in
              </Link>
              <Link to="/auth/register" className="text-sm font-medium text-white bg-surface-900 dark:bg-primary-600 hover:bg-surface-800 dark:hover:bg-primary-500 transition-all px-4 py-1.5 rounded-lg shadow-sm">
                Get Started
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button 
          className="lg:hidden p-2 text-surface-600 hover:text-surface-900 focus:outline-none"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {mobileMenuOpen ? (
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-16 left-0 w-full bg-white dark:bg-[#080B14] border-b border-surface-200/50 dark:border-surface-800/50 shadow-xl py-4 px-4 flex flex-col gap-2 z-40 animate-fade-in backdrop-blur-xl">
          {isAuthenticated && user ? (
            <>
              <div className="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-2 px-3">Navigation</div>
              <div className="flex flex-col gap-1 mb-4">
                <AuthLinks />
              </div>
              <div className="border-t border-surface-200/50 dark:border-surface-800/50 pt-4">
                <div className="flex items-center gap-3 px-3 mb-4">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-primary-600 to-primary-400 text-white flex items-center justify-center font-bold text-sm">
                    {user.email?.charAt(0).toUpperCase()}
                  </div>
                  <div className="text-sm font-medium text-surface-900 dark:text-white truncate">{user.email}</div>
                </div>
                <button onClick={handleLogout} className="w-full text-left text-red-600 dark:text-red-400 font-medium px-3 py-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                  Sign out
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="flex flex-col gap-1 mb-6">
                {!location.pathname.startsWith('/auth') && <PublicLinks />}
              </div>
              <div className="flex flex-col gap-3 pt-4 border-t border-surface-200/50 dark:border-surface-800/50">
                <Link to="/auth/login" className="text-center w-full text-sm font-medium text-surface-700 dark:text-surface-300 bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 py-2.5 rounded-lg">Login</Link>
                <Link to="/auth/register" className="text-center w-full text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 py-2.5 rounded-lg">Get Started</Link>
              </div>
            </>
          )}
        </div>
      )}
    </header>
  );
}

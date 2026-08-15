import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const PATH_LABELS = {
  '/dashboard': 'Command Center',
  '/analysis': 'Agent Analysis Engine',
  '/simulator': 'What-If Lab',
  '/comparison': 'Comparison Matrix',
  '/progress': 'Intelligence Roadmap',
  '/copilot': 'Career Copilot',
};

export default function Breadcrumbs() {
  const location = useLocation();
  const path = location.pathname;

  // Don't show breadcrumbs on auth or landing pages
  if (path === '/' || path.startsWith('/auth')) {
    return null;
  }

  const currentLabel = PATH_LABELS[path] || 'Command Center';
  
  return (
    <div className="w-full bg-white dark:bg-surface-950 border-b border-surface-200 dark:border-surface-800 h-12 flex items-center">
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 flex items-center text-sm">
        <Link 
          to="/dashboard" 
          className="text-surface-500 hover:text-primary-600 dark:text-surface-400 dark:hover:text-primary-400 flex items-center transition-colors"
        >
          <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          Workspace
        </Link>
        
        {path !== '/dashboard' && (
          <>
            <svg className="w-4 h-4 mx-2 text-surface-300 dark:text-surface-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="font-medium text-surface-900 dark:text-white">
              {currentLabel}
            </span>
          </>
        )}
      </div>
    </div>
  );
}

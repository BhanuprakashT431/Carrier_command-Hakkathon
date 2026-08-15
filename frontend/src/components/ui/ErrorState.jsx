import React from 'react'

const ErrorState = ({ title = 'An error occurred', message, onRetry }) => {
  // Translate common technical errors into user-friendly ones
  let displayMessage = message
  if (message?.includes('401') || message?.toLowerCase().includes('unauthorized')) {
    displayMessage = 'Your session has expired. Please sign in again.'
  } else if (message?.includes('Network Error')) {
    displayMessage = 'Unable to connect to the server. Please check your internet connection.'
  } else if (!message || message?.includes('AxiosError')) {
    displayMessage = 'We encountered an unexpected problem. Please try again.'
  }

  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4 animate-fade-in text-center max-w-md mx-auto">
      <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-status-error" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      
      <h3 className="text-lg font-bold text-surface-900">{title}</h3>
      <p className="text-sm text-surface-600 leading-relaxed">
        {displayMessage}
      </p>

      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 px-4 py-2 border border-surface-200 rounded-lg text-sm font-medium text-surface-700 hover:bg-surface-50 transition-colors shadow-sm"
        >
          Try Again
        </button>
      )}
    </div>
  )
}

export default ErrorState

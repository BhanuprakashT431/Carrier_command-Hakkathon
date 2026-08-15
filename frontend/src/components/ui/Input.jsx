import React, { useId } from 'react'

/**
 * Input component — light-themed for SaaS, with label, error state, and accessible IDs.
 */
const Input = React.forwardRef(
  (
    {
      label,
      error,
      type         = 'text',
      placeholder  = '',
      name,
      value,
      onChange,
      required     = false,
      autoComplete,
      className    = '',
      ...rest
    },
    ref,
  ) => {
    const generatedId = useId()
    const inputId     = name || generatedId
    const errorId     = `${inputId}-error`

    return (
      <div className={`flex flex-col gap-1.5 ${className}`}>
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-surface-700"
          >
            {label}
            {required && (
              <span className="ml-1 text-primary-500" aria-hidden="true">
                *
              </span>
            )}
          </label>
        )}

        <input
          ref={ref}
          id={inputId}
          name={name}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          autoComplete={autoComplete}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
          className={[
            'block w-full rounded-lg px-4 py-2.5 text-sm',
            'bg-white border shadow-sm',
            'text-surface-900 placeholder-surface-400',
            'transition-all duration-200',
            'focus:outline-none focus:ring-2',
            error
              ? 'border-status-error focus:border-status-error focus:ring-status-error/20'
              : 'border-surface-200 focus:border-primary-500 focus:ring-primary-500/20 hover:border-surface-300',
          ]
            .join(' ')}
          {...rest}
        />

        {error && (
          <p
            id={errorId}
            role="alert"
            className="flex items-center gap-1.5 text-xs font-medium text-status-error animate-fade-in"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-3.5 h-3.5 shrink-0"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z"
                clipRule="evenodd"
              />
            </svg>
            {error}
          </p>
        )}
      </div>
    )
  },
)

Input.displayName = 'Input'

export default Input

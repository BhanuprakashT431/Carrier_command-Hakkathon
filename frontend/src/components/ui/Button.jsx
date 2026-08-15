import React from 'react'

/**
 * Button component with multiple variants, sizes, and a loading spinner.
 */
const Button = React.forwardRef(
  (
    {
      variant   = 'primary',
      size      = 'md',
      loading   = false,
      disabled  = false,
      fullWidth = false,
      type      = 'button',
      onClick,
      children,
      className = '',
      ...rest
    },
    ref,
  ) => {
    // ── Size classes ────────────────────────────────────────────────────────
    const sizeClasses = {
      sm: 'px-3.5 py-2   text-xs  rounded-lg  gap-1.5',
      md: 'px-5   py-2.5 text-sm  rounded-lg  gap-2',
      lg: 'px-7   py-3   text-base rounded-xl  gap-2.5',
    }

    // ── Variant classes ──────────────────────────────────────────────────────
    const variantClasses = {
      primary: [
        'bg-gradient-to-r from-primary-500 to-primary-600',
        'text-white font-medium',
        'shadow-glow-primary',
        'hover:from-primary-600 hover:to-primary-700 hover:shadow-none',
        'disabled:from-surface-300 disabled:to-surface-300 disabled:text-surface-500 disabled:shadow-none',
      ].join(' '),

      secondary: [
        'border border-surface-200 bg-white',
        'text-surface-700 font-medium',
        'shadow-sm hover:border-primary-500 hover:text-primary-600 hover:bg-surface-50',
        'disabled:border-surface-200 disabled:text-surface-400 disabled:bg-surface-50',
      ].join(' '),

      danger: [
        'bg-status-error',
        'text-white font-medium',
        'hover:bg-red-700',
        'disabled:bg-red-300',
      ].join(' '),
    }

    const isDisabled = disabled || loading

    return (
      <button
        ref={ref}
        type={type}
        disabled={isDisabled}
        onClick={onClick}
        className={[
          'inline-flex items-center justify-center',
          'transition-all duration-200',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white',
          'disabled:cursor-not-allowed',
          sizeClasses[size]   || sizeClasses.md,
          variantClasses[variant] || variantClasses.primary,
          fullWidth ? 'w-full' : '',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        {...rest}
      >
        {loading && (
          <svg
            className="animate-spin shrink-0"
            style={{ width: size === 'sm' ? 14 : size === 'lg' ? 20 : 16, height: size === 'sm' ? 14 : size === 'lg' ? 20 : 16 }}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        )}
        {children}
      </button>
    )
  },
)

Button.displayName = 'Button'

export default Button

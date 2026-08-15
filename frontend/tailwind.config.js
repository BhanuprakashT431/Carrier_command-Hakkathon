/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
      colors: {
        primary: {
          50:  '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#635BFF', // brand primary
          600: '#4F46E5', // brand secondary
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
          950: '#1e1b4b',
        },
        surface: {
          50:  '#F8FAFC', // soft background
          100: '#f1f5f9',
          200: '#E2E8F0', // border
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748B', // secondary text
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0F172A', // primary text
          950: '#080B14', // deep dark
          975: '#161B2B', // elevated dark
        },
        status: {
          success: '#16A34A',
          warning: '#D97706',
          error:   '#DC2626',
        }
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #635BFF 0%, #4F46E5 100%)',
        'gradient-soft':    'linear-gradient(135deg, #F8FAFC 0%, #FFFFFF 100%)',
      },
      boxShadow: {
        'glow-primary': '0 0 20px rgba(99, 91, 255, 0.2)',
        'card':         '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05)',
        'card-hover':   '0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -4px rgba(0, 0, 0, 0.04)',
        'premium':      '0 8px 30px rgba(0,0,0,0.04)',
        'premium-hover':'0 14px 40px rgba(0,0,0,0.08)',
        'dark-premium': '0 8px 30px rgba(0,0,0,0.5)',
      },
      animation: {
        'fade-in':    'fadeIn 0.4s ease-in-out',
        'slide-up':   'slideUp 0.4s ease-out',
        'blob':       'blob 7s infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow':  'spin 8s linear infinite',
        'connect':    'connectLine 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%':   { transform: 'translateY(15px)', opacity: '0' },
          '100%': { transform: 'translateY(0)',    opacity: '1' },
        },
        blob: {
          '0%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
          '100%': { transform: 'translate(0px, 0px) scale(1)' },
        },
        connectLine: {
          '0%': { strokeDashoffset: '100' },
          '100%': { strokeDashoffset: '0' },
        }
      },
    },
  },
  plugins: [],
}

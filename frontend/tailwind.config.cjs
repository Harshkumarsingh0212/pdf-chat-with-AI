const path = require('path')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    path.join(__dirname, 'index.html'),
    path.join(__dirname, 'src/**/*.{js,jsx}'),
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef4ff',
          100: '#dce8ff',
          200: '#b9d1ff',
          300: '#8fb3ff',
          400: '#5f8cff',
          500: '#3a66f5',
          600: '#2a4bd6',
          700: '#2139ab',
          800: '#1d2f87',
          900: '#1c2b6b',
        },
      },
      keyframes: {
        'fade-in-up': {
          '0%': { opacity: 0, transform: 'translateY(8px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        'bounce-dot': {
          '0%, 80%, 100%': { transform: 'scale(0.6)', opacity: 0.4 },
          '40%': { transform: 'scale(1)', opacity: 1 },
        },
      },
      animation: {
        'fade-in-up': 'fade-in-up 0.25s ease-out',
        'bounce-dot': 'bounce-dot 1.4s infinite ease-in-out both',
      },
    },
  },
  plugins: [],
}

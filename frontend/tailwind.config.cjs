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
      fontFamily: {
        sans: [
          '"Plus Jakarta Sans"',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'Segoe UI',
          'Roboto',
          'sans-serif',
        ],
        display: ['"Lexend"', '"Plus Jakarta Sans"', 'ui-sans-serif', 'sans-serif'],
      },
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
        accent: {
          50: '#f6f3ff',
          100: '#ede8ff',
          200: '#dcd3ff',
          300: '#c0acff',
          400: '#a27dff',
          500: '#8b53f7',
          600: '#7a36ea',
          700: '#6726c9',
          800: '#5521a3',
          900: '#471c85',
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
        'scale-in': {
          '0%': { opacity: 0, transform: 'scale(0.96)' },
          '100%': { opacity: 1, transform: 'scale(1)' },
        },
        'slide-in-left': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: 0.55, transform: 'scale(1)' },
          '50%': { opacity: 0.9, transform: 'scale(1.06)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        'fade-in-up': 'fade-in-up 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        'bounce-dot': 'bounce-dot 1.4s infinite ease-in-out both',
        'scale-in': 'scale-in 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-in-left': 'slide-in-left 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        'pulse-glow': 'pulse-glow 3s ease-in-out infinite',
        float: 'float 5s ease-in-out infinite',
        shimmer: 'shimmer 2.5s linear infinite',
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(58, 102, 245, 0.08), 0 8px 24px -4px rgba(58, 102, 245, 0.25)',
        'glow-lg': '0 0 0 1px rgba(58, 102, 245, 0.1), 0 20px 48px -12px rgba(58, 102, 245, 0.35)',
        'accent-glow': '0 8px 24px -4px rgba(139, 83, 247, 0.35)',
        card: '0 1px 2px rgba(15, 23, 42, 0.04), 0 8px 20px -6px rgba(15, 23, 42, 0.08)',
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, #3a66f5 0%, #8b53f7 100%)',
        'brand-gradient-soft': 'linear-gradient(135deg, #5f8cff 0%, #a27dff 100%)',
        shimmer: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent)',
      },
    },
  },
  plugins: [],
}

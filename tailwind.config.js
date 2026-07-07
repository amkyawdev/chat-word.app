/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./pages/**/*.{html,js}",
    "./components/**/*.{html,js}",
    "./js/**/*.{js}",
  ],
  theme: {
    extend: {
      colors: {
        sky: {
          50: '#E0F4FF',
          100: '#B0E0E6',
          200: '#87CEEB',
          300: '#00BFFF',
          400: '#1E90FF',
          500: '#1873CC',
          600: '#14559A',
          700: '#0F3D73',
          800: '#0A2647',
          900: '#051026'
        }
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif'
        ],
        mono: [
          'Monaco',
          'Consolas',
          'Liberation Mono',
          'Courier New',
          'monospace'
        ]
      },
      spacing: {
        '128': '32rem',
        '144': '36rem',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      animation: {
        'bounce-slow': 'bounce 2s infinite',
        'pulse-slow': 'pulse 3s infinite',
        'spin-slow': 'spin 3s linear infinite',
      },
      boxShadow: {
        'sky': '0 4px 8px rgba(135, 206, 235, 0.4)',
        'sky-lg': '0 8px 16px rgba(135, 206, 235, 0.5)',
        'sky-xl': '0 12px 24px rgba(135, 206, 235, 0.6)',
      },
      backgroundImage: {
        'sky-gradient': 'linear-gradient(180deg, #87CEEB 0%, #B0E0E6 50%, #E0F4FF 100%)',
        'sky-gradient-dark': 'linear-gradient(180deg, #00BFFF 0%, #1E90FF 100%)',
      }
    },
  },
  plugins: [],
  // Custom utilities
  utilities: {
    '.animate-fade-in': {
      animation: 'fadeIn 0.5s ease-in',
    },
    '.animate-slide-up': {
      animation: 'slideUp 0.5s ease-out',
    },
  }
}

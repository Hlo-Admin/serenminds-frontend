/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        fadeInOverlay: {
          'from': { opacity: '0' },
          'to': { opacity: '1' },
        },
        slideInModal: {
          'from': { 
            transform: 'scale(0.9) translateY(-20px)',
            opacity: '0'
          },
          'to': { 
            transform: 'scale(1) translateY(0)',
            opacity: '1'
          },
        },
      },
      animation: {
        'fade-in-overlay': 'fadeInOverlay 0.3s ease-out',
        'slide-in-modal': 'slideInModal 0.4s ease-out',
      },
    },
  },
  plugins: [],
}


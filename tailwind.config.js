/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#e8c547',
        secondary: '#6b7280',
        'dragon-gold': '#e8c547',
        'dragon-gold-dark': '#d4b445',
        'dark-bg': '#0e1b12',
        'dark-card': '#1a2e1a',
        'dark-border': '#3e503e',
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
        'gradient': 'gradient 3s ease infinite',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
      },
      keyframes: {
        gradient: {
          '0%, 100%': {
            'background-size': '300%',
            'background-position': '0% 50%'
          },
          '50%': {
            'background-size': '300%',
            'background-position': '100% 50%'
          }
        },
      },
      fontFamily: {
        'geist-sans': ['var(--font-geist-sans)'],
        'geist-mono': ['var(--font-geist-mono)'],
      },
      backgroundSize: {
        '300': '300%',
      },
    },
  },
  plugins: [],
};

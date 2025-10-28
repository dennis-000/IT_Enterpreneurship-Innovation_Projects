/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        royal: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#1e40af',
          600: '#1e3a8a',
          700: '#1e3a8a',
          800: '#1e3a8a',
          900: '#172554',
        },
        tomato: {
          50: '#fef2f0',
          100: '#fde6e1',
          200: '#fccdc2',
          300: '#f9a896',
          400: '#f57c68',
          500: '#f05a28',
          600: '#d14a1e',
          700: '#b03a1a',
          800: '#8f2e16',
          900: '#762512',
        },
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
        nunito: ['Nunito', 'sans-serif'],
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
    },
  },
  plugins: [],
};

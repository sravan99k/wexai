/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0f766e', // teal-700
          light: '#14b8a6', // teal-500
          dark: '#0f3f3a', // custom dark teal
        },
        accent: {
          DEFAULT: '#f97316', // orange-500
          light: '#fb923c', // orange-400
        },
        neutral: {
          lightest: '#f8fafc', // slate-50
          light: '#e2e8f0', // slate-200
          DEFAULT: '#94a3b8', // slate-400
          dark: '#334155', // slate-700
          darkest: '#0f172a', // slate-900
        },
        success: '#22c55e', // green-500
        warning: '#f59e0b', // amber-500
        error: '#ef4444', // red-500
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

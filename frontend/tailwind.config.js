/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#f8fafc',
        sidebar: {
          active: '#f1f5f9',
          text: '#64748b',
          activeText: '#0f172a'
        },
        primary: '#334155',
        status: {
          in: '#22c55e',
          out: '#f97316',
          offender: '#ef4444'
        }
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
      }
    },
  },
  plugins: [],
}

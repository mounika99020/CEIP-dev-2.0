/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: '#0b0f17',
        surface: {
          DEFAULT: '#111726',
          subtle: '#0f1422',
          card: '#141d2f',
          hover: '#1a243a',
          active: '#212d46',
          border: '#1f2a3f',
          borderHighlight: '#2c3b57',
        },
        primary: {
          DEFAULT: '#6366f1',
          hover: '#4f46e5',
          muted: 'rgba(99, 102, 241, 0.15)',
        },
        tealAccent: {
          DEFAULT: '#14b8a6',
          hover: '#0d9488',
          muted: 'rgba(20, 184, 166, 0.15)',
        },
        risk: {
          low: '#10b981',
          lowBg: 'rgba(16, 185, 129, 0.12)',
          medium: '#f59e0b',
          mediumBg: 'rgba(245, 158, 11, 0.12)',
          high: '#ef4444',
          highBg: 'rgba(239, 68, 68, 0.12)',
        },
        text: {
          primary: '#f1f5f9',
          secondary: '#94a3b8',
          muted: '#64748b',
          dim: '#475569',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      boxShadow: {
        card: '0 4px 20px -2px rgba(0, 0, 0, 0.45)',
        glowTeal: '0 0 20px -5px rgba(20, 184, 166, 0.25)',
        glowIndigo: '0 0 20px -5px rgba(99, 102, 241, 0.25)',
      }
    },
  },
  plugins: [],
}
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
        aqua: {
          navy: '#123B55',
          'navy-dark': '#0B2333',
          'navy-light': '#1A4D6F',
          teal: '#21A6A0',
          'teal-light': '#E8F7F6',
          'teal-hover': '#1B8C87',
          blue: '#5CB6DC',
          'blue-light': '#EBF7FC',
          green: '#65A875',
          'green-light': '#EEF7F0',
          dark: '#0c1d29',
          card: '#ffffff',
          slate: '#F4F7F9',
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'Courier New', 'monospace'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'flow': 'flow 2s linear infinite',
      },
      keyframes: {
        flow: {
          '0%': { backgroundPosition: '0 0' },
          '100%': { backgroundPosition: '40px 0' },
        }
      }
    },
  },
  plugins: [],
}


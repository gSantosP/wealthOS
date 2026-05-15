/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans:    ['var(--font-sans)',    'sans-serif'],
        display: ['var(--font-display)', 'sans-serif'],
        mono:    ['var(--font-mono)',    'monospace'],
      },
      colors: {
        bg:      'var(--bg)',
        bg2:     'var(--bg2)',
        bg3:     'var(--bg3)',
        accent:  'var(--accent)',
        accent2: 'var(--accent-2)',
      },
    },
  },
  plugins: [],
}

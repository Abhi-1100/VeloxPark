/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0A0A0A',
        surface: '#141414',
        'surface-raised': '#1C1C1C',
        line: '#333333',
        muted: '#8A8A8A',
        paper: '#F5F5F0',
        gold: '#F2C230',
        'gold-soft': '#6B5514',
        available: '#35C878',
        danger: '#F05A67',
        info: '#6EA8FE',
      },
      borderRadius: {
        sm: '0.5rem',
        md: '0.75rem',
        lg: '1rem',
        pill: '9999px',
      },
      fontSize: {
        'display-xl': ['3rem', { lineHeight: '1', letterSpacing: '-0.04em' }],
        'display-lg': ['2.25rem', { lineHeight: '1.05', letterSpacing: '-0.03em' }],
        'display-md': ['1.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        label: ['0.75rem', { lineHeight: '1.2', letterSpacing: '0.12em' }],
        'body-lg': ['1.125rem', { lineHeight: '1.6' }],
        body: ['0.9375rem', { lineHeight: '1.5' }],
        'body-sm': ['0.8125rem', { lineHeight: '1.4' }],
      },
      fontFamily: {
        display: ['"Arial Narrow"', '"Roboto Condensed"', 'Arial', 'sans-serif'],
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      spacing: {
        1: '0.25rem',
        2: '0.5rem',
        3: '0.75rem',
        4: '1rem',
        6: '1.5rem',
        8: '2rem',
        12: '3rem',
      },
    },
  },
  plugins: [],
};

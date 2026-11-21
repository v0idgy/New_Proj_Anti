/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        background: '#09090b', // zinc-950
        surface: '#18181b',    // zinc-900
        'surface-elevated': '#27272a', // zinc-800
        border: '#27272a',     // zinc-800
        // Red brand palette
        red: {
          50: '#FEF2F2',
          100: '#FEE2E2',
          200: '#FECACA',
          300: '#FCA5A5',
          400: '#F87171',
          500: '#EF4444', // vibrant red hover
          600: '#DC2626', // primary brand red
          700: '#B91C1C',
          800: '#991B1B',
          900: '#7F1D1D',
          950: '#450A0A',
        },
      },
      boxShadow: {
        'red-sm': '0 2px 8px -1px rgba(220, 38, 38, 0.25)',
        'red-md': '0 4px 14px -2px rgba(220, 38, 38, 0.35)',
      },
    },
  },
  plugins: [],
}

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
      colors: {
        background: '#09090b', // zinc-950
        surface: '#18181b',    // zinc-900
        'surface-elevated': '#27272a', // zinc-800
        border: '#27272a',     // zinc-800
      },
    },
  },
  plugins: [],
}

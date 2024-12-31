/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#850928',
          light: '#a61033',
          dark: '#6b071f'
        },
        secondary: {
          DEFAULT: '#00853E',
          light: '#00a44c',
          dark: '#006830'
        },
        dark: {
          bg: '#121212',
          card: '#1E1E1E',
          surface: '#242424',
          border: '#333333'
        }
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
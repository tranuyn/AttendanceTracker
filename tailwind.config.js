/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#4B93CD',
          light: '#73addb',
          lighter: '#98c4eb',
          pale: '#b6dbf8',
          soft: '#cbeaff',
          dark: '#3480bc',
          darker: '#3075ad',
          deep: '#2c6b9e',
          deepest: '#28608e',
          faint: '#F2FAFF',
        },
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false, // Tắt CSS reset của Tailwind để tránh xung đột với Ant Design
  },
}


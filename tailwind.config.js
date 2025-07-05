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
    screens: {
      'xs': '480px',     // Điện thoại nhỏ
      'sm': '640px',     // Điện thoại phổ thông
      'md': '768px',     // Tablet
      'lg': '1024px',    // Laptop
      'xl': '1280px',    // Desktop lớn
      '2xl': '1536px',   // Màn hình lớn hơn
      '3xl': '1920px',   // 2K/Full HD++
      '4xl': '2560px',   // 2K - 4K
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false, // Tắt CSS reset của Tailwind để tránh xung đột với Ant Design
  },
}


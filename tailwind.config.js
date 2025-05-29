/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // 可以在这里添加自定义颜色
      },
    },
  },
  plugins: [],
  darkMode: 'class', // 启用暗色模式
} 
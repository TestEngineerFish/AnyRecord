/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FFE600',      // 明亮黄
        secondary: '#4DD7FA',    // 天蓝
        accent: '#FF6EC7',       // 粉色
        background: '#F5FCFF',  // 浅蓝白
        text: '#222222',         // 深灰
      },
    },
  },
  plugins: [],
  darkMode: 'class', // 启用暗色模式
} 
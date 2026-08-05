/** @type {import('tailwindcss').Config} */
module.exports = {
  // NativeWind가 감지할 파일 경로 설정
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        theme1: {
          bg: '#080C14',
          card: 'rgba(20, 28, 44, 0.82)',
          cardActive: 'rgba(16, 185, 129, 0.35)',
          accent: '#38BDF8',
        },
        theme2: {
          bg: '#F1F5F9',
          card: '#FFFFFF',
          cardActive: '#BAE6FD',
          accent: '#0369A1',
        },
        theme3: {
          bg: '#4BA2E3',
          card: 'rgba(255, 255, 255, 0.85)',
          cardActive: '#00F2C3',
          accent: '#FF9100',
        },
      },
    },
  },
  plugins: [],
};

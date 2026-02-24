/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        light: '#DE7CD1',
        medium: '#16df53',
        heavy: '#ff6b6b',
        ultimate: '#1ba6ff',
        skill: '#ffe370',
      },
    },
  },
  plugins: [],
}

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // This line is crucial
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

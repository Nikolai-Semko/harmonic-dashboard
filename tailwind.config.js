/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        accent: {
          DEFAULT: "#4CCEAC",
          light: "#2a9d8f"
        },
        background: {
          dark: "#141b2d",
          light: "#f8f9fa"
        },
        card: {
          dark: "#1F2A40",
          light: "#ffffff"
        }
      },
    },
  },
  plugins: [],
}
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#4f46e5', // Indigo 600
          light: '#818cf8',   // Indigo 400
          dark: '#3730a3',    // Indigo 800
          bg: '#eef2ff',      // Indigo 50
        },
        surface: '#ffffff',
        background: '#f8fafc', // Slate 50
        dark: '#0f172a',       // Slate 900
        subtext: '#64748b',    // Slate 500
      },
      borderRadius: {
        '3xl': '24px',
        '4xl': '32px',
      }
    },
  },
  plugins: [],
}
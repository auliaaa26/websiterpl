/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          orange: "#E87717",
          cream: "#FDF5ED",
          dark: "#4A2E1B",
        }
      }
    },
  },
  plugins: [],
}
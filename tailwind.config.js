/** @type {import("tailwindcss").Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Cores da marca Café Maiolini
        "coffee-cream": "#f2e3ca",
        "coffee-dark": "#3e2a1b",
        "coffee-medium": "#ccb38c",
        "coffee-light": "#785841",
        "coffee-accent": "#a38661",
        "coffee-red": "#651b11",
        "coffee-dark-red": "#871918",
      },
    },
  },
  plugins: [],
}



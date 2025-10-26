
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        'brand-primary': '#204677',
        'brand-accent': '#DE8634',
        'brand-soft': '#ECDA73',
      }
    },
  },
  plugins: [],
}

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#204677',
          accent: '#DE8634',
          soft: '#ECDA73'
        }
      }
    }
  },
  plugins: [],
}

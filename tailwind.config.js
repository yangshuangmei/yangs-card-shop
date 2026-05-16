/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        pokemon: {
          red: '#EE1515',
          blue: '#3B4CCA',
          yellow: '#FFDE00',
          gold: '#B3A125',
        },
      },
    },
  },
  plugins: [],
};

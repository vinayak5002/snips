/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Adjust according to your file structure
  ],
  theme: {
    extend: {
      colors: {
        primary: '#242424', // Custom primary color
        secondary: '#313131', // Custom secondary color
      }
    },
  },
  plugins: [],
};

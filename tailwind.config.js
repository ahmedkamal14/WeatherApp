/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./*.{html,js}", // Adjust according to your project structure
  ],
  theme: {
    extend: {
      colors: {
        primary: "#b8d4d4",
        secondary: "#F5F9F9",
        cyan: "#B5D6D6",
        selected: "#FBDC64",
        blackC: "#474747",
      },
      fontFamily: {
        josefin: ["Josefin Sans", "sans-serif"],
      },
    },
  },
  plugins: [],
};

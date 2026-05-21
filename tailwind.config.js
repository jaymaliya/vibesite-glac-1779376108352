/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#EDE0CF",
        secondary: "#C4B5A0",
        accent: "#2D8659",
        surface: "#C4B5A0",
      },
      fontFamily: {
        heading: ["Space Grotesk", "sans-serif"],
        body: ["Nunito Sans", "sans-serif"],
      },
    },
  },
  plugins: [],
};

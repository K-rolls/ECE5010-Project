/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        albums: "url('/BackgroundScaledblur.png')",
      },
      colors: {
        mainblue: "#94C1D2",
        accentlavender: "#d299ff",
      },
    },
  },
  plugins: [],
};

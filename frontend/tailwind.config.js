/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        "permanent-marker": '"Permanent Marker"',
      },
      backgroundImage: {
        albums: "url('/BackgroundScaledblur.png')",
      },
      colors: {
        mainblue: "#94C1D2",
        accentlavender: "#d299ff",
        background: "#0B4981",
        background2: "#881337",
      },
    },
  },
  plugins: [],
};

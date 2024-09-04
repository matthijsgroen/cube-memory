/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      animation: {
        result: "result 2s ease-in-out forwards",
      },

      keyframes: {
        result: {
          "0%": { opacity: 0, transform: "scale(0.9)" },
          "20%": { opacity: 1, transform: "scale(1.3)" },
          "30%": { opacity: 1, transform: "scale(1.0)" },
          "80%": { opacity: 1 },
          "100%": { opacity: 0 },
        },
      },
    },
  },
  plugins: [],
};

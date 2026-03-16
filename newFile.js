/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.tsx", "*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {},
  },
  plugins: [],
};

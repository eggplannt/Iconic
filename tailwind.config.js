/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.tsx", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "var(--primary)",
        "on-primary": "var(--on-primary)",

        secondary: "var(--secondary)",
        "on-secondary": "var(--on-secondary)",

        background: "var(--background)",
        "on-background": "var(--on-background)",

        accent: "var(--accent)",
        "on-accent": "var(--on-accent)",
      },
    },
  },
  plugins: [],
};

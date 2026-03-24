/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.tsx", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "var(--primary)",
        "on-primary": "var(--on-primary)",

        background: "var(--background)",
        "on-background": "var(--on-background)",

        muted: "var(--muted)",
        "on-muted": "var(--on-muted)",

        danger: "var(--danger)",
      },
    },
  },
  plugins: [],
};

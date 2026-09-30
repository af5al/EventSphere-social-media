/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', "Inter", "system-ui", "sans-serif"],
        display: ["Outfit", "sans-serif"],
        serif: ["Outfit", "sans-serif"], // For existing font-serif usages
      },
      colors: {
        brand: {
          50: "#eef2ff",
          100: "#e0e7ff",
          200: "#c7d2fe",
          300: "#a5b4fc",
          400: "#818cf8",
          500: "#6366f1",
          600: "#4f46e5",
          700: "#4338ca",
          800: "#3730a3",
          900: "#312e81",
        },
        dark: {
          bg: "#090C15",
          surface: "#111726",
          card: "#161D2F",
          border: "#1F293D",
          muted: "#94A3B8",
        },
      },
      boxShadow: {
        card: "0 4px 20px -2px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.06)",
        glow: "0 0 25px -5px rgba(99, 102, 241, 0.25)",
        subtle: "0 1px 3px rgba(0, 0, 0, 0.3), 0 1px 2px rgba(0, 0, 0, 0.2)",
      },
    },
  },
  plugins: [],
};

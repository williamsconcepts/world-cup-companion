import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        pitch: {
          950: "#0A2E22", // deepest pitch shadow
          900: "#0B3D2E", // primary dark green
          700: "#1F7A4D", // turf green
          500: "#2FA968", // bright turf highlight
        },
        chalk: "#F5F2E8", // line-marking off-white
        ink: "#10161A", // near-black for text/dark sections
        gold: {
          500: "#E8B44C", // trophy gold, primary accent
          600: "#C9932E",
        },
        live: "#C1443D", // reserved strictly for "LIVE" indicators
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-scoreboard)", "monospace"],
      },
      backgroundImage: {
        "turf-lines": "repeating-linear-gradient(0deg, rgba(245,242,232,0.03) 0px, rgba(245,242,232,0.03) 2px, transparent 2px, transparent 40px)",
      },
    },
  },
  plugins: [],
};

export default config;

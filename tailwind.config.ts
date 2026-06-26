import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        pitch: {
          50: "#ecfdf5",
          500: "#10b981",
          700: "#047857",
          950: "#042f2e"
        },
        ink: "#0f172a"
      },
      boxShadow: {
        panel: "0 20px 50px rgba(15, 23, 42, 0.12)"
      }
    }
  },
  plugins: []
};

export default config;

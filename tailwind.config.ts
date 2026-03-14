import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "#00f2fe",
          foreground: "#000000",
        },
        secondary: {
          DEFAULT: "#4facfe",
          foreground: "#ffffff",
        },
        accent: {
          DEFAULT: "#7000ff",
          foreground: "#ffffff",
        },
        card: {
          DEFAULT: "rgba(10, 13, 22, 0.7)",
          foreground: "#ffffff",
          border: "rgba(255, 255, 255, 0.1)",
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "obsidian-gradient": "linear-gradient(135deg, #0a0d16 0%, #1a1e2e 100%)",
      },
      boxShadow: {
        "neon-cyan": "0 0 15px rgba(0, 242, 254, 0.4)",
        "neon-purple": "0 0 15px rgba(112, 0, 255, 0.4)",
        "glass": "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
      },
    },
  },
  plugins: [],
};
export default config;

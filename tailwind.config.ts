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
        forest: {
          900: "#18220f",
          800: "#283618", // Black Forest primary
          700: "#364820",
          600: "#445a28",
        },
        olive: {
          800: "#475029",
          700: "#606C38", // Olive Leaf secondary
          600: "#758344",
          500: "#8b9c51",
          100: "#e9ede0",
          50: "#f4f6f0",
        },
        clay: {
          600: "#c7863e",
          500: "#DDA15E", // Sunlit Clay highlight
          400: "#e4b47e",
          300: "#ecc79e",
          100: "#f8ece0",
          50: "#fdf8f4",
        },
        cornsilk: {
          500: "#FEFAE0", // Cornsilk background base
          400: "#fefcf0",
          300: "#fffef7",
          200: "#faf6d0",
          100: "#f2edbe",
        },
        copper: {
          800: "#8a4f1b",
          700: "#BC6C25", // Copperwood action accent
          600: "#cf7a2e",
          500: "#db8b43",
          100: "#f8ece2",
        },
        brand: {
          forest: "#283618",
          olive: "#606C38",
          clay: "#DDA15E",
          cornsilk: "#FEFAE0",
          copper: "#BC6C25",
        }
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          '"Segoe UI"',
          "Roboto",
          '"Helvetica Neue"',
          "Arial",
          "sans-serif",
        ],
        mono: [
          '"JetBrains Mono"',
          '"SFMono-Regular"',
          "Menlo",
          "Monaco",
          "Consolas",
          "monospace",
        ],
      },
      borderRadius: {
        sm: "4px",
        DEFAULT: "6px",
        md: "6px",
        lg: "8px",
      },
      boxShadow: {
        subtle: "0 1px 2px 0 rgba(40, 54, 24, 0.05)",
        card: "0 1px 3px 0 rgba(40, 54, 24, 0.08), 0 1px 2px -1px rgba(40, 54, 24, 0.08)",
        dropdown: "0 4px 6px -1px rgba(40, 54, 24, 0.1), 0 2px 4px -2px rgba(40, 54, 24, 0.1)",
      },
    },
  },
  plugins: [],
};

export default config;

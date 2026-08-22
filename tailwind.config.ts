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
        // Primary Slate Forest
        forest: {
          950: "#081610",
          900: "#0F291E", // Dark Slate Forest
          800: "#163E2E",
          700: "#1E4E3B",
          600: "#2B6851",
          500: "#3B856A",
          100: "#E6F4EE",
          50: "#F2F9F5",
        },
        // Secondary Technical Emerald
        emerald: {
          950: "#022c22",
          900: "#064e3b",
          800: "#065f46",
          700: "#047857",
          600: "#059669", // Primary brand emerald
          500: "#10b981",
          400: "#34d399",
          100: "#d1fae5",
          50: "#ecfdf5",
        },
        // Technical Amber / Copper
        amber: {
          900: "#78350f",
          800: "#92400e",
          700: "#b45309",
          600: "#d97706", // Amber action
          500: "#f59e0b",
          400: "#fbbf24",
          100: "#fef3c7",
          50: "#fffbeb",
        },
        // Slate neutrals for clean background and crisp hierarchy
        slate: {
          900: "#0f172a", // High contrast headings
          800: "#1e293b",
          700: "#334155", // High contrast body
          600: "#475569",
          500: "#64748b", // Accessible muted text
          400: "#94a3b8",
          300: "#cbd5e1",
          200: "#e2e8f0", // Clean precision border
          100: "#f1f5f9", // Subtle surface
          50: "#f8fafc",  // Modern canvas background
        },
        brand: {
          dark: "#0F291E",
          primary: "#163E2E",
          accent: "#059669",
          amber: "#D97706",
          canvas: "#F8FAFC",
          card: "#FFFFFF",
          border: "#E2E8F0",
        },
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          '"Segoe UI"',
          "Roboto",
          '"Inter"',
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
        md: "8px",
        lg: "10px",
        xl: "14px",
        "2xl": "18px",
      },
      boxShadow: {
        subtle: "0 1px 2px 0 rgba(15, 23, 42, 0.04)",
        card: "0 1px 3px 0 rgba(15, 23, 42, 0.06), 0 1px 2px -1px rgba(15, 23, 42, 0.04)",
        elevated: "0 4px 12px -2px rgba(15, 23, 42, 0.08), 0 2px 6px -2px rgba(15, 23, 42, 0.04)",
        dropdown: "0 10px 25px -3px rgba(15, 23, 42, 0.12), 0 4px 10px -4px rgba(15, 23, 42, 0.06)",
      },
    },
  },
  plugins: [],
};

export default config;

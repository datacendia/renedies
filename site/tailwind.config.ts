import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  darkMode: ["class", '[data-theme="apothecary"]'],
  theme: {
    extend: {
      colors: {
        // Semantic tokens driven by CSS vars (theme-aware).
        surface:   "rgb(var(--surface) / <alpha-value>)",
        elevated:  "rgb(var(--elevated) / <alpha-value>)",
        ink:       "rgb(var(--ink) / <alpha-value>)",
        "ink-soft":"rgb(var(--ink-soft) / <alpha-value>)",
        line:      "rgb(var(--line) / <alpha-value>)",
        accent:    "rgb(var(--accent) / <alpha-value>)",
        "accent-soft": "rgb(var(--accent-soft) / <alpha-value>)",
        ember:     "rgb(var(--ember) / <alpha-value>)",
        // Legacy brand palette (kept for existing components; maps to green Garden mode).
        brand: {
          50:  "#f4f9f4",
          100: "#e4f0e3",
          200: "#c9e1c8",
          300: "#9fc89d",
          400: "#6fa96c",
          500: "#4b8a48",
          600: "#376d35",
          700: "#2c562b",
          800: "#264525",
          900: "#1f3a1f"
        }
      },
      fontFamily: {
        serif:   ["Cormorant Garamond", "Georgia", "serif"],
        sans:    ["Inter", "system-ui", "sans-serif"],
        display: ["\"Fraunces\"", "Cormorant Garamond", "Georgia", "serif"]
      },
      boxShadow: {
        "glow-sm": "0 0 0 1px rgb(var(--accent) / 0.2), 0 4px 18px -6px rgb(var(--accent) / 0.35)",
        "glow":    "0 0 24px -4px rgb(var(--ember) / 0.55), 0 0 0 1px rgb(var(--ember) / 0.25)",
        "ambient": "0 1px 2px rgb(0 0 0 / 0.04), 0 8px 32px -12px rgb(0 0 0 / 0.12)"
      },
      backgroundImage: {
        "grain": "radial-gradient(rgb(var(--ink) / 0.035) 1px, transparent 1px)",
        "candlelight": "radial-gradient(60% 60% at 50% 0%, rgb(var(--ember) / 0.18), transparent 70%)"
      },
      animation: {
        "shimmer": "shimmer 2.4s linear infinite",
        "pulse-glow": "pulseGlow 2.8s ease-in-out infinite",
        "float": "float 6s ease-in-out infinite"
      },
      keyframes: {
        shimmer:   { "0%": { backgroundPosition: "-200% 0" }, "100%": { backgroundPosition: "200% 0" } },
        pulseGlow: { "0%,100%": { boxShadow: "0 0 0 0 rgb(var(--ember) / 0.35)" },
                     "50%":     { boxShadow: "0 0 0 14px rgb(var(--ember) / 0)" } },
        float:     { "0%,100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-6px)" } }
      }
    }
  },
  plugins: [typography]
};
export default config;

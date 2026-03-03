import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))"
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))"
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))"
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))"
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))"
        }
      },
      borderRadius: {
        lg: "1.25rem",
        md: "1rem",
        sm: "0.75rem"
      },
      fontFamily: {
        sans: ["var(--font-sans)"],
        serif: ["var(--font-serif)"]
      },
      boxShadow: {
        glow: "0 25px 80px rgba(15, 23, 42, 0.14)",
        inset: "inset 0 1px 0 rgba(255,255,255,0.2)"
      },
      backgroundImage: {
        "hero-mesh":
          "radial-gradient(circle at 14% 18%, rgba(192, 132, 252, 0.22), transparent 28%), radial-gradient(circle at 86% 0%, rgba(139, 92, 246, 0.18), transparent 24%), radial-gradient(circle at 50% 88%, rgba(244, 114, 182, 0.10), transparent 30%)"
      }
    }
  },
  plugins: [require("tailwindcss-animate")]
};

export default config;

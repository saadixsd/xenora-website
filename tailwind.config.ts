import type { Config } from "tailwindcss";
import daisyui from "daisyui";
import tailwindcssAnimate from "tailwindcss-animate";
import typography from "@tailwindcss/typography";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        sm: "1.25rem",
        lg: "2rem",
      },
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        // 'syne' kept as alias to Instrument Serif so legacy `font-syne` usages render the new typeface.
        syne: ['"Instrument Serif"', 'ui-serif', 'Georgia', 'serif'],
        serif: ['"Instrument Serif"', 'ui-serif', 'Georgia', 'serif'],
        'space-mono': ['"Space Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [daisyui, tailwindcssAnimate, typography],
  daisyui: {
    themes: [
      {
        xenora: {
          primary: "#10b981",
          "primary-content": "#04130d",
          secondary: "#1B1B20",
          "secondary-content": "#F2F2F0",
          accent: "#10b981",
          "accent-content": "#04130d",
          neutral: "#141418",
          "neutral-content": "#F2F2F0",
          "base-100": "#0B0B0E",
          "base-200": "#141418",
          "base-300": "#1B1B20",
          "base-content": "#F2F2F0",
          info: "#10b981",
          success: "#22c55e",
          warning: "#eab308",
          error: "#ef4444",
        },
      },
      {
        "xenora-light": {
          primary: "#0E8F6E",
          "primary-content": "#ffffff",
          secondary: "#F2F1ED",
          "secondary-content": "#18181B",
          accent: "#0E8F6E",
          "accent-content": "#ffffff",
          neutral: "#F2F1ED",
          "neutral-content": "#18181B",
          "base-100": "#FAFAF7",
          "base-200": "#F2F1ED",
          "base-300": "#E8E7E1",
          "base-content": "#18181B",
          info: "#0E8F6E",
          success: "#16a34a",
          warning: "#ca8a04",
          error: "#dc2626",
        },
      },
    ],
    darkTheme: "xenora",
    logs: false,
  },
} satisfies Config;

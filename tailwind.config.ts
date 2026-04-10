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
        syne: ['Syne', 'ui-sans-serif', 'system-ui', 'sans-serif'],
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
          primary: "#00D4FF",
          "primary-content": "#0A0A0F",
          secondary: "#1a1a2e",
          "secondary-content": "#f5f5f5",
          accent: "#7c3aed",
          "accent-content": "#f5f5f5",
          neutral: "#141420",
          "neutral-content": "#f5f5f5",
          "base-100": "#0A0A0F",
          "base-200": "#0e0e16",
          "base-300": "#16161f",
          "base-content": "#f5f5f5",
          info: "#00D4FF",
          success: "#22c55e",
          warning: "#eab308",
          error: "#ef4444",
        },
      },
      {
        "xenora-light": {
          primary: "#0EA5A4",
          "primary-content": "#ffffff",
          secondary: "#e8ecf6",
          "secondary-content": "#131722",
          accent: "#6e56cf",
          "accent-content": "#ffffff",
          neutral: "#f0f3fa",
          "neutral-content": "#141824",
          "base-100": "#f8fafd",
          "base-200": "#eef2f9",
          "base-300": "#e4e9f3",
          "base-content": "#141824",
          info: "#0EA5A4",
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

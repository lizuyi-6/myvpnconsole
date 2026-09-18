import type { Config } from "tailwindcss";

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "rgb(var(--background) / <alpha-value>)",
        surface: "rgb(var(--surface) / <alpha-value>)",
        elevated: "rgb(var(--elevated) / <alpha-value>)",
        border: "rgb(var(--border) / <alpha-value>)",
        foreground: "rgb(var(--foreground) / <alpha-value>)",
        muted: "rgb(var(--muted) / <alpha-value>)",
        subtle: "rgb(var(--subtle) / <alpha-value>)",
        primary: "rgb(var(--primary) / <alpha-value>)",
        "primary-foreground": "rgb(var(--primary-foreground) / <alpha-value>)",
        tint: "rgb(var(--tint) / <alpha-value>)",
        navy: "rgb(var(--navy) / <alpha-value>)",
        "navy-foreground": "rgb(var(--navy-foreground) / <alpha-value>)",
        "navy-muted": "rgb(var(--navy-muted) / <alpha-value>)",
        success: "rgb(var(--success) / <alpha-value>)",
        warning: "rgb(var(--warning) / <alpha-value>)",
        danger: "rgb(var(--danger) / <alpha-value>)",
      },
      boxShadow: {
        card: "0 1px 2px rgb(16 24 40 / 0.05), 0 8px 24px rgb(16 24 40 / 0.05)",
        panel:
          "0 1px 2px rgb(16 24 40 / 0.06), 0 12px 32px rgb(16 24 40 / 0.07)",
      },
      fontFamily: {
        sans: [
          '"Inter Variable"',
          "Inter",
          "system-ui",
          "-apple-system",
          '"Segoe UI"',
          // CJK fallbacks for the zh locale (system fonts, no webfont cost)
          '"PingFang SC"',
          '"Hiragino Sans GB"',
          '"Microsoft YaHei"',
          '"Noto Sans CJK SC"',
          "sans-serif",
        ],
      },
      maxWidth: {
        // Public site workspace — desktop-first, capped so 1920px doesn't stretch
        content: "1360px",
        // Console main workspace (after the 256px sidebar)
        workspace: "1400px",
        // Narrow reading column (legal, auth forms)
        article: "760px",
      },
      keyframes: {
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "content-in": {
          from: { opacity: "0", transform: "scale(0.98) translateY(4px)" },
          to: { opacity: "1", transform: "scale(1) translateY(0)" },
        },
        "sheet-in": {
          from: { transform: "translateX(-100%)" },
          to: { transform: "translateX(0)" },
        },
        /* Route-change transition — content rises gently into place */
        "page-in": {
          from: { opacity: "0", transform: "translateY(6px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        /* "Live" status ring — success dots only, killed by reduced-motion */
        "status-pulse": {
          "0%": { boxShadow: "0 0 0 0 rgb(var(--success) / 0.4)" },
          "70%": { boxShadow: "0 0 0 5px rgb(var(--success) / 0)" },
          "100%": { boxShadow: "0 0 0 0 rgb(var(--success) / 0)" },
        },
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
        "fade-in": "fade-in 180ms ease-out",
        "content-in": "content-in 200ms ease-out",
        "sheet-in": "sheet-in 220ms ease-out",
        "page-in": "page-in 240ms ease-out",
        "status-pulse": "status-pulse 2.4s ease-out infinite",
        "accordion-down": "accordion-down 200ms ease-out",
        "accordion-up": "accordion-up 200ms ease-out",
      },
    },
  },
  plugins: [],
} satisfies Config;

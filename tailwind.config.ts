import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // Machine voice — headings, UI labels, instrument readouts.
        display: ["var(--font-barlow)", "system-ui", "sans-serif"],
        // Reading voice — body copy.
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        // Data voice — every number that matters.
        mono: ["var(--font-jetbrains)", "ui-monospace", "monospace"],
        // Human voice — the guide's own words, used with restraint.
        serif: ["var(--font-fraunces)", "Georgia", "serif"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        // Headlight cone — used behind the hero.
        "headlight":
          "radial-gradient(60% 70% at 50% 0%, hsl(var(--primary) / 0.16) 0%, transparent 70%)",
      },
      borderRadius: {
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        full: "var(--radius-full)",
      },
      boxShadow: {
        // Overrides Tailwind's defaults so every `shadow-*` already in the
        // codebase is tinted by the theme instead of pure black — pure black
        // halos are invisible on the night road and muddy on midday.
        sm: "0 1px 2px -1px hsl(var(--shadow-tint) / 0.30), 0 1px 3px 0 hsl(var(--shadow-tint) / 0.22)",
        md: "0 4px 6px -1px hsl(var(--shadow-tint) / 0.34), 0 2px 4px -2px hsl(var(--shadow-tint) / 0.26)",
        lg: "0 10px 20px -4px hsl(var(--shadow-tint) / 0.40), 0 4px 8px -2px hsl(var(--shadow-tint) / 0.28)",
        xl: "0 24px 48px -12px hsl(var(--shadow-tint) / 0.50), 0 8px 16px -4px hsl(var(--shadow-tint) / 0.32)",
      },
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          dark: "hsl(var(--primary-dark))",
          light: "hsl(var(--primary-light))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        // Data colour: route lines, distances, telemetry. Separate job from
        // `primary` (signal/action) so the palette carries meaning.
        data: {
          DEFAULT: "hsl(var(--data))",
          foreground: "hsl(var(--data-foreground))",
        },
        ink: "hsl(var(--ink))",
        surface: "hsl(var(--surface))",
        hairline: "hsl(var(--hairline))",
        // Scrim for text over photography. Theme-constant by design.
        scrim: "hsl(var(--scrim))",
        "on-scrim": "hsl(var(--on-scrim))",
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
        },
        warning: {
          DEFAULT: "hsl(var(--warning))",
          foreground: "hsl(var(--warning-foreground))",
        },
        error: {
          DEFAULT: "hsl(var(--error))",
          foreground: "hsl(var(--error-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
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
        // Instrument powering on.
        sweep: {
          from: { transform: "rotate(-120deg)" },
          to: { transform: "rotate(var(--sweep-to, 120deg))" },
        },
        "readout-in": {
          from: { opacity: "0", transform: "translateY(6px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "rail-draw": {
          from: { transform: "scaleY(0)" },
          to: { transform: "scaleY(1)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        sweep: "sweep 900ms cubic-bezier(0.16, 1, 0.3, 1) both",
        "readout-in": "readout-in 420ms cubic-bezier(0.16, 1, 0.3, 1) both",
        "rail-draw": "rail-draw 600ms cubic-bezier(0.16, 1, 0.3, 1) both",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;

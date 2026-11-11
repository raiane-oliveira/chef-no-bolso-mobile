/** @type {import('tailwindcss').Config} */
const token = (name) => `hsl(var(--${name}) / <alpha-value>)`;
const brand = (name) => `var(--${name})`;

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: token("background"),
        foreground: token("foreground"),
        card: {
          DEFAULT: token("card"),
          foreground: token("card-foreground"),
        },
        popover: {
          DEFAULT: token("popover"),
          foreground: token("popover-foreground"),
        },
        primary: {
          DEFAULT: token("primary"),
          foreground: token("primary-foreground"),
        },
        secondary: {
          DEFAULT: token("secondary"),
          foreground: token("secondary-foreground"),
        },
        muted: {
          DEFAULT: token("muted"),
          foreground: token("muted-foreground"),
        },
        accent: {
          DEFAULT: token("accent"),
          foreground: token("accent-foreground"),
        },
        destructive: {
          DEFAULT: token("destructive"),
          foreground: token("destructive-foreground"),
        },
        border: token("border"),
        input: token("input"),
        ring: token("ring"),

        "sea-ink": { DEFAULT: brand("sea-ink"), soft: brand("sea-ink-soft") },
        lagoon: { DEFAULT: brand("lagoon"), deep: brand("lagoon-deep") },
        sand: brand("sand"),
        foam: brand("foam"),
        canvas: brand("bg-base"),
        surface: { DEFAULT: brand("surface"), strong: brand("surface-strong") },
        line: brand("line"),
        "inset-glint": brand("inset-glint"),
        "header-bg": brand("header-bg"),
        chip: { DEFAULT: brand("chip-bg"), line: brand("chip-line") },
        "link-hover": brand("link-bg-hover"),
        hero: { a: brand("hero-a"), b: brand("hero-b") },
      },
      borderColor: {
        DEFAULT: token("border"),
      },
      borderRadius: {
        sm: "6px",
        md: "8px",
        lg: "10px",
        xl: "14px",
      },
      fontFamily: {
        sans: ["Rubik_400Regular"],
        "rubik-light": ["Rubik_300Light"],
        "rubik-medium": ["Rubik_500Medium"],
        "rubik-semibold": ["Rubik_600SemiBold"],
        "rubik-bold": ["Rubik_700Bold"],
      },
      keyframes: {
        "rise-in": {
          from: { opacity: "0", transform: "translateY(12px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "rise-in": "rise-in 700ms cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [],
};

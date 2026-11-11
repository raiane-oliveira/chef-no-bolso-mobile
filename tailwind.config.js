/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "#FDFBF9",
        foreground: "#20100C",

        card: {
          DEFAULT: "#FDFBF9",
          foreground: "#20100C",
        },

        popover: {
          DEFAULT: "#FDFBF9",
          foreground: "#20100C",
        },

        primary: {
          DEFAULT: "#351B0E",
          foreground: "#F9F0E4",
        },

        secondary: {
          DEFAULT: "#EFE5D5",
          foreground: "#351B0E",
        },

        muted: {
          DEFAULT: "#EFE5D5",
          foreground: "#7D6255",
        },

        accent: {
          DEFAULT: "#E5D7BE",
          foreground: "#351B0E",
        },

        destructive: {
          DEFAULT: "#E6000D",
          foreground: "#E6000D",
        },

        border: "#E4D9CD",
        input: "#E1D5C5",
        ring: "#C8B9A5",

        "sea-ink": {
          DEFAULT: "#3B1F10",
          soft: "#6B4030",
        },

        lagoon: {
          DEFAULT: "#B85C38",
          deep: "#8C3E22",
        },

        sand: "#F0EBE3",
        foam: "#FAF7F3",

        base: "#F5EDE3",

        surface: {
          DEFAULT: "#FFFCF8BD",
          strong: "#FFFCF8EB",
        },

        line: "#3B1F1021",
        "inset-glint": "#FFF8F0D9",
        "header-bg": "#FFFAF5DB",

        chip: {
          DEFAULT: "#FFFCF8D1",
          line: "#4A67412E",
        },

        "link-hover": "#FFFCF8EB",

        hero: {
          a: "#B85C3847",
          b: "#4A67412E",
        },
      },

      borderColor: {
        DEFAULT: "#E4D9CD",
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

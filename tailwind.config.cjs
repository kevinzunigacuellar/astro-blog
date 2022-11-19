/** @type {import('tailwindcss').Config} */

const colors = require("tailwindcss/colors");
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,astro}"],
  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: {
            "code::before": {
              content: '""',
            },
            "code::after": {
              content: '""',
            },
            "p, li": {
              code: {
                backgroundColor: colors.neutral[800],
                padding: "0.250rem 0.4rem",
                borderRadius: "0.250rem",
                fontWeight: "400",
              },
            },
          },
        },
      },
      keyframes: {
        "move-bg": {
          to: {
            backgroundPosition: "400% 0",
          },
        },
      },
      animation: {
        "move-bg": "move-bg 8s infinite linear",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

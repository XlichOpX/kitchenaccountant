/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      keyframes: {
        slideCollapsibleDown: {
          "0%": { opacity: 0, height: 0 },
          "100%": {
            opacity: 1,
            height: "var(--radix-collapsible-content-height)",
          },
        },
        slideCollapsibleUp: {
          "0%": {
            height: "var(--radix-collapsible-content-height)",
          },
          "100%": {
            height: 0,
          },
        },
      },
      animation: {
        "slide-collapsible-down": "slideCollapsibleDown 100ms ease-out",
        "slide-collapsible-up": "slideCollapsibleUp 100ms ease-out",
      },
    },
  },
  plugins: [],
};

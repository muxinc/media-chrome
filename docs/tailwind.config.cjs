/** @type {import('tailwindcss').Config} */
const colors = require("tailwindcss/colors");

const fuchsia = { ...colors.fuchsia, 25: "#fefaff" };
const amber = { ...colors.amber, 225: "#FFE5C6" };

module.exports = {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        fuchsia: fuchsia,
        amber: amber,
        primary: fuchsia,
        secondary: amber,
      },
    },
    fontFamily: {
      mono: "'IBM Plex Mono', monospace",
    },
  },
  variants: {
    extend: {},
  },
	plugins: [],
}

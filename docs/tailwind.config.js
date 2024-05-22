/** @type {import('tailwindcss').Config} */
import colors from 'tailwindcss/colors';

const fuchsia = { ...colors.fuchsia, 25: '#fefaff' };
const amber = { ...colors.amber, 225: '#FFE5C6' };

export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: ['class', '.theme-dark'],
  theme: {
    extend: {
      spacing: {
        '0.5px': '0.5px',
        '1px': '1px',
        '2px': '2px',
      },
      colors: {
        fuchsia: fuchsia,
        amber: amber,
        primary: fuchsia,
        secondary: amber,
        putty: {
          light: '#F4F6F4',
          DEFAULT: '#e2e4dd',
          deep: '#d0d2c8',
        },
        white: '#ffffff',
        gray: {
          DEFAULT: '#e2e4dd',
          dark: '#565e67',
          light: '#adb9c6',
        },
        charcoal: '#242628',
        black: '#000000',
        orange: {
          neon: '#ff8e0a',
          DEFAULT: '#ff6100',
          dark: '#ba4300',
        },
        pink: {
          neon: '#fb68ec',
          DEFAULT: '#fa50b5',
          dark: '#b14886',
        },
        red: {
          neon: '#ff5c38',
          DEFAULT: '#ea3737',
          dark: '#ba1704',
        },
        yellow: {
          neon: '#ffdb08',
          DEFAULT: '#ffb200',
          dark: '#bd8209',
        },
        green: {
          neon: '#1be349',
          DEFAULT: '#00aa3c',
          dark: '#00802d',
          link: '#04752C',
          'link-dark': '#00AA3C',
        },
        blue: {
          neon: '#16a6ff',
          DEFAULT: '#0072e3',
          dark: '#004e9b',
          link: '#0C64BC',
          'link-dark': '#0091FF',
        },
        purple: {
          neon: '#cb75ff',
          DEFAULT: '#ac39f2',
          dark: '#7c32ab',
        },
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
};

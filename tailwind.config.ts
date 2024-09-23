import type { Config } from "tailwindcss";

const config: Config = {
    content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        nokia: ['VT323', 'monospace'],
      },
      backgroundImage: {
        'scanlines': 'repeating-linear-gradient(0deg, rgba(0, 255, 0, 0.03), rgba(0, 255, 0, 0.03) 1px, transparent 1px, transparent 2px)',
        'curvature': 'radial-gradient(circle at center, transparent 0%, rgba(0, 0, 0, 0.2) 100%)',
      },
      animation: {
        'spin-slow': 'spin-slow 0.5s linear infinite',
      },
      keyframes: {
        'spin-slow': {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;

import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        canvas: '#050609',
        panel: '#111419',
        panelAlt: '#1a1f26',
        lime: '#95d13f',
        limeDark: '#5e9320',
        mist: '#b8bec9',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['"IBM Plex Sans"', 'sans-serif'],
      },
      boxShadow: {
        panel: '0 10px 40px rgba(0, 0, 0, 0.28)',
      },
    },
  },
  plugins: [],
} satisfies Config;

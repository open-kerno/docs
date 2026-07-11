/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx,mdx}', './docs/**/*.{md,mdx}'],
  corePlugins: {
    preflight: false, // avoid conflicts with Docusaurus/Infima CSS reset
  },
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      colors: {
        okc: {
          black: '#000000',
          white: '#FFFFFF',
          electric: '#0F62FE',
          cyan: '#00D8F6',
          cobalt: '#003A8C',
        },
      },
      backgroundImage: {
        'gradient-ribbon': 'linear-gradient(135deg, #0F62FE 0%, #00D8F6 100%)',
      },
      boxShadow: {
        ribbon: '0 4px 15px -3px rgba(15, 98, 254, 0.4), 0 4px 6px -4px rgba(0, 216, 246, 0.4)',
        'ribbon-hover': '0 10px 25px -3px rgba(15, 98, 254, 0.6), 0 8px 10px -4px rgba(0, 216, 246, 0.5)',
        glow: '0 0 20px rgba(0, 58, 140, 0.6)',
        'glow-intense': '0 0 30px rgba(15, 98, 254, 0.4)',
      },
    },
  },
  plugins: [],
};

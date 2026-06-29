/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#080a0f',
        surface: '#0e1117',
        surface2: '#141820',
        surface3: '#1c2230',
        accent: '#4fffb0',
        accent2: '#00d4ff',
        accent3: '#7c6fff',
        text: '#e8edf5',
        text2: '#8a95a8',
        border: 'rgba(255,255,255,0.07)',
      },
      boxShadow: {
        glow: '0 0 30px rgba(79,255,176,0.12)',
      },
      fontFamily: {
        sans: ['Space Grotesk', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

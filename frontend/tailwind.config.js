/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        tp: {
          navy:   '#0B1D3A',
          blue:   '#00A8E8',
          blueDk: '#0077B6',
          blueLt: '#EAF6FD',
          teal:   '#00C8B4',
          slate:  '#1E3A5F',
          gold:   '#F59E0B',
        }
      },
      fontFamily: {
        sans:    ['DM Sans', 'sans-serif'],
        display: ['DM Serif Display', 'serif'],
      }
    }
  },
  plugins: []
};

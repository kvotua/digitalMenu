import plugin from 'tailwindcss/plugin';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      container: {
        padding:'20px',
        center: true,
      }
    },
  },
  plugins: [
    plugin(function({addUtilities}) {
      addUtilities({
        '.wrapper': {
          width: '100%',
          paddingTop: '120px'
        },
      })
    })
  ],
}


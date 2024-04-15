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
        padding:'10px',
        center: true,
        screens: {
          sm: '570px',
          md: '570px',
          lg: '570px',
          xl: '570px',
          '2xl': '1496px',
        },
      },
      fontFamily: {
        'sans': ['Roboto'],
      }
    },
  },
  plugins: [
    plugin(function({addUtilities}) {
      addUtilities({
        // '.wrapper': {
        //   width: '100%',
        //   paddingTop: '120px'
        // },
      })
    })
  ],
}


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
          sm: '670px',
          md: '670px',
          lg: '670px',
          xl: '670px',
          '2xl': '1496px',
        },
        
      },
      fontFamily: {
        'sans': ['Roboto'],
      },
      backgroundColor: {
        'black': '#111111', // Добавляем кастомный цвет фона
      },
      textColor: {
        'white': '#ffffff', // Добавляем кастомный цвет текста
      },
      
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


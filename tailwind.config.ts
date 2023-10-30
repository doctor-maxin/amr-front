/** @type {import('tailwindcss').Config} */
import typography from '@tailwindcss/typography'

export default {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./nuxt.config.{js,ts}",
    "./app.vue",
    "./error.vue",
  ],
  theme: {
    fontFamily: {
      sans: ['Montserrat', 'sans-serif'],
      serif: ['Montserrat', 'serif']
    },

    extend: {
      screens: {
        'lg': '1025px',
      },
      keyframes:
      {
        'menu-down': {
          '0%': {
            opacity: 0,
            transform: 'translateY(-20%)'
          },
          '100%': {
            opacity: 1,
            transform: 'translateY(0%)'
          },
        }
      },
      animation: {
        'menu-down': 'menu-down 0.25s ease-in'
      },
      textColor: '#33363C',
      borderRadius: {
        btn: '4.06rem'
      },
      height: {
        'header': '5.3125rem',
        'mobile-header': '3.875rem'
      },
      spacing: {
        15: '3.75rem'
      },
      colors: {
        accent: {
          100: 'hsl(273, 68%, 85%)',
          200: 'hsl(273, 68%, 59%)',
          300: 'hsla(273, 66%, 56%, 1)',
          400: 'hsl(270, 73%, 35%)',
          700: 'hsl(271, 85%, 23%)'
        },
        white: 'white',
        'system-black': {
          900: 'hsl(220, 8%, 16%)', // #26282D,
          950: 'hsl(223, 8%, 16%)', // #26282D,
          600: 'hsla(0, 0%, 32%, 0.4)', // #51515166
        },
        'black-30': 'hsla(0, 0%, 0%, 0.3)',
        'system-gray': {
          DEFAULT: 'hsl(0, 0%, 90%)', // #e6e6e6
          400: 'hsl(0, 0%, 21.2%)',// #F1F1F1
          500: 'hsl(0, 0%, 95%)',// #F1F1F1
          600: 'hsl(0, 0%, 85%)', // #D9D9D9
          700: 'hsl(0, 0%, 20%)',
          800: 'hsl(220, 8%, 22%)', // #33363C,
          900: 'hsl(0, 0%, 40%)' // #656565,
        }
      }
    },
  },
  plugins: [
    typography
  ],
};


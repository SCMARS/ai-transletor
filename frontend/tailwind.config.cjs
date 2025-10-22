const { fontFamily } = require('tailwindcss/defaultTheme');

module.exports = {
  darkMode: ['class'],
  content: ['index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          light: '#E8F4FF',
          DEFAULT: '#4C9AFF',
          dark: '#1A73E8'
        }
      },
      boxShadow: {
        glass: '0 20px 45px -15px rgba(76, 154, 255, 0.35)'
      },
      borderRadius: {
        xl: '1.25rem'
      },
      fontFamily: {
        sans: ['Inter', ...fontFamily.sans]
      }
    }
  }
};

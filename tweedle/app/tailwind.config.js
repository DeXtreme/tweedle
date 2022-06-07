const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        "varela" : "Varela Round",
        "sans" : ["Poppins", ...defaultTheme.fontFamily.sans]
      },
      colors: {
        "light-blue": "#5FB1FE",
        "deep-blue": "#0074DF",
        "accent": "#353637"
      }
    }
  },
  plugins: [],
}

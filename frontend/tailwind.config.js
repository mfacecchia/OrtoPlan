/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    'views/**/*.{ejs,html}',
    'src/*.js',
    'public/script/*.js'
  ],
  theme: {
    extend: {}
  },
  plugins: [require("daisyui")]
};
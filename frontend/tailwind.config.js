/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    'views/**/*.{ejs,html}',
    'src/*.js',
    'public/script/*.js'
  ],
  daisyui: {
    themes: [
      {
        ortoPlan: {
          "primary": "#7FBA52",
                  
          "secondary": "#B2D697",
                  
          "accent": "#634E43",
                  
          "neutral": "#808080",
                  
          "base-100": "#FFFFFF",
                  
          "info": "#4F6BCE",
                  
          "success": "#28A34C",
                  
          "warning": "#D2D551",
                  
          "error": "#CE4F4F",
        },
      },
    ]
  },
  theme: {
    extend: {}
  },
  plugins: [require("daisyui")]
};
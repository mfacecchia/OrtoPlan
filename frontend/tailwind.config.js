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
    extend: {
      backgroundImage: {
        'navbar': 'url("../assets/icons/navbar.webp")',
        'footer': 'url("../assets/icons/footer.webp")',
        'defaultPlantation': 'url("../assets/icons/plantation.webp")',
        'defaultPlant': 'url("../assets/icons/plant.webp")'
      },
      fontFamily: {
        "sans": ["AdobeClean", "ui-sans-serif", "system-ui", "sans-serif", "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"]
      },
      animation: {
        'showHide': 'showHideAnim 2s ease-in-out infinite alternate'
      },
      keyframes: {
        'showHideAnim': {
          '0%, 30%': {
            transform: 'scaleX(0);'
          },
          '80%': {
            transform: 'scaleX(100%);'
          }
        }
      }
    },
  },
  plugins: [require("daisyui")]
};
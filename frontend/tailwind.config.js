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
        'showHide': 'showHideAnim 2s ease-in-out infinite alternate',
        'disappear': 'disappearAnim 3s ease-in-out forwards'
      },
      keyframes: {
        'showHideAnim': {
          '0%, 30%': {
            transform: 'scaleX(0);'
          },
          '80%': {
            transform: 'scaleX(100%);'
          }
        },
        'disappearAnim': {
          '90%': {
            opacity: 100
          },
          '100%': {
            opacity: 0,
            visibility: 'hidden'
          }
        }
      },
      boxShadow: {
        't-sm': '0 -1px 2px 0 rgba(0, 0, 0, 0.05)',
        't-md': '0 -4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        't-lg': '0 -10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        't-xl': '0 -20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        't-2xl': '0 -25px 50px -12px rgba(0, 0, 0, 0.25)',
        't-3xl': '0 -35px 60px -15px rgba(0, 0, 0, 0.3)',
      },
    },
  },
  plugins: [require("daisyui")]
};
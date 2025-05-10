// tailwind.config.js
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      animation: {
        'bubble-move': 'bubbleFloat 10s ease-in-out infinite',
        'pulse-slow': 'pulse 4s infinite',
        "fade-in": "fadeIn 1.2s ease-out forwards",
        "slide-in-up": "slideInUp 1s ease-out forwards",
        float: "float 6s ease-in-out infinite",
        'delay-[3s]': 'float 6s ease-in-out infinite 3s',
        'delay-[4s]': 'float 6s ease-in-out infinite 4s',
        'delay-[5s]': 'float 6s ease-in-out infinite 5s',
        'delay-[6s]': 'float 6s ease-in-out infinite 6s',
        gradient: 'gradientMove 4s ease infinite',
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        bubbleFloat: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-30px)' },
          },
        fadeIn: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
        slideInUp: {
          "0%": { opacity: 0, transform: "translateY(30px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
      },
      fontFamily: {
        sans: [
          "Sora",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
          '"Apple Color Emoji"',
          '"Segoe UI Emoji"',
          '"Segoe UI Symbol"',
          '"Noto Color Emoji"',
        ],
      },
    },
  },
  plugins: [
    require('tailwind-scrollbar-hide'),
  ],
  };

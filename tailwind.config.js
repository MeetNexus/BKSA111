/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bk-red': '#eee9da',
        'bk-yellow': '#FFC72C',
        'bk-brown': '#522D24',
        'bk-beige': '#F5E1A4',
        'bk-white': '#FFFFFF',
      },
      fontFamily: {
        flame: ['Flame', 'sans-serif'],
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        slideIn: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        slideOut: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-100%)' },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        slideIn: 'slideIn 0.3s ease-out',
        slideOut: 'slideOut 0.3s ease-out',
      },
    },
  },
  plugins: [
    require('tailwindcss-animate')
  ],
}
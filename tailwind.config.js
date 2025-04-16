/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        'custom-orange': '#ed7c1a',
        'custom-black': '#1e1e1e',
        'custom-brown': '#7c5a3b',
        'custom-orangeBold': '#eb6317',
        'custom-orangethrow': '#f8841b',
        'custom-gray': '#c8c8c8',
      },
      
    },
  },

  plugins: [],
}


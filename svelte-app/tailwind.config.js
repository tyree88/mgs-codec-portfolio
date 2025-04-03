/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        // Metal Gear Solid 2 codec color palette
        "codec-dark": "#0f380f",  // Dark green background
        "codec-mid": "#306230",   // Mid green for highlights
        "codec-light": "#8bac0f", // Light green for text
        "codec-highlight": "#9bbc0f", // Brighter green for highlights
      },
      fontFamily: {
        'mono': ['VT323', 'monospace'],
      },
    }
  },
  plugins: []
};
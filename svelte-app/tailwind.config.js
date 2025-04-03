/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        // Metal Gear Solid 2 codec color palette (authentic colors from the game)
        "codec-dark": "#0f1e0f",      // Dark green background
        "codec-darker": "#071207",    // Darker green for shadows
        "codec-mid": "#8bac0f",       // Mid green (the primary MGS codec green)
        "codec-light": "#b5d44a",     // Light green for text
        "codec-highlight": "#eaff4c",  // Bright yellow-green for highlights
      },
      fontFamily: {
        'mono': ['VT323', 'monospace'],
      },
      animation: {
        'blink': 'blink 2s steps(2) infinite',
        'flicker': 'flicker 5s linear infinite',
        'static': 'static 0.5s steps(3) infinite',
        'scanline': 'scanline 8s linear infinite',
        'codec-ring': 'codec-ring 1s ease-in-out infinite',
        'incoming-call': 'incoming-call 0.8s ease-in-out infinite',
        'frequency-scan': 'frequency-scan 3s linear infinite',
        'typewriter': 'typewriter 3s steps(40) 1s forwards',
      },
      keyframes: {
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.3' },
        },
        flicker: {
          '0%, 100%': { opacity: '0.97' },
          '33%': { opacity: '0.95' },
          '66%': { opacity: '0.98' },
        },
        'incoming-call': {
          '0%, 100%': { borderColor: '#8bac0f' },
          '50%': { borderColor: '#eaff4c' },
        },
        'codec-ring': {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.7' },
          '50%': { transform: 'scale(1.1)', opacity: '1' },
        },
      },
      backgroundImage: {
        'crt-overlay': 'radial-gradient(ellipse at center, transparent 50%, rgba(15, 56, 15, 0.15) 100%)',
        'static-noise': 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\' opacity=\'0.05\'/%3E%3C/svg%3E")',
      },
    }
  },
  plugins: []
};
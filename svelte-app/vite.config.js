import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte()],
  resolve: {
    alias: {
      '@assets': path.resolve('./src/assets'),
      '@components': path.resolve('./src/lib/components'),
      '@lib': path.resolve('./src/lib')
    }
  },
  server: {
    hmr: {
      // Ensure WebSocket connectivity works through the proxy
      protocol: 'ws',
      host: '0.0.0.0',
      port: 5173,
      clientPort: 5000, // This helps with proxied connections
    },
    cors: true,
    strictPort: true,
    watch: {
      usePolling: true, // Helps with some environments where file watching is unreliable
    }
  }
});
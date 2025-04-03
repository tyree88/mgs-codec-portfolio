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
      // Enhance WebSocket connectivity through the proxy
      protocol: 'ws',
      host: '0.0.0.0',
      port: 5173,
      clientPort: 5000, // For proxied connections
      path: '/ws', // Match our proxy path
      timeout: 60000, // Longer timeout
    },
    cors: {
      origin: '*', // Allow all origins for development
    },
    strictPort: true,
    port: 5173,
    host: '0.0.0.0',
    fs: {
      strict: false, // Allow serving files from outside of root directory
      allow: ['..'], // Allow serving from parent directory
    },
    watch: {
      usePolling: true, // Better file watching reliability
      interval: 1000, // Polling interval
    }
  }
});
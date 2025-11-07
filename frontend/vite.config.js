import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    watch: {
      usePolling: true, // Enable polling for Docker on Windows
      interval: 1000,   // Check for changes every second
    },
    host: true, // Allow external connections
    proxy: {
      '/api': {
        target: 'http://backend:5000', // Use Docker service name
        changeOrigin: true
      }
    }
  }
});


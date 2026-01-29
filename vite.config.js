// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Put all node_modules into a "vendor" chunk
          vendor: ['react', 'react-dom', 'react-router-dom'],
        },
      },
    },
  },
});

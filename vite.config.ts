import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: './',
  plugins: [react()],
  build: {
    target: 'esnext',
    minify: false,
    sourcemap: false,
    chunkSizeWarningLimit: 2500,
    rollupOptions: {
      maxParallelFileOps: 1,
      output: {
        manualChunks(id) {
          if (id.includes('three')) return 'three';
          if (id.includes('recharts')) return 'charts';
          if (id.includes('react')) return 'vendor';
        }
      }
    }
  },
  server: {
    port: 3000,
    open: false
  }
});

import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

// Phase 1: Core 3D Infrastructure
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@/components': path.resolve(__dirname, './src/components'),
      '@/hooks': path.resolve(__dirname, './src/hooks'),
      '@/utils': path.resolve(__dirname, './src/utils'),
      '@/types': path.resolve(__dirname, './src/types'),
    },
  },
  server: {
    port: 5173,
    open: true,
    cors: true,
  },
  build: {
    outDir: 'dist-phase-1',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          three: ['three', '@react-three/fiber'],
        },
      },
    },
  },
  define: {
    __DEPLOYMENT_PHASE__: JSON.stringify('phase-1'),
    __FEATURES_ENABLED__: JSON.stringify([
      'infrastructure',
      'webgl-detection',
      'basic-rendering',
      'error-handling',
    ]),
  },
});

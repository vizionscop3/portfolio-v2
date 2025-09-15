import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

// Advanced minification and optimization config
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@/components': path.resolve(__dirname, './src/components'),
      '@/pages': path.resolve(__dirname, './src/pages'),
      '@/hooks': path.resolve(__dirname, './src/hooks'),
      '@/utils': path.resolve(__dirname, './src/utils'),
      '@/types': path.resolve(__dirname, './src/types'),
      '@/styles': path.resolve(__dirname, './src/styles'),
    },
    dedupe: ['react', 'react-dom'], // Ensure single React instance
  },
  server: {
    port: 5173,
    open: true,
    cors: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: true, // Enable source maps for debugging
    minify: 'esbuild', // Use esbuild for faster, less aggressive minification
    target: 'es2020',
    chunkSizeWarningLimit: 2000, // Reduce chunk size warnings
    rollupOptions: {
      treeshake: true, // Enable tree shaking
      output: {
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
        manualChunks: {
          // Split vendor libraries for better caching - keep React libs together
          'react-vendor': [
            'react',
            'react-dom',
            '@react-three/fiber',
            '@react-three/drei',
          ],
          'three-vendor': ['three'],
          'framer-vendor': ['framer-motion'],
          utils: ['zustand', 'lucide-react'],
        },
      },
    },
    // Removed aggressive terser options to prevent potential issues
  },
  preview: {
    port: 4173,
    open: true,
  },
  esbuild: {
    // Less aggressive esbuild optimizations to prevent issues
    legalComments: 'none', // Remove legal comments
    minifyIdentifiers: true,
    minifySyntax: true,
    minifyWhitespace: true,
    treeShaking: true,
  },
});

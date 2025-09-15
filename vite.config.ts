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
    sourcemap: false, // Disable source maps for production
    minify: 'terser', // Use Terser for aggressive minification
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
    terserOptions: {
      // Advanced Terser minification settings
      compress: {
        drop_console: false, // Keep console.log statements for debugging
        drop_debugger: true, // Remove debugger statements
        pure_funcs: [], // Keep console methods for debugging
        reduce_vars: true, // Optimize variable usage
        reduce_funcs: true, // Optimize function calls
        passes: 3, // Multiple optimization passes
        unsafe: true, // Enable unsafe optimizations
        unsafe_comps: true, // Unsafe comparisons
        unsafe_math: true, // Unsafe math optimizations
        hoist_funs: true, // Hoist function declarations
        keep_fargs: false, // Remove unused function arguments
        toplevel: true, // Optimize top-level scope
      },
      mangle: {
        // Aggressive variable name mangling
        toplevel: true,
        safari10: true,
        properties: {
          regex: /^_/, // Mangle properties starting with underscore
        },
      },
      format: {
        comments: false, // Remove all comments
        ecma: 2020,
      },
    },
  },
  preview: {
    port: 4173,
    open: true,
  },
  esbuild: {
    // Additional esbuild optimizations
    drop: ['console', 'debugger'], // Remove console and debugger statements
    legalComments: 'none', // Remove legal comments
    minifyIdentifiers: true,
    minifySyntax: true,
    minifyWhitespace: true,
    treeShaking: true,
  },
});

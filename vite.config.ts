/// <reference types="vitest" />
/// <reference types="vite/client" />

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

import { fileURLToPath } from 'node:url';
import path from 'node:path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  // SCSS CSS Support
  css: {
    modules: {
      localsConvention: 'dashes',
    },

    preprocessorOptions: {
      scss: {
        additionalData: `
        @use "@styles/abstracts/" as abst;
        @use "@styles/abstracts/mixins" as mix;
        `,
      },
    },
    postcss: {
      plugins: [
        require('autoprefixer'),
        ...(process.env.NODE_ENV === 'production'
          ? [require('cssnano')({ preset: 'default' })]
          : []),
      ],
    },
  },

  // Path Resolver
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@assets': path.resolve(__dirname, './src/assets'),
      '@components': path.resolve(__dirname, './src/components'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@helper': path.resolve(__dirname, './src/helper'),
      '@types': path.resolve(__dirname, './src/types'),
    },
  },

  // Build config
  build: {
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
      format: {
        comments: false,
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
        },
      },
    },
  },

  // Vitest config
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    css: true,
  },

  // Server Config (Will use Laravel)
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});

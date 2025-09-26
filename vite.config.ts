/// <reference types="vitest" />
/// <reference types="vite/client" />

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

import { fileURLToPath } from 'node:url';
import path from 'node:path';
import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';
import { ASSET_CATEGORIES } from './src/constants/assets';
import { setupPlugins } from '@responsive-image/vite-plugin';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),

    ...setupPlugins({
      include: /^[^?]+\.(jpg|jpeg|png|webp|avif).?responsive.*$/,
      w: [500, 800, 1024, 1600, 2160],
      format: ['original', 'webp'],
      quality: 85,
      lqip: {
        type: 'inline',
        targetPixels: 120,
      },
      name: '[name]-[width]w.[ext]',
    }),
  ],

  // SCSS CSS Support
  css: {
    modules: {
      localsConvention: 'dashes',
    },

    preprocessorOptions: {
      scss: {
        additionalData: `
        @use '@assets/styles/abstracts/' as abst;
        @use '@assets/styles/abstracts/mixins' as mix;
        `,
      },
    },
    postcss: {
      plugins: [
        autoprefixer,
        ...(process.env.NODE_ENV === 'production'
          ? [cssnano({ preset: 'default' })]
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
    cssMinify: true,
    sourcemap: false,
    manifest: true,
    chunkSizeWarningLimit: 1600,
    emptyOutDir: true,
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
        compact: true,
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: assetInfo => {
          const ext = assetInfo.name?.split('.').pop()?.toLowerCase();
          if (!ext) return 'assets/misc/[name]-[hash][extname]';

          const category =
            Object.entries(ASSET_CATEGORIES).find(([_, exts]) =>
              exts.includes(ext)
            )?.[0] || 'misc';

          return `assets/${category}/[name]-[hash][extname]`;
        },
        manualChunks: id => {
          if (id.includes('node_modules')) {
            const libs = [
              'react',
              'react-dom',
              'react-router',
              '@dr.pogodin/react-helmet',
              '@responsive-image/react',
            ];
            const match = libs.find(lib => id.includes(`/${lib}/`));
            return match ? `vendor-${match}-core` : 'vendor-other';
          }
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
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});

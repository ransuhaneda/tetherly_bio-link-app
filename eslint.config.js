import eslint from '@eslint/js';
import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import { defineConfig } from 'eslint/config';
import { createTypeScriptImportResolver } from 'eslint-import-resolver-typescript';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import importX from 'eslint-plugin-import-x';
import react from 'eslint-plugin-react';

export default defineConfig([
  {
    ignores: [
      'node_modules/',
      'dist/',
      'build/',
      'docs/',
      'public/',
      'coverage/',
      '.env',
      '*.config.js',
      '*.config.ts',
    ],
  },
  eslint.configs.recommended,
  tseslint.configs.recommended,
  eslintPluginPrettierRecommended,
  importX.flatConfigs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    settings: {
      react: { version: 'detect' },
      'import-x/resolver-next': [
        createTypeScriptImportResolver({
          alwaysTryTypes: true,
          project: './tsconfig.json',
        }),
      ],
    },
    rules: {
      'import-x/first': 'error',
      'import-x/order': [
        'error',
        { alphabetize: { order: 'asc' }, 'newlines-between': 'always' },
      ],
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
    },
    // Spread recommended flatConfigs if available from plugins
    ...reactHooks.flatConfigs?.recommended,
    ...reactRefresh.flatConfigs?.vite,
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
  },
]);

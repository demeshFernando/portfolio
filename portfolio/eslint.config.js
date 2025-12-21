import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'
import react from 'eslint-plugin-react'
import prettierConfig from 'eslint-plugin-prettier/recommended'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      react,
      prettier: prettierConfig.plugins.prettier,
    },
    rules: {
      'react/jsx-uses-react': 'error',
      'react/jsx-uses-vars': 'error',

      '@typescript-eslint/no-explicit-any': 'warn',

      'no-console': 'warn',
      'no-debugger': 'warn',
      'no-unused-vars': 'off',
      'prefer-const': 'warn',
      'no-trailing-spaces': 'error',
      'camelcase': ['error', { properties: 'always' }],
      'quotes': ['error', 'single'],
      'semi': ['error', 'always'],
      'no-multiple-empty-lines': ['error', { max: 1 }],
    },
  },
])

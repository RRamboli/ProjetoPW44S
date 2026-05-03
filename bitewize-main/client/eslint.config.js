import { defineConfig } from 'eslint/config'
import tsParser from '@typescript-eslint/parser'

export default defineConfig({
  ignores: ['dist'],
  languageOptions: {
    parser: tsParser,
    parserOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      ecmaFeatures: { jsx: true },
    },
  },
  plugins: {},
  rules: {
    '@typescript-eslint/no-explicit-any': 'off',
  },
})

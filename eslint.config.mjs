import js from '@eslint/js';
import nextPlugin from '@next/eslint-plugin-next';
import tseslint from 'typescript-eslint';
import importPlugin from 'eslint-plugin-import';
import unusedImports from 'eslint-plugin-unused-imports';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import prettier from 'eslint-config-prettier';

export default [
  // игноры
  {
    ignores: ['.next/**', 'node_modules/**', 'out/**', 'dist/**', 'coverage/**'],
  },

  js.configs.recommended,

  // typed TS rules — только ts/tsx
  ...tseslint.configs.recommendedTypeChecked.map((c) => ({
    ...c,
    files: ['**/*.{ts,tsx}'],
  })),

  // где брать типы
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },

  // ✅ правила/плагины для TS/TSX (тут регистрируем @typescript-eslint)
  {
    files: ['**/*.{ts,tsx}'],
    plugins: {
      '@typescript-eslint': tseslint.plugin,
      '@next/next': nextPlugin,
      import: importPlugin,
      'unused-imports': unusedImports,
      'jsx-a11y': jsxA11y,
    },
    rules: {
      ...nextPlugin.configs['core-web-vitals'].rules,

      '@typescript-eslint/consistent-type-imports': 'error',

      'import/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index', 'type'],
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],

      'unused-imports/no-unused-imports': 'error',
    },
  },

  prettier,
];

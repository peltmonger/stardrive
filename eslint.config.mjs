import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettierRecommended from 'eslint-plugin-prettier/recommended';
import regexpEslint from 'eslint-plugin-regexp';
import pluginSecurity from 'eslint-plugin-security';

export default [
  // general ignores
  {
    ignores: ['**/*.d.ts', '**/*.min.*', 'dist/', 'demo/', 'scripts/', 'node_modules/', '.github/', '.ai/'],
  },
  // general rules
  js.configs.recommended,
  ...tseslint.configs.recommended,
  regexpEslint.configs['flat/recommended'],
  prettierRecommended,
  pluginSecurity.configs.recommended,
  // overrides
  {
    files: ['**/*.{js,mjs,cjs,ts}'],
    rules: {
      'prettier/prettier': 'error',
      'no-mixed-spaces-and-tabs': ['error', 'smart-tabs'],
      'no-undef': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
    },
  },
  {
    files: ['**/*.{js,mjs,cjs}'],
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
];

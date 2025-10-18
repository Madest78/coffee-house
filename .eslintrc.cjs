module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  rules: {
    '@typescript-eslint/no-explicit-any': 'error',
    'no-unused-vars': 'warn',
    'no-console': 'off',
  },
  overrides: [
    {
      files: ['*.ts', '*.mts', '*.cts'],
      parser: '@typescript-eslint/parser',
      rules: {
        '@typescript-eslint/no-unused-vars': ['warn'],
      },
    },
    {
      files: ['*.js', '*.mjs', '*.cjs'],
      rules: {
        'no-unused-vars': ['warn'],
      },
    },
  ],
};

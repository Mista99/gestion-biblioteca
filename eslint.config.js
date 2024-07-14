// eslint.config.js
module.exports = {
  env: {
    node: true,
    es2020: true
  },
  extends: 'eslint:recommended',
  parserOptions: {
    ecmaVersion: 12
  },
  rules: {
    'no-console': 'warn',
    'semi': ['error', 'always']
  }
};

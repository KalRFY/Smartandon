module.exports = {
  root: true,
  env: {
    node: true,
    es2021: true,
  },
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: "module",
  },
  plugins: [],
  extends: [],
  rules: {
    "security/detect-non-literal-require": "off",
    "import/no-dynamic-require": "off",
    "import/no-extraneous-dependencies": "off",
    "import/order": "off",
    "prettier/prettier": "off",
    "no-unused-vars": "off",
    "no-console": "off",
    "camelcase": "off",
    "no-empty": "off",
  },
};
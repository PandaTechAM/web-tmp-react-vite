module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "prettier",
    "plugin:react-hooks/recommended",
    "plugin:@typescript-eslint/recommended",
  ],
  ignorePatterns: ["dist", ".eslintrc.cjs"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: "module",
  },
  plugins: [
    "react",
    "import",
    "@typescript-eslint",
    "react-hooks",
    "react-refresh",
  ],
  rules: {
    "no-nested-ternary": "error",
    "react/jsx-uses-react": "off",
    "react/react-in-jsx-scope": "off",
    "react/display-name": "off",
    "react/prop-types": "off",
    "no-debugger": "warn",
    "react/jsx-uses-vars": "warn",
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
    "no-undef": "off",
    "react/no-children-prop": "off",
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "off",
    "react/no-array-index-key": "warn",
    "no-constant-condition": "warn",
    "no-unsafe-optional-chaining": "warn",
    "no-extra-boolean-cast": "off",
    "react/jsx-key": "error",
    "react-refresh/only-export-components": [
      "warn",
      { allowConstantExport: true },
    ],
  },
  settings: {
    react: {
      version: "detect",
    },
  },
};

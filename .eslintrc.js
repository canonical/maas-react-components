const path = require("path");

module.exports = {
  env: {
    browser: true,
    node: true,
    es2021: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:import/typescript",
    "plugin:jsx-a11y/recommended",
    "prettier",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: [
    "@typescript-eslint",
    "react",
    "jsx-a11y",
    "react-hooks",
    "unused-imports",
    "no-relative-import-paths",
    "prettier",
  ],
  settings: {
    "import/resolver": {
      typescript: {
        alias: { "@": path.resolve(__dirname, "src") },
      },
    },
    react: {
      version: "detect",
    },
  },
  rules: {
    "react/react-in-jsx-scope": "off",
    "no-unused-vars": "off",
    "unused-imports/no-unused-imports": "error",
    "@typescript-eslint/no-unused-vars": "off",
    "unused-imports/no-unused-vars": [
      "warn",
      {
        vars: "all",
        varsIgnorePattern: "^_",
        args: "after-used",
        argsIgnorePattern: "^_",
      },
    ],
    "no-restricted-syntax": [
      "error",
      {
        selector: "TSEnumDeclaration",
        message: "Avoid enums, use const or string literal instead",
      },
    ],
    "import/order": [
      "error",
      {
        pathGroups: [
          {
            pattern: "react",
            group: "external",
            position: "before",
          },
          {
            pattern: "@/",
            group: "internal",
          },
        ],
        pathGroupsExcludedImportTypes: ["react"],
        "newlines-between": "always",
        alphabetize: {
          order: "asc",
        },
      },
    ],
    "no-relative-import-paths/no-relative-import-paths": [
      "warn",
      { allowSameFolder: true, rootDir: "src", prefix: "@" },
    ],
  },
  overrides: [
    {
      files: [".eslintrc.js"],
      rules: {
        "@typescript-eslint/no-var-requires": "off",
      },
    },
  ],
};

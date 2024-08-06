const prettierBaseConfig = require("./prettierrc.config.js");

const getPrettierConfig = () => {
  const { ...prettierConfig } = prettierBaseConfig;
  return prettierConfig;
};

const getDefaultIgnorePatterns = () => {
  return [`**/${"node"}_modules}`, "**/.cache", "build", "dist"];
};

// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require("path");

/** @type {import("eslint").Linter.Config} */
const config = {
  overrides: [
    {
      extends: [
        "plugin:@typescript-eslint/recommended-requiring-type-checking",
        "plugin:prettier/recommended", // 添加这一行来集成 Prettier 和 ESLint
      ],
      files: ["*.ts", "*.tsx"],
      parserOptions: {
        project: path.join(__dirname, "tsconfig.json"),
      },
      rules: {
        "@typescript-eslint/no-misused-promises": "off",
        "@typescript-eslint/no-unsafe-call": "off",
        "@typescript-eslint/no-unsafe-member-access": "off",
        "@typescript-eslint/no-unsafe-assignment": "off",
        "@typescript-eslint/no-extra-non-null-assertion": "off",
      },
    },
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: path.join(__dirname, "tsconfig.json"),
  },
  ignorePatterns: ["**/*.md"],
  plugins: [
    "turbo",
    "@typescript-eslint",
    "simple-import-sort",
    "unused-imports",
  ],
  extends: ["next/core-web-vitals", "plugin:@typescript-eslint/recommended"],
  rules: {
    "@typescript-eslint/consistent-type-imports": [
      "warn",
      {
        prefer: "type-imports",
        fixStyle: "inline-type-imports",
      },
    ],
    "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],

    "simple-import-sort/imports": "warn",
    "simple-import-sort/exports": "warn",
    "unused-imports/no-unused-imports": "warn",
    "prettier/prettier": ["error", { ...getPrettierConfig() }],
  },
};

module.exports = config;

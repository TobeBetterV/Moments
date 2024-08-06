/**
 * @type {import('prettier').Config}
 */
module.exports = {
  singleQuote: false,
  semi: true,
  tabWidth: 2,
  bracketSpacing: true,
  trailingComma: "es5",
  bracketSameLine: false,
  useTabs: false,
  endOfLine: "lf",
  overrides: [],
  plugins: ["prettier-plugin-tailwindcss", "prettier-plugin-packagejson"],
};

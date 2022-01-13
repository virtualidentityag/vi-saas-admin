module.exports = {
  "extends": [
    "plugin:react-hooks/recommended",
    "airbnb",
    "airbnb-typescript",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:jsx-a11y/recommended",
    "plugin:prettier/recommended",
    "plugin:cypress/recommended"
  ],
  "parser": "@typescript-eslint/parser",
  /*"files": ['*.ts', '*.tsx'],*/
  "parserOptions": {
    "project": "./tsconfig.json"
  },
  "plugins": [
    "import",
    "@typescript-eslint",
    "jsx-a11y",
    "prettier",
    "cypress"
  ],
  "rules": {
    // vvv remove later to make codebase better vvv
    "react/require-default-props": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "react/function-component-definition": [
      2,
      {
        namedComponents: "function-declaration",
      },
    ],
  }
};

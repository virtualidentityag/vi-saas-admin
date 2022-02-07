module.exports = {
    "extends": [
        "plugin:react-hooks/recommended",
        "airbnb",
        "airbnb-typescript",
        "plugin:@typescript-eslint/eslint-recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:jsx-a11y/recommended",
        "plugin:prettier/recommended",
        "plugin:cypress/recommended",
        "plugin:jest/recommended"
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
        "cypress",
        "jest"
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
        "jest/no-disabled-tests": "warn",
        "jest/no-focused-tests": "error",
        "jest/no-identical-title": "error",
        "jest/prefer-to-have-length": "warn",
        "jest/valid-expect": "error"
    },
    "settings": {
        "import/resolver": {
            "typescript": {},
            "node": {
                "paths": ["src"],
                "extensions": [".js", ".jsx", ".ts", ".tsx"],
            }
        }
    }
}

import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import jsxA11yPlugin from 'eslint-plugin-jsx-a11y';
import importPlugin from 'eslint-plugin-import';
import cypressPlugin from 'eslint-plugin-cypress';
import prettierConfig from 'eslint-config-prettier';

export default tseslint.config(
    // Global ignores (replaces .eslintignore)
    {
        ignores: [
            'node_modules/**',
            'build/**',
            '__mocks__/**',
            'scripts/**',
            'tests/**',
            'stories/**',
            '.storybook/**',
            '*.config.cjs',
            'vite.config.ts',
            'src/vite-env.d.ts',
        ],
    },

    // Base JS recommended rules
    js.configs.recommended,

    // TypeScript ESLint recommended rules
    ...tseslint.configs.recommended,

    // Main config for TypeScript/React source files
    {
        files: ['**/*.{ts,tsx,js,jsx}'],
        plugins: {
            react: reactPlugin,
            'react-hooks': reactHooksPlugin,
            'jsx-a11y': jsxA11yPlugin,
            import: importPlugin,
        },
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.es2020,
            },
            parserOptions: {
                project: './tsconfig.json',
            },
        },
        settings: {
            react: {
                version: 'detect',
            },
            'import/resolver': {
                typescript: {
                    alwaysTryTypes: true,
                },
                node: true,
            },
        },
        rules: {
            // React rules
            'react/react-in-jsx-scope': 'off',
            'react/jsx-fragments': 'off',
            'react/require-default-props': 'off',
            'react/no-unused-prop-types': 'off',
            'react/no-array-index-key': 'off',
            'react/destructuring-assignment': 'off',
            'react/jsx-props-no-spreading': 'off',
            'react/function-component-definition': [
                'error',
                {
                    namedComponents: 'arrow-function',
                },
            ],

            // React Hooks rules
            'react-hooks/rules-of-hooks': 'error',
            'react-hooks/exhaustive-deps': 'off',

            // TypeScript rules
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/explicit-module-boundary-types': 'off',
            // ban-types was removed in @typescript-eslint v8; its replacements are turned off to maintain existing behaviour
            '@typescript-eslint/no-empty-object-type': 'off',
            '@typescript-eslint/no-restricted-types': 'off',
            '@typescript-eslint/no-wrapper-object-types': 'off',
            '@typescript-eslint/no-unsafe-function-type': 'off',
            '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],

            // Import rules
            'import/no-named-as-default': 'off',
            'import/prefer-default-export': 'off',
            'import/no-unresolved': ['error', { ignore: ['\\?react$'] }],

            // General rules
            'no-console': 'warn',
        },
    },

    // JSX a11y rules for React files
    {
        files: ['**/*.{jsx,tsx}'],
        plugins: {
            'jsx-a11y': jsxA11yPlugin,
        },
        rules: {
            ...jsxA11yPlugin.configs.recommended.rules,
        },
    },

    // Cypress test files
    {
        files: ['cypress/**/*.{js,ts}'],
        ...cypressPlugin.configs.recommended,
    },

    // Test and setup files
    {
        files: ['**/*.test.{ts,tsx}', '**/*.spec.{ts,tsx}', '**/setupTests.ts'],
        rules: {
            'import/no-extraneous-dependencies': 'off',
        },
    },

    // Prettier config (must be last — disables conflicting rules)
    prettierConfig,
);

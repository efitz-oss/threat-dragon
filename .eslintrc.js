module.exports = {
    root: true,
    env: {
        node: true,
        browser: true,
        es2022: true,
        'vue/setup-compiler-macros': true,
        jest: true
    },
    extends: ['eslint:recommended', 'plugin:vue/vue3-recommended', 'prettier'],
    globals: {
        __static: 'readonly',
        vi: 'readonly',
        google: 'readonly',
        gapi: 'readonly',
        before: 'readonly',
        after: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        describe: 'readonly',
        it: 'readonly',
        expect: 'readonly',
        Component: 'readonly'
    },
    parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module'
    },
    plugins: ['vue', 'prettier'],
    ignorePatterns: [
        'node_modules/',
        'dist/',
        'dist-electron/',
        '.vite_cache/',
        '*.config.js',
        'babel.config.js',
        'archive/**',
        'td.vue/tests/unit/setup/vue3-test-template.js'
    ],
    rules: {
        // Common rules for both server and client
        'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        'no-unused-vars': 'warn',
        'no-undef': 'warn',
        semi: ['error', 'always'],
        quotes: ['error', 'single', { avoidEscape: true, allowTemplateLiterals: true }],
        indent: ['error', 4],
        'no-mixed-spaces-and-tabs': ['error', 'smart-tabs'],
        'linebreak-style': ['error', 'unix'],
        'prettier/prettier': ['error'],

        // Performance-related rules
        'prefer-const': 'error',
        'no-var': 'error',

        // Vue specific rules
        'vue/no-unused-components': 'error',
        'vue/html-indent': ['error', 4],
        'vue/max-attributes-per-line': [
            'error',
            {
                singleline: {
                    max: 3
                },
                multiline: {
                    max: 1
                }
            }
        ]
    },
    overrides: [
        // Server specific overrides
        {
            files: ['td.server/src/**/*.js'],
            env: {
                node: true,
                browser: false
            },
            plugins: [],
            rules: {
                // Add any server-specific rules here
                'sort-imports': 'off'
            }
        },
        // Vue specific overrides
        {
            files: ['td.vue/src/**/*.{js,vue}'],
            env: {
                node: true,
                browser: true
            },
            plugins: ['vue'],
            rules: {
                // Add any Vue-specific rules here
                'vue/require-explicit-emits': 'warn',
                'vue/require-default-prop': 'warn',
                'vue/order-in-components': 'warn',
                'vue/require-prop-types': 'warn',
                'vue/one-component-per-file': 'warn'
            }
        },
        // Test specific overrides
        {
            files: ['**/__tests__/*.{js,jsx,ts,tsx}', '**/tests/unit/**/*.spec.{js,jsx,ts,tsx}'],
            env: {
                jest: true,
                node: true
            },
            globals: {
                vi: true,
                describe: true,
                it: true,
                expect: true,
                beforeEach: true,
                afterEach: true
            },
            plugins: ['jest'],
            extends: ['plugin:jest/recommended'],
            rules: {
                'jest/prefer-to-have-length': 'warn',
                'jest/no-done-callback': 'warn',
                'jest/valid-expect': 'warn',
                'jest/no-disabled-tests': 'warn',
                'jest/expect-expect': 'warn',
                'no-unused-vars': 'warn'
            }
        },
        // E2E test specific overrides
        {
            files: ['**/tests/e2e/**/*.{js,jsx,ts,tsx}'],
            env: {
                node: true,
                browser: true,
                'cypress/globals': true
            },
            plugins: ['cypress'],
            extends: ['plugin:cypress/recommended'],
            rules: {
                // Cypress specific rules
            }
        }
    ]
};

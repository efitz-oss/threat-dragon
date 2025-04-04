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
        '*.config.js',
        'babel.config.js',
        'archive/**',
        'td.vue/tests/unit/setup/vue3-test-template.js',
        'td.vue/tests/unit/setup/bootstrap-vue-next.js'
    ],
    rules: {
        // Common rules for both server and client
        'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        'no-unused-vars': ['warn', { varsIgnorePattern: '^_', argsIgnorePattern: '^_' }],
        'no-undef': 'warn',
        semi: ['error', 'always'],
        quotes: ['error', 'single', { avoidEscape: true, allowTemplateLiterals: true }],
        indent: ['warn', 4],
        'no-mixed-spaces-and-tabs': ['warn', 'smart-tabs'],
        'linebreak-style': ['warn', 'unix'],
        'prettier/prettier': 'warn',

        // Performance-related rules
        'prefer-const': 'warn',
        'no-var': 'warn',

        // Vue specific rules
        'vue/no-unused-components': 'warn',
        'vue/html-indent': ['error', 4],
        'vue/max-attributes-per-line': [
            'warn',
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
                'vue/one-component-per-file': 'warn',
                'vue/no-v-html': 'warn',
                'vue/prop-name-casing': 'warn'
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
                'jest/no-conditional-expect': 'warn',
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
                'cypress/no-unnecessary-waiting': 'warn',
                'cypress/unsafe-to-chain-command': 'warn'
            }
        }
    ]
};

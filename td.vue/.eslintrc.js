module.exports = {
    env: {
        'node': true,
        'browser': true,
        'es2022': true,
        'vue/setup-compiler-macros': true
    },
    'extends': [
        'plugin:vue/vue3-recommended',
        'eslint:recommended',
        'plugin:prettier/recommended'
    ],
    globals: {
        __static: 'readonly',
    },
    parserOptions: {
        'ecmaVersion': 2022,
        'sourceType': 'module'
    },
    plugins: [
        'vue'
    ],
    ignorePatterns: [
        'node_modules/',
        'dist/',
        'dist-electron/',
        '.vite_cache/'
    ],
    rules: {
        'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        semi: 2,
        quotes: ['error', 'single', { avoidEscape: true, allowTemplateLiterals: true }],
        indent: ['error', 4],
        'no-mixed-spaces-and-tabs': ['error', 'smart-tabs'],
        // Performance-related rules
        'prefer-const': 'error',
        'no-var': 'error',
        'vue/no-unused-components': 'error'
    },
    overrides: [
        {
            // over-ride for both .js and .ts files (and OK, any .Xs file)
            files: ['**/__tests__/*.?s', '**/tests/unit/**/*.spec.?s'],
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
            'extends': ['plugin:jest/recommended'],
            rules: {
                'jest/prefer-to-have-length': 'warn',
                'jest/no-done-callback': 'warn',
                'jest/valid-expect': 'warn'
            }
        }
    ],
};

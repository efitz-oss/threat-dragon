module.exports = {
    presets: [
        [
            '@vue/cli-plugin-babel/preset',
            {
                useBuiltIns: 'entry',
                corejs: 3,
            },
        ],
    ],
    env: {
        test: {
            plugins: [
                // Support for Jest testing with Vue 3
                '@babel/plugin-transform-modules-commonjs',
                '@babel/plugin-proposal-class-properties',
                '@babel/plugin-proposal-private-methods',
            ],
        },
    },
};

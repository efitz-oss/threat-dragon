/**
 * Simplified Vue configuration that disables problematic plugins
 * Use this during development to bypass ESM/CJS compatibility issues
 */
module.exports = {
    chainWebpack: (config) => {
        // Disable the progress plugin
        if (config.plugins.has('progress')) {
            config.plugins.delete('progress');
        }

        // Disable any other problematic plugins if needed
        if (config.plugins.has('fork-ts-checker')) {
            config.plugins.delete('fork-ts-checker');
        }
    },
    css: {
        loaderOptions: {
            scss: {
                additionalData: `@import "@/styles/scss-includes.scss";`,
            },
        },
    },
};

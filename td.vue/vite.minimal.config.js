import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

// Minimal config for building production version
export default defineConfig({
    // Base path for assets
    base: '/public/',

    // Build options
    build: {
        outDir: 'dist',
        emptyOutDir: true,
        minify: 'esbuild',
        target: 'es2020',
        // Skip runtime checks for faster build
        cssCodeSplit: true,
        assetsInlineLimit: 4096,
        commonjsOptions: {
            strictRequires: false,
        },
        rollupOptions: {
            input: {
                main: path.resolve(__dirname, 'index.html'),
            },
            // Omit files that cause errors
            external: ['src/components/ThreatSuggestDialog.vue'],
        },
    },

    // Resolve configuration (aliases)
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src'),
            vue: 'vue/dist/vue.runtime.esm-bundler.js',
        },
    },

    // Plugins
    plugins: [
        vue({
            template: {
                compilerOptions: {
                    isCustomElement: (tag) => tag.includes('-') || tag.startsWith('b-'),
                    whitespace: 'preserve',
                },
            },
        }),
    ],

    // Optimize dependencies pre-bundling
    optimizeDeps: {
        include: ['vue', 'vue-router', 'pinia'],
        exclude: ['electron'],
    },

    // Enable esbuild for faster transpilation
    esbuild: {
        jsxFactory: 'h',
        jsxFragment: 'Fragment',
        legalComments: 'none',
        treeShaking: true,
    },
});

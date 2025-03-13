/**
 * Minimal Vitest configuration that focuses only on making tests work
 * without any complex setup files.
 */
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

export default defineConfig({
    plugins: [vue()],
    test: {
        environment: 'jsdom',
        globals: true,
        include: ['**/simple-test.spec.js', '**/store-mocking.spec.js'],
        // No setup files - each test is standalone
        setupFiles: [],
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
            // Use the ESM bundler version of Vue
            vue: 'vue/dist/vue.esm-bundler.js',
        },
    },
});

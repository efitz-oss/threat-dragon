/**
 * Main Vitest configuration that uses a minimal approach
 * without complex setups or dependencies on vue-demi.
 */
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
    plugins: [vue()],
    test: {
        // Use jsdom for DOM testing environment
        environment: 'jsdom',
        // Enable jest-like globals (describe, it, expect)
        globals: true,
        // Patterns to include in test runs
        include: ['**/*.spec.js', '**/*.test.js'],
        // No complex setup files that could cause Vue default export issues
        setupFiles: [],
        // Coverage configuration
        coverage: {
            provider: 'v8',
            reporter: ['text', 'lcov', 'html'],
            include: ['src/**/*.vue', 'src/stores/**/*.js'],
            exclude: ['node_modules/', 'tests/', '**/*.spec.js', 'dist/', 'public/'],
        },
        // Enhanced environment configuration
        environmentOptions: {
            jsdom: {
                url: 'http://localhost',
            },
        },
        // Test timeout settings
        testTimeout: 10000,
        hookTimeout: 10000,
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
            // Use the ESM bundler version of Vue
            vue: 'vue/dist/vue.esm-bundler.js',
        },
    },
});

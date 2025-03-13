/**
 * Fixed Vitest configuration that properly handles Vue 3 and vue-demi
 * for tests to work with our custom shims.
 */
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

export default defineConfig({
    plugins: [vue()],
    test: {
        // Use jsdom for DOM testing environment
        environment: 'jsdom',
        // Enable jest-like globals
        globals: true,
        // Patterns to include in test runs
        include: [
            '**/*.spec.js',
            '**/*.test.js',
            '**/unit/store/pinia/**/*.spec.js',
            '**/unit/components/**/*.meta.spec.js',
        ],
        // Use our fixed setup files
        setupFiles: ['./tests/unit/setup/index-fixed.js'],
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
        // Performance settings
        threads: true,
        isolate: true,
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
            // Provide a custom vue export with a default property
            vue: path.resolve(__dirname, './src/shims/vue-demi-test.js'),
            // Use our custom vue-demi shim
            'vue-demi': path.resolve(__dirname, './src/shims/vue-demi-test.js'),
        },
    },
});

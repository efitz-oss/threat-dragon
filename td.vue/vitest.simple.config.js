/**
 * Simple Vitest config without complex setups
 * Use this config when regular tests fail with vue-demi issues
 */
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

export default defineConfig({
    plugins: [vue()],
    test: {
        // Use jsdom for DOM testing environment
        environment: 'jsdom',
        // Enable jest-like globals (describe, it, expect)
        globals: true,
        // Patterns to include in test runs - only include .test.js files
        include: ['**/*.test.js'],
        // No shared setup
        setupFiles: [],
        // Coverage configuration - disabled for simple tests
        coverage: {
            enabled: false,
        },
        // Enhanced environment configuration
        environmentOptions: {
            jsdom: {
                url: 'http://localhost',
            },
        },
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
            vue: 'vue/dist/vue.esm-bundler.js',
        },
    },
});

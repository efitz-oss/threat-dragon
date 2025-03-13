/**
 * Optimized Vitest configuration for fast test execution
 * with parallel processing and improved caching.
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
        // Patterns to include in test runs
        include: ['**/*.spec.js', '**/*.test.js'],
        // Setup file for common mocks and utilities
        setupFiles: ['tests/unit/setup/fast-test-setup.js'],
        // Enable parallel test execution
        pool: 'threads',
        poolOptions: {
            threads: {
                minThreads: 2,
                maxThreads: 4,
            },
        },
        // Isolate tests for parallelization
        isolate: true,
        // Cache test results to speed up reruns
        cache: {
            dir: './.vitest-cache',
        },
        // Use v8 for faster test execution
        fakeTimers: {
            toFake: ['setTimeout', 'clearTimeout', 'setInterval', 'clearInterval', 'Date'],
        },
        // Silence console output during tests
        silent: true,
        // Update snapshots only when requested
        updateSnapshot: false,
        // Test timeout settings
        testTimeout: 10000,
        hookTimeout: 10000,
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
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
            // Use the ESM bundler version of Vue
            vue: 'vue/dist/vue.esm-bundler.js',
        },
    },
});

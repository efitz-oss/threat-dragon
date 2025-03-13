import { defineConfig } from 'vite';
import { mergeConfig } from 'vitest/config';
import baseConfig from './vitest.config';

// This configuration extends the base config with desktop-specific settings
export default mergeConfig(
    baseConfig,
    defineConfig({
        test: {
            // Override test patterns for desktop
            include: ['**/tests/unit/desktop/**/*.spec.js'],
            // Environment variables for desktop tests
            env: {
                MODE: 'electron',
                NODE_ENV: 'test',
                IS_ELECTRON: 'true',
            },
            // Setup files specific to desktop tests
            setupFiles: ['./tests/unit/setup/index.js'],
            // Extend environment options for desktop
            environmentOptions: {
                jsdom: {
                    url: 'app://localhost',
                    pretendToBeVisual: true,
                },
            },
        },
    })
);

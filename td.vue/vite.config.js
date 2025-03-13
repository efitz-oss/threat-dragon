import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';
import fs from 'fs';
import { visualizer } from 'rollup-plugin-visualizer';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
    // Load environment variables
    const env = loadEnv(mode, process.cwd(), '');

    // Set default values if not in env
    const serverApiProtocol = env.SERVER_API_PROTOCOL || 'http';
    const serverApiPort = env.SERVER_API_PORT || env.PORT || '3000';
    const PORT = env.APP_PORT || '8080';
    const appHostname = env.APP_HOSTNAME || 'localhost';

    console.log('Server API protocol: ' + serverApiProtocol + ' and port: ' + serverApiPort);

    // Check if TLS credentials are available
    const hasTlsCredentials =
        env.APP_USE_TLS && env.APP_TLS_CERT_PATH && env.APP_TLS_KEY_PATH && env.APP_HOSTNAME;

    // Configure server options based on TLS availability
    const serverConfig = hasTlsCredentials
        ? {
            https: {
                key: fs.readFileSync(env.APP_TLS_KEY_PATH),
                cert: fs.readFileSync(env.APP_TLS_CERT_PATH),
            },
            port: parseInt(PORT),
            proxy: {
                '/api': {
                    target: `${serverApiProtocol}://localhost:${serverApiPort}`,
                    ws: true,
                    changeOrigin: true,
                },
            },
            host: appHostname,
        }
        : {
            port: 8080,
            proxy: {
                '/api': {
                    target: `${serverApiProtocol}://localhost:${serverApiPort}`,
                    ws: true,
                    changeOrigin: true,
                },
            },
            host: appHostname,
        };

    console.log(
        `Running on ${hasTlsCredentials ? `HTTPS (Port ${serverConfig.port})` : `HTTP (Port ${serverConfig.port})`}`
    );

    const isElectron = mode === 'electron';

    return {
        // Base path for assets - must match path in td.server
        base: '/public/',

        // Server configuration
        server: serverConfig,

        // Build options
        build: {
            sourcemap: mode === 'development',
            outDir: isElectron ? 'dist-electron' : 'dist',
            emptyOutDir: true,
            // Enable build caching for faster rebuilds
            cache: true,
            cacheDir: '.vite_cache',
            // Use ESM format for better compatibility
            modulePreload: { polyfill: true },
            cssCodeSplit: true,
            // Set more lenient build settings to get past Vue 3 conversion
            minify: mode === 'production' ? 'esbuild' : false,
            target: 'es2020',
            reportCompressedSize: true,
            chunkSizeWarningLimit: 2000,
            // Allow warnings but not errors
            assetsInlineLimit: 4096,
            commonjsOptions: {
                strictRequires: false,
            },
            rollupOptions: {
                input: {
                    main: path.resolve(__dirname, 'index.html'),
                    test: path.resolve(__dirname, 'test.html'),
                },
                output: {
                    format: 'es',
                    compact: mode === 'production',
                    manualChunks: (id) => {
                        if (id.includes('node_modules')) {
                            const match = id.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/);
                            if (!match) return 'vendors';

                            const packageName = match[1];
                            // Group common framework chunks together
                            if (packageName === 'vue' || packageName === 'vue-router') {
                                return 'vue-core';
                            }
                            if (
                                packageName === 'pinia' ||
                                packageName === 'pinia-plugin-persistedstate'
                            ) {
                                return 'store';
                            }
                            if (packageName === 'vue-i18n' || packageName.startsWith('@intlify')) {
                                return 'i18n';
                            }
                            if (packageName.startsWith('@antv')) {
                                return 'antv';
                            }
                            // Split FontAwesome into smaller chunks
                            if (packageName.startsWith('@fortawesome/free-solid-svg-icons')) {
                                return 'icons-solid';
                            }
                            if (packageName.startsWith('@fortawesome/free-brands-svg-icons')) {
                                return 'icons-brands';
                            }
                            if (packageName.startsWith('@fortawesome')) {
                                return 'icons-core';
                            }
                            // Split PrimeVue into smaller chunks
                            if (packageName === 'primevue') {
                                return 'primevue-core';
                            }
                            if (packageName === 'primeicons' || packageName === 'primeflex') {
                                return 'primevue-assets';
                            }
                            // Group utility libraries
                            if (
                                ['uuid', 'ajv', 'destr', 'deep-pick-omit', 'fast-uri'].includes(
                                    packageName
                                )
                            ) {
                                return 'utils';
                            }
                            return `vendor.${packageName.replace('@', '')}`;
                        }
                    },
                },
                plugins: process.env.ANALYZE
                    ? [
                        visualizer({
                            filename: 'bundle-report.html',
                            open: false,
                            gzipSize: true,
                            brotliSize: true,
                        }),
                    ]
                    : [],
            },
        },

        // Optimize dependencies pre-bundling
        optimizeDeps: {
            include: [
                'vue',
                'vue-router',
                'pinia',
                '@antv/x6',
                '@fortawesome/vue-fontawesome',
                'vue-i18n',
            ],
            exclude: ['electron'],
            // Force dependency optimization in development
            force: true,
            // Cache dependencies to speed up build times
            cacheDir: '.vite_dep_cache',
            // Only re-optimize dependencies when needed
            entries: [
                'src/main.js',
                'src/router/index.js',
                'src/views/HomePage.vue',
                'src/views/MainDashboard.vue',
            ],
            // Rerun dependency optimization whenever node_modules changes
            reuseDepFiles: process.env.NODE_ENV === 'production',
            // Enable enhanced dependency optimization
            esbuildOptions: {
                target: 'es2020',
                // Optimize for speed
                legalComments: 'none',
                treeShaking: true,
            },
        },

        // Resolve configuration (aliases)
        resolve: {
            alias: {
                '@': path.resolve(__dirname, 'src'),
                vue: 'vue/dist/vue.esm-bundler.js', // Always use full build for debugging
                'vue-demi': path.resolve(__dirname, 'src/shims/vue-demi-index.mjs'),
            },
            dedupe: ['vue'],
        },

        // Define environment variables available to client-side code
        define: {
            // Add environment variables here with prefix
            'process.env.NODE_ENV': JSON.stringify(mode),
            'process.env.IS_ELECTRON': isElectron,
        },

        // CSS preprocessing
        css: {
            preprocessorOptions: {
                scss: {
                    // We add this empty string to enable the preprocessing
                    // but we don't add any additionalData because each file
                    // now has its own @use "sass:math" directive
                    additionalData: ``,
                },
            },
        },

        // Plugins
        plugins: [
            vue({
                template: {
                    compilerOptions: {
                        // Add directives that should be treated as custom elements
                        isCustomElement: (tag) => tag.includes('-') || tag.startsWith('b-'),
                        // Set to false for more lenient compilation
                        whitespace: 'preserve',
                    },
                },
            }),
            ...(process.env.ANALYZE
                ? [
                    visualizer({
                        filename: 'bundle-report.html',
                        open: false,
                        gzipSize: true,
                        brotliSize: true,
                    }),
                ]
                : []),
        ],

        // Enable esbuild for faster transpilation
        esbuild: {
            jsxFactory: 'h',
            jsxFragment: 'Fragment',
        },
    };
});

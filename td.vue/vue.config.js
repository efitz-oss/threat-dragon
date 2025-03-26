const path = require('path');
const { CycloneDxWebpackPlugin } = require('@cyclonedx/webpack-plugin');
const fs = require('fs');

require('dotenv').config({ path: process.env.ENV_FILE || path.resolve(__dirname, '../.env') });

// Check if TLS credentials are available in the environment file
const hasTlsCredentials = process.env.APP_USE_TLS && process.env.APP_TLS_CERT_PATH && process.env.APP_TLS_KEY_PATH && process.env.APP_HOSTNAME;

// Read environment variables controlling the webpack dev server configuration
// Use defaults if critical values are not provided
// serverApiProtocol determines whether the API server will health check using https or http
// If explicitly specified in environment (such as behind an HTTPS load balancer), use explicit value
// If not specified, use https if enabled on the Vue application, or http otherwise
const serverApiProtocol = process.env.SERVER_API_PROTOCOL || hasTlsCredentials ? 'https':'http';
const serverApiPort = process.env.SERVER_API_PORT || process.env.PORT || '3000';
const appPort = process.env.APP_PORT || '8080';
const appHostname = process.env.APP_HOSTNAME || 'localhost';
// proxyHostname allows optional specification of the load balancer/proxy hostname
// This is useful when the load balancer listens on https AND the application is listening on https
// or when the API server resolves the local hostname to the load balancer/proxy IP (e.g. Heroku)
const proxyHostname = process.env.PROXY_HOSTNAME || appHostname;
console.log('API server listening on port: ' + serverApiPort);
console.log('Health check API proxy endpoint: ' + serverApiProtocol + '://' + proxyHostname + ':' + appPort + '/healthz');

// "dev server" refers to the webpack dev server that serves the Vue application
// Configure dev server to use HTTPS if TLS configuration is valid, otherwise use HTTP
let httpsConfig = {};
if (hasTlsCredentials) {
    try {
        httpsConfig = {
            key: fs.readFileSync(process.env.APP_TLS_KEY_PATH),
            cert: fs.readFileSync(process.env.APP_TLS_CERT_PATH),
        };
    } catch (error) {
        console.error('Error reading TLS credential files:', error);
        process.exit(1); // Exit the process if TLS credentials cannot be read
    }
}

const devServerConfig = hasTlsCredentials
    ? {
        https: httpsConfig,
        port: appPort,
        proxy: {
            '^/api': {
                target: `http://localhost:${serverApiPort}`, // Backend server
                ws: true, // Proxy WebSocket connections
                changeOrigin: true,
            },
        },
        allowedHosts: [appHostname, proxyHostname],
    }
    : {
        // note that client webSocketURL config has been removed, as it was incompatible with desktop version
        port: appPort,
        proxy: {
            '^/api': {
                target: `http://localhost:${serverApiPort}`, // Backend server
                ws: true, // Proxy WebSocket connections
                changeOrigin: true,
            },
        },
        allowedHosts: [appHostname, proxyHostname],
    };

console.log(`App server running on ${hasTlsCredentials ? `HTTPS (Port ${devServerConfig.port})` : `HTTP (Port ${devServerConfig.port})`}`);


module.exports = {
    publicPath: process.env.NODE_ENV === 'production' ? '/public' : '/',
    productionSourceMap: false,
    devServer: devServerConfig,
    lintOnSave: false,
    pluginOptions: {
        'style-resources-loader': {
            preProcessor: 'scss',
            patterns: [
                path.resolve(__dirname, 'src', 'styles', '*.scss')
            ]
        },
        electronBuilder: {
            mainProcessFile: 'src/desktop/desktop.js',
            mainProcessWatch: ['src/desktop/logger.js', 'src/desktop/menu.js'],
            rendererProcessFile: 'src/main.desktop.js',
            outputDir: 'dist-desktop',
            builderOptions: {
                appId: 'org.owasp.threatdragon',
                productName: 'Threat-Dragon-ng',
                directories: {
                    output: 'dist-desktop'
                },
                publish: {
                    provider: 'github'
                },
                mac: {
                    category: 'public.app-category.developer-tools',
                    icon: './src/icons/icon.icns',
                    hardenedRuntime: true,
                    entitlements: './node_modules/electron-builder-notarize/entitlements.mac.inherit.plist',
                    entitlementsInherit: './node_modules/electron-builder-notarize/entitlements.mac.inherit.plist',
                    target: [
                        {
                            target: 'default',
                            arch: ['x64', 'arm64']
                        }
                    ]
                },
                win: {
                    icon: './src/icons/icon.ico',
                    target: [
                        {
                            target: 'nsis',
                            arch: ['arm64', 'x64']
                        }
                    ],
                    rfc3161TimeStampServer: 'http://timestamp.acs.microsoft.com',
                    signingHashAlgorithms: ['sha256'],
                    publisherName: [
                        'Open Source Developer, Antony Jonathan Gadsden'
                    ]
                },
                linux: {
                    category: 'Development',
                    executableName: 'threat-dragon',
                    icon: './src/icons/td-256.png',
                    synopsis: 'OWASP Threat Dragon',
                    target: [
                        {
                            target: 'AppImage',
                            arch: ['arm64', 'x64']
                        },
                        {
                            target: 'snap',
                            arch: ['arm64', 'x64']
                        },
                        'deb',
                        'rpm'
                    ]
                },
                snap: {
                    grade: 'stable',
                    summary: 'OWASP Threat Dragon, desktop version',
                    description: 'OWASP Threat Dragon is a free, open-source, cross-platform threat modelling application',
                    title: 'OWASP Threat Dragon'
                }
            }
        }
    },
    chainWebpack: config => {
        config.module
            .rule('vue')
            .use('vue-loader')
            .tap(options => {
                options.source = 'src';
                options.img = 'src';
                options.image = 'xlink:href';
                options['b-img'] = 'src';
                options['b-img-lazy'] = ['src', 'blank-src'];
                return options;
            });
    },
    configureWebpack: {
        devtool: 'source-map',
        plugins: [
            new CycloneDxWebpackPlugin(
                {
                    outputLocation: '.sbom',
                    specVersion: '1.5'
                }
            )
        ],
        output: {
            hashFunction: 'xxhash64'
        }
    }
};

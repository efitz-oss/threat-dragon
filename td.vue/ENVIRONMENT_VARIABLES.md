# Threat Dragon Environment Variables

This document provides a comprehensive list of environment variables used in the Threat Dragon application, their default values, valid options, and descriptions of their purpose.

## Core Configuration

| Variable | Default | Options | Description |
|----------|---------|---------|-------------|
| `NODE_ENV` | development | development, test, production | Determines the mode in which the application is running |
| `VUE_APP_WEB_ONLY` | false | true, false | When set to true, disables Electron-specific features |
| `VUE_APP_IS_ELECTRON` | false | true, false | Indicates whether the application is running in Electron |
| `PORT` | 3000 | Any valid port number | Port for the server to listen on |
| `APP_PORT` | 8080 | Any valid port number | Port for the Vue application |
| `APP_HOSTNAME` | localhost | Any valid hostname | Hostname for the app |
| `PROXY_HOSTNAME` | localhost | Any valid hostname | Hostname for proxy |

## Authentication & Authorization

| Variable | Default | Options | Description |
|----------|---------|---------|-------------|
| `VUE_APP_GOOGLE_CLIENT_ID` | - | Valid Google Client ID | Client ID for Google OAuth integration |
| `VUE_APP_GOOGLE_API_KEY` | - | Valid Google API Key | API key for Google Drive integration |
| `VUE_APP_GOOGLE_APP_ID` | - | Valid Google App ID | App ID for Google integration |
| `VUE_APP_OPERATOR_NAME` | "the operator" | Any string | Name of the entity operating this Threat Dragon instance (displayed in Terms of Service and Privacy Policy) |
| `VUE_APP_OPERATOR_CONTACT` | "the operator through appropriate channels" | Any string | Contact information for the entity operating this Threat Dragon instance (displayed in Terms of Service and Privacy Policy) |

## Server Configuration

| Variable | Default | Options | Description |
|----------|---------|---------|-------------|
| `SERVER_API_PROTOCOL` | http | http, https | Protocol for server API |
| `SERVER_API_PORT` | 3000 | Any valid port number | Port for server API |
| `APP_USE_TLS` | false | true, false | Whether to use TLS |
| `APP_TLS_CERT_PATH` | - | Valid file path | Path to TLS certificate |
| `APP_TLS_KEY_PATH` | - | Valid file path | Path to TLS key |

## Electron-specific Configuration

| Variable | Default | Options | Description |
|----------|---------|---------|-------------|
| `ELECTRON_NODE_INTEGRATION` | false | true, false | Whether to enable Node.js integration in Electron |
| `ELECTRON_ENABLE_LOGGING` | false | true, false | Enable detailed logging in Electron app |
| `ELECTRON_LOG_LEVEL` | info | debug, info, warn, error | Log level for Electron app |

## Development & Build Configuration

| Variable | Default | Options | Description |
|----------|---------|---------|-------------|
| `WEBPACK_DEV_SERVER_URL` | - | Valid URL | URL for Webpack dev server |
| `ENV_FILE` | - | Valid file path | Path to environment file |
| `PYTHON_PATH` | python | Valid path to Python executable | Path to Python executable for builds |

## Vite Configuration (For Development)

| Variable | Default | Options | Description |
|----------|---------|---------|-------------|
| `VITE_CACHE_DEPS` | true | true, false | Enable persistent caching for Vite |
| `VITE_DEPS_WARMUP` | auto | auto, force, never | Vite dependency warmup mode |
| `VITE_DEPS_AUTO_OPTIMIZE` | true | true, false | Auto optimize dependencies in Vite |

## Notes

1. Environment variables prefixed with `VUE_APP_` are automatically exposed to the Vue application through webpack and can be accessed via `process.env.VUE_APP_*` in the client code.

2. For local development, you can create a `.env` file in the project root to set these variables. For production deployment, set these variables in your environment or deployment configuration.

3. When deploying with Google authentication support, the `VUE_APP_OPERATOR_NAME` and `VUE_APP_OPERATOR_CONTACT` variables are required for legal compliance.

4. Sensitive values such as API keys and client IDs should never be committed to the repository. Use environment variables or secure configuration management instead.

## Example Usage

To run the application with specific environment variables:

```bash
# For development
VUE_APP_OPERATOR_NAME="ACME Corp" VUE_APP_OPERATOR_CONTACT="security@acme.com" npm run dev:site

# For production
VUE_APP_WEB_ONLY=true VUE_APP_OPERATOR_NAME="ACME Corp" npm run build:site
```

Or in a .env file:

```
VUE_APP_GOOGLE_CLIENT_ID=your-client-id
VUE_APP_OPERATOR_NAME=ACME Corp
VUE_APP_OPERATOR_CONTACT=security@acme.com
```
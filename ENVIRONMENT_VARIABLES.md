# Threat Dragon Environment Variables Documentation

This document provides a comprehensive description of all environment variables used by Threat Dragon, their purpose, default values, and any specific effects different values may have.

## Core Configuration Variables

### `NODE_ENV`
- **Purpose**: Specifies the runtime environment
- **Values**: 
  - `production`: Enables production optimizations, rate limiting, and caching
  - `development`: Disables rate limiting, enables development tools and logging
  - `test`: Used for automated testing
  - `simulated_production`: Used for testing production configuration
- **Default**: `production`
- **Used in**: Server configuration, build process, logging levels

### `SERVER_API_PROTOCOL`
- **Purpose**: Protocol used by the Express API server
- **Values**: `http` or `https`
- **Default**: `https`
- **Note**: Set to `http` only for development; production should always use `https`

### `SERVER_API_PORT`
- **Purpose**: Port that the server listens on
- **Default**: `3000`
- **Note**: Takes precedence over the legacy `PORT` variable

### `PORT`
- **Purpose**: Legacy port configuration, maintained for backward compatibility
- **Default**: `3000`
- **Note**: Ignored when `SERVER_API_PORT` is set

## Encryption Keys

### `ENCRYPTION_KEYS`
- **Purpose**: Protects communication between the application and server
- **Format**: JSON array with objects containing `isPrimary`, `id`, and `value` properties
- **Example**: `[{"isPrimary": true, "id": 0, "value": "11223344556677889900aabbccddeeff"}]`
- **Required**: Yes
- **Note**: Generate unique values using `openssl rand -hex 16`

### `ENCRYPTION_JWT_SIGNING_KEY`
- **Purpose**: Used for signing JWT authentication tokens
- **Required**: Yes
- **Note**: Should be a strong, unique cryptographic key

### `ENCRYPTION_JWT_REFRESH_SIGNING_KEY`
- **Purpose**: Used for signing JWT refresh tokens
- **Required**: Yes
- **Note**: Should be a different key than the JWT signing key

## Front-end Application Configuration

### `APP_HOSTNAME`
- **Purpose**: FQDN hostname for the front-end application
- **Default**: `localhost`
- **Required**: When using TLS
- **Example**: `threatdragon.example.com`

### `APP_PORT`
- **Purpose**: Network port for front-end application
- **Default**: `8080`
- **Note**: Using a port < 1024 requires granting the `cap_net_bind_service` capability to the node binary

### `APP_USE_TLS`
- **Purpose**: Enables TLS for the application
- **Values**: Set to any value to enable, omit to disable
- **Default**: Disabled
- **Note**: Required for secure production deployments

### `APP_TLS_CERT_PATH`
- **Purpose**: Path to TLS certificate file
- **Required**: When `APP_USE_TLS` is enabled
- **Example**: `/path/to/certificate.pem`

### `APP_TLS_KEY_PATH`
- **Purpose**: Path to TLS private key file
- **Required**: When `APP_USE_TLS` is enabled
- **Example**: `/path/to/privatekey.pem`

## Logging Configuration

### `LOG_LEVEL`
- **Purpose**: Sets the application logging level
- **Values**: 
  - `audit`: Security audit events only
  - `error`: Errors only
  - `warn`: Warnings and errors
  - `info`: General information, warnings, and errors
  - `debug`: Detailed debug information and above
  - `silly`: All logging, including detailed tracing
- **Default**: `warn`
- **Note**: Higher verbosity levels can impact performance

### `LOG_MAX_FILE_SIZE`
- **Purpose**: Maximum log file size in megabytes
- **Default**: `24`
- **Note**: Log files are rotated when they reach this size

## Repository Configuration

### `REPO_ROOT_DIRECTORY`
- **Purpose**: Directory for storing threat models
- **Default**: `ThreatDragonModels`
- **Note**: Used for local file storage

### `REPO_USE_SEARCH`
- **Purpose**: Enables search capability for repositories
- **Values**: `true` or `false`
- **Default**: `false`

### `REPO_SEARCH_QUERY`
- **Purpose**: Query to use when searching repositories
- **Default**: None
- **Note**: Used when `REPO_USE_SEARCH` is enabled

## GitHub Integration

### `GITHUB_CLIENT_ID`
- **Purpose**: Client ID for GitHub OAuth
- **Required**: For GitHub integration
- **Note**: Obtain from GitHub developer settings

### `GITHUB_CLIENT_SECRET`
- **Purpose**: Client secret for GitHub OAuth
- **Required**: For GitHub integration
- **Note**: Obtain from GitHub developer settings

### `GITHUB_SCOPE`
- **Purpose**: Scopes for GitHub OAuth
- **Default**: `public_repo`
- **Note**: Do not modify unless adding additional capabilities

### `GITHUB_ENTERPRISE_HOSTNAME`
- **Purpose**: GitHub Enterprise hostname
- **Required**: Only for GitHub Enterprise integration
- **Example**: `github.company.com`

### `GITHUB_ENTERPRISE_PORT`
- **Purpose**: GitHub Enterprise port
- **Default**: `443`
- **Required**: Only if using non-standard port with GitHub Enterprise

### `GITHUB_ENTERPRISE_PROTOCOL`
- **Purpose**: GitHub Enterprise protocol
- **Default**: `https`
- **Values**: `http` or `https`
- **Required**: Only if using non-standard protocol with GitHub Enterprise

### `GITHUB_USE_SEARCH`
- **Purpose**: Enables GitHub search functionality
- **Values**: `true` or `false`
- **Default**: `false`

### `GITHUB_SEARCH_QUERY`
- **Purpose**: GitHub search query
- **Default**: None
- **Note**: Used when `GITHUB_USE_SEARCH` is enabled

### `GITHUB_REPO_ROOT_DIRECTORY`
- **Purpose**: GitHub repository root directory
- **Default**: None (uses `REPO_ROOT_DIRECTORY`)
- **Note**: Overrides the default repository directory specifically for GitHub

## GitLab Integration

### `GITLAB_CLIENT_ID`
- **Purpose**: Client ID for GitLab OAuth
- **Required**: For GitLab integration
- **Note**: Obtain from GitLab application settings

### `GITLAB_CLIENT_SECRET`
- **Purpose**: Client secret for GitLab OAuth
- **Required**: For GitLab integration
- **Note**: Obtain from GitLab application settings

### `GITLAB_SCOPE`
- **Purpose**: Scopes for GitLab OAuth
- **Default**: `read_user read_repository write_repository profile read_api api`
- **Note**: Do not modify unless adding additional capabilities

### `GITLAB_HOST`
- **Purpose**: GitLab host for self-hosted instances
- **Default**: Public GitLab (`gitlab.com`)
- **Required**: Only for self-hosted GitLab

### `GITLAB_REDIRECT_URI`
- **Purpose**: GitLab redirect URI after authentication
- **Default**: `http://localhost:3000/api/oauth/return`
- **Note**: Must match the redirect URI configured in GitLab

### `GITLAB_REPO_ROOT_DIRECTORY`
- **Purpose**: GitLab repository root directory
- **Default**: None (uses `REPO_ROOT_DIRECTORY`)
- **Note**: Overrides the default repository directory specifically for GitLab

## Bitbucket Integration

### `BITBUCKET_CLIENT_ID`
- **Purpose**: Client ID for Bitbucket OAuth
- **Required**: For Bitbucket integration
- **Note**: Obtain from Bitbucket developer settings

### `BITBUCKET_CLIENT_SECRET`
- **Purpose**: Client secret for Bitbucket OAuth
- **Required**: For Bitbucket integration
- **Note**: Obtain from Bitbucket developer settings

### `BITBUCKET_SCOPE`
- **Purpose**: Scopes for Bitbucket OAuth
- **Default**: `repository:write`
- **Note**: Do not modify unless adding additional capabilities

### `BITBUCKET_WORKSPACE`
- **Purpose**: Bitbucket workspace name
- **Required**: For Bitbucket integration
- **Note**: The workspace (team) where repositories are located

### `BITBUCKET_ENTERPRISE_HOSTNAME`
- **Purpose**: Bitbucket Enterprise hostname
- **Required**: Only for Bitbucket Enterprise integration
- **Example**: `bitbucket.company.com`

### `BITBUCKET_ENTERPRISE_PORT`
- **Purpose**: Bitbucket Enterprise port
- **Default**: `443`
- **Required**: Only if using non-standard port with Bitbucket Enterprise

### `BITBUCKET_ENTERPRISE_PROTOCOL`
- **Purpose**: Bitbucket Enterprise protocol
- **Default**: `https`
- **Values**: `http` or `https`
- **Required**: Only if using non-standard protocol with Bitbucket Enterprise

### `BITBUCKET_REPO_ROOT_DIRECTORY`
- **Purpose**: Bitbucket repository root directory
- **Default**: None (uses `REPO_ROOT_DIRECTORY`)
- **Note**: Overrides the default repository directory specifically for Bitbucket

## Google Integration

### `GOOGLE_CLIENT_ID`
- **Purpose**: Client ID for Google OAuth
- **Required**: For Google integration
- **Note**: Obtain from Google Cloud Console

### `GOOGLE_CLIENT_SECRET`
- **Purpose**: Client secret for Google OAuth
- **Required**: For Google integration
- **Note**: Obtain from Google Cloud Console

### `GOOGLE_SCOPE`
- **Purpose**: Scopes for Google OAuth
- **Default**: `openid email profile drive docs`
- **Note**: Do not modify unless adding additional capabilities

### `GOOGLE_REDIRECT_URI`
- **Purpose**: Google redirect URI after authentication
- **Default**: `http://localhost:3000/api/oauth/return`
- **Note**: Must match the redirect URI configured in Google Cloud Console

### `GOOGLE_TOKEN_URL`
- **Purpose**: URL for obtaining Google OAuth tokens
- **Default**: `https://oauth2.googleapis.com/token`
- **Note**: Rarely needs to be changed

### `GOOGLE_USER_INFO_URL`
- **Purpose**: URL for obtaining Google user information
- **Default**: `https://www.googleapis.com/oauth2/v1/userinfo`
- **Note**: Rarely needs to be changed

## Special Configuration Variables

### `ENV_FILE`
- **Purpose**: Path to a .env file to load
- **Default**: Path to project root .env file
- **Note**: Useful for development and testing with different configurations

### `IS_ELECTRON`
- **Purpose**: Indicates if app is running in Electron (desktop) mode
- **Values**: `true` or `false`
- **Set by**: Build system automatically
- **Note**: Used to enable or disable desktop-specific features

### `ANALYZE`
- **Purpose**: Enables bundle analysis during build
- **Values**: Set to any value to enable
- **Default**: Disabled
- **Example**: `ANALYZE=true npm run build`

## Minimal Configuration Example

For a minimal working configuration, set these variables:

```
ENCRYPTION_KEYS='[{"isPrimary": true, "id": 0, "value": "your-generated-key"}]'
ENCRYPTION_JWT_SIGNING_KEY=your-jwt-signing-key
ENCRYPTION_JWT_REFRESH_SIGNING_KEY=your-jwt-refresh-signing-key
NODE_ENV=production
SERVER_API_PORT=3000
SERVER_API_PROTOCOL=https
```

## Security Recommendations

1. Always use unique, cryptographically strong keys for encryption
2. Use `https` for `SERVER_API_PROTOCOL` in production
3. Configure TLS with valid certificates in production
4. Protect your environment variables file from unauthorized access
5. Consider using a secrets management solution rather than environment variables for production deployments
6. Never commit actual keys or secrets to source control

## Setting Environment Variables

Environment variables can be set in multiple ways:
1. In a `.env` file at the project root
2. As system environment variables
3. When running a command: `SERVER_API_PORT=4000 npm start`

The application will use variables from the .env file first, then fall back to system environment variables.
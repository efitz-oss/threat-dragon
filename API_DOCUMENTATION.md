# OWASP Threat Dragon API Documentation

This document provides comprehensive documentation for the Threat Dragon REST API, including endpoints, request/response formats, authentication requirements, and examples.

## Table of Contents

1. [Authentication](#authentication)
2. [Authentication API](#authentication-api)
3. [Threat Model API](#threat-model-api)
4. [Google Drive API](#google-drive-api)
5. [Security Features](#security-features)
6. [Error Handling](#error-handling)

## Authentication

Threat Dragon uses JWT (JSON Web Token) based authentication with the following features:

- **Access tokens**: Short-lived tokens (15 minutes) used for API access
- **Refresh tokens**: Longer-lived tokens (7 days) used to obtain new access tokens
- **Token rotation**: Refresh tokens are rotated with each use for enhanced security
- **Token revocation**: Ability to revoke both access and refresh tokens
- **Token families**: Tracking of related refresh tokens to prevent token reuse attacks

### Authentication Flow

1. User authenticates through an OAuth provider (GitHub, GitLab, Bitbucket, Google)
2. Server issues an access token and refresh token
3. Client uses access token for API requests
4. When access token expires, client uses refresh token to obtain a new access token
5. When user logs out, both tokens are revoked

### Token Format

Access tokens must be included in the `Authorization` header with the `Bearer` prefix:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Authentication API

### Login with Provider

Initiates the OAuth flow with the specified authentication provider.

```
GET /api/login/:provider
```

#### Parameters

| Name | Type | In | Description |
|------|------|-------|------------|
| provider | string | path | Authentication provider: `github`, `gitlab`, `bitbucket`, `google`, `desktop`, or `local` |

#### Response

Redirects to the provider's authentication page.

### OAuth Return

Callback endpoint for OAuth providers to return authentication code.

```
GET /api/oauth/return
```

#### Parameters

| Name | Type | In | Description |
|------|------|-------|------------|
| code | string | query | OAuth authentication code |
| state | string | query | (Optional) OAuth state parameter |

#### Response

Redirects to the frontend with the authentication code.

### Complete Login

Completes the authentication process and issues tokens.

```
GET /api/oauth/:provider
```

#### Parameters

| Name | Type | In | Description |
|------|------|-------|------------|
| provider | string | path | Authentication provider |
| code | string | query | OAuth authentication code |

#### Response

```json
{
  "status": "success",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 900
  }
}
```

### Refresh Token

Refreshes an expired access token using a refresh token.

```
POST /api/token/refresh
```

#### Request Body

```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Response

```json
{
  "status": "success",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 900
  }
}
```

### Logout

Revokes the user's refresh token and invalidates their session.

```
POST /api/logout
```

#### Request Body

```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Response

```json
{
  "status": "success",
  "data": ""
}
```

## Threat Model API

### Get Organizations

Retrieves the list of organizations (only relevant for GitHub, GitLab, Bitbucket).

```
GET /api/threatmodel/organisation
```

#### Response

```json
{
  "status": "success",
  "data": ["org1", "org2", "org3"]
}
```

### Get Repositories

Retrieves the list of repositories for the authenticated user.

```
GET /api/threatmodel/repos
```

#### Parameters

| Name | Type | In | Description |
|------|------|-------|------------|
| page | string | query | (Optional) Page number for paginated results |
| searchQuery | string | query | (Optional) Search query to filter repositories |

#### Response

```json
{
  "status": "success",
  "data": [
    {
      "name": "repo1",
      "fullName": "org1/repo1",
      "description": "Repository description",
      "defaultBranch": "main"
    }
  ]
}
```

### Get Branches

Retrieves the branches for a specific repository.

```
GET /api/threatmodel/:organisation/:repo/branches
```

#### Parameters

| Name | Type | In | Description |
|------|------|-------|------------|
| organisation | string | path | Organisation name |
| repo | string | path | Repository name |
| page | string | query | (Optional) Page number for paginated results |

#### Response

```json
{
  "status": "success",
  "data": ["main", "development", "feature/new-feature"]
}
```

### Get Models

Retrieves the threat models in a specific branch.

```
GET /api/threatmodel/:organisation/:repo/:branch/models
```

#### Parameters

| Name | Type | In | Description |
|------|------|-------|------------|
| organisation | string | path | Organisation name |
| repo | string | path | Repository name |
| branch | string | path | Branch name |

#### Response

```json
{
  "status": "success",
  "data": [
    {
      "name": "model1.json",
      "path": "ThreatDragonModels/model1.json",
      "title": "Model 1"
    }
  ]
}
```

### Get Model Data

Retrieves the data for a specific threat model.

```
GET /api/threatmodel/:organisation/:repo/:branch/:model/data
```

#### Parameters

| Name | Type | In | Description |
|------|------|-------|------------|
| organisation | string | path | Organisation name |
| repo | string | path | Repository name |
| branch | string | path | Branch name |
| model | string | path | Model file name |

#### Response

```json
{
  "status": "success",
  "data": {
    "summary": {
      "title": "Threat Model Title",
      "description": "Threat model description",
      "owner": "John Doe"
    },
    "detail": {
      "contributors": ["Contributor 1", "Contributor 2"],
      "diagrams": [
        {
          "id": "diagram1",
          "title": "Diagram 1",
          "description": "Diagram description",
          "cells": []
        }
      ]
    }
  }
}
```

### Create Branch

Creates a new branch in a repository.

```
POST /api/threatmodel/:organisation/:repo/:branch/createBranch
```

#### Parameters

| Name | Type | In | Description |
|------|------|-------|------------|
| organisation | string | path | Organisation name |
| repo | string | path | Repository name |
| branch | string | path | New branch name |

#### Request Body

```json
{
  "refBranch": "main"
}
```

#### Response

```json
{
  "status": "success",
  "data": {
    "branch": "new-branch"
  }
}
```

### Create Model

Creates a new threat model.

```
POST /api/threatmodel/:organisation/:repo/:branch/:model/create
```

#### Parameters

| Name | Type | In | Description |
|------|------|-------|------------|
| organisation | string | path | Organisation name |
| repo | string | path | Repository name |
| branch | string | path | Branch name |
| model | string | path | Model file name |

#### Request Body

```json
{
  "summary": {
    "title": "New Threat Model",
    "description": "Description of the threat model",
    "owner": "John Doe"
  },
  "detail": {
    "contributors": ["Contributor 1"],
    "diagrams": []
  }
}
```

#### Response

```json
{
  "status": "success",
  "data": true
}
```

### Update Model

Updates an existing threat model.

```
PUT /api/threatmodel/:organisation/:repo/:branch/:model/update
```

#### Parameters

| Name | Type | In | Description |
|------|------|-------|------------|
| organisation | string | path | Organisation name |
| repo | string | path | Repository name |
| branch | string | path | Branch name |
| model | string | path | Model file name |

#### Request Body

Same as Create Model.

#### Response

```json
{
  "status": "success",
  "data": true
}
```

## Google Drive API

### Get Folders

Retrieves the list of folders in Google Drive.

```
GET /api/googleproviderthreatmodel/folders
```

#### Parameters

| Name | Type | In | Description |
|------|------|-------|------------|
| page | string | query | (Optional) Page number for paginated results |
| folderId | string | query | (Optional) Parent folder ID |

#### Response

```json
{
  "status": "success",
  "data": [
    {
      "id": "folder-id-1",
      "name": "Folder 1"
    }
  ]
}
```

### Create Model in Google Drive

Creates a new threat model in a Google Drive folder.

```
POST /api/googleproviderthreatmodel/:folder/create
```

#### Parameters

| Name | Type | In | Description |
|------|------|-------|------------|
| folder | string | path | Folder ID |

#### Request Body

```json
{
  "fileContent": {
    "summary": {
      "title": "New Google Drive Model",
      "description": "Description",
      "owner": "John Doe"
    },
    "detail": {
      "contributors": [],
      "diagrams": []
    }
  },
  "fileName": "model-name.json"
}
```

#### Response

```json
{
  "status": "success",
  "data": true
}
```

### Update Model in Google Drive

Updates an existing threat model in Google Drive.

```
PUT /api/googleproviderthreatmodel/:file/update
```

#### Parameters

| Name | Type | In | Description |
|------|------|-------|------------|
| file | string | path | File ID |

#### Request Body

```json
{
  "fileContent": {
    "summary": {
      "title": "Updated Google Drive Model",
      "description": "Updated description",
      "owner": "John Doe"
    },
    "detail": {
      "contributors": [],
      "diagrams": []
    }
  }
}
```

#### Response

```json
{
  "status": "success",
  "data": true
}
```

### Get Model Data from Google Drive

Retrieves model data from Google Drive.

```
GET /api/googleproviderthreatmodel/:file/data
```

#### Parameters

| Name | Type | In | Description |
|------|------|-------|------------|
| file | string | path | File ID |

#### Response

Similar to Get Model Data.

## Security Features

Threat Dragon implements several security features to protect user data and prevent attacks:

### 1. Authentication Security

- **Token Rotation**: Refresh tokens are rotated with each use to prevent token theft
- **Short-lived Access Tokens**: Access tokens expire after 15 minutes
- **Token Revocation**: Both access and refresh tokens can be revoked
- **Token Family Tracking**: Prevents token reuse attacks by tracking related tokens

### 2. Input Validation

- **JSON Schema Validation**: All API inputs are validated against defined schemas
- **Input Sanitization**: User inputs are sanitized to prevent injection attacks
- **Parameter Type Checking**: Type checking and coercion for API parameters

### 3. Rate Limiting

The API implements a tiered rate limiting system:

- **General API**: 6000 requests per 30 minutes
- **Authentication Endpoints**: 100 requests per 15 minutes
- **Sensitive Operations**: 50 requests per 60 minutes

### 4. CSRF Protection

- **Token-based CSRF Protection**: All state-changing operations require a valid CSRF token
- **Same-Site Cookies**: Cookies are configured with SameSite attribute to prevent CSRF

### 5. Content Security Policy

Implements a strict Content Security Policy (CSP) with:

- **Default-Src 'none'**: Restrictive by default
- **Nonce-based Script and Style Execution**: Uses cryptographic nonces for inline scripts
- **Frame-Ancestors 'none'**: Prevents clickjacking

### 6. HTTPS and TLS

- **HTTPS Enforced**: Automatic HTTPS redirection in production
- **HSTS Headers**: HTTP Strict Transport Security headers with long expiration
- **TLS Configuration**: Support for secure TLS versions and cipher suites

## Error Handling

All API endpoints return standardized error responses with the following structure:

```json
{
  "status": "error",
  "message": "Human-readable error message",
  "errors": [
    {
      "path": "/propertyPath",
      "message": "Specific error description",
      "keyword": "validationKeyword"
    }
  ]
}
```

### Common Error Status Codes

- **400 Bad Request**: Input validation failed
- **401 Unauthorized**: Authentication required
- **403 Forbidden**: Insufficient permissions
- **404 Not Found**: Resource not found
- **422 Unprocessable Entity**: Request format is correct but semantically invalid
- **429 Too Many Requests**: Rate limit exceeded
- **500 Internal Server Error**: Server-side error

Error responses do not include sensitive information that could expose implementation details.
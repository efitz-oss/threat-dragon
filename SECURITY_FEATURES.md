# OWASP Threat Dragon Security Features

This document outlines the security features implemented in OWASP Threat Dragon to protect user data and prevent common web application vulnerabilities.

## Table of Contents

1. [Authentication Security](#authentication-security)
2. [CSRF Protection](#csrf-protection)
3. [Content Security Policy](#content-security-policy)
4. [Input Validation](#input-validation)
5. [Rate Limiting](#rate-limiting)
6. [HTTPS and Transport Layer Security](#https-and-transport-layer-security)
7. [Secure Headers](#secure-headers)
8. [Error Handling](#error-handling)
9. [Frontend Security](#frontend-security)
10. [Security Recommendations](#security-recommendations)

## Authentication Security

### JWT-Based Authentication

Threat Dragon implements JWT (JSON Web Token) authentication with the following security enhancements:

#### Token Anatomy

- **Access Tokens**: Short-lived tokens used for API access
  - 15-minute expiration
  - Contains user information and permissions
  - Signed with a dedicated signing key

- **Refresh Tokens**: Longer-lived tokens used to obtain new access tokens
  - 7-day expiration
  - Different payload than access tokens
  - Signed with a separate signing key

#### Advanced Token Security Features

1. **Token Rotation**
   - Refresh tokens are automatically rotated with each use
   - New refresh token is issued when an old one is used
   - Old tokens are marked as "used" to prevent replay attacks

2. **Token Family Tracking**
   - Each initial login creates a token "family"
   - All subsequent refresh tokens belong to the same family
   - Family ID and generation number are tracked for each token

3. **Reuse Detection**
   - If a previously used refresh token is presented, the entire family is revoked
   - Helps detect and prevent token theft and reuse

4. **Cascade Revocation**
   - When a token is revoked, all tokens in the same family are revoked
   - Prevents attackers from using older tokens in the same family

5. **Access Token Blacklisting**
   - Revoked access tokens are added to a blacklist until expiration
   - Prevents use of leaked access tokens

6. **Token Storage**
   - Refresh tokens are stored securely on the server
   - File-based storage with planned database implementation
   - In-memory cache for performance with persistence for reliability

7. **Persistent Storage**
   - Token information persists across server restarts
   - Ensures logout operations remain effective

## CSRF Protection

Threat Dragon implements token-based Cross-Site Request Forgery (CSRF) protection:

1. **Token-based Protection**
   - Server generates a cryptographically secure CSRF token for each user session
   - Token is required for all state-changing operations (POST, PUT, DELETE)

2. **Double-Submit Cookie Pattern**
   - CSRF secret stored in a secure, HTTP-only cookie
   - CSRF token derived from the secret must be included in requests
   - Prevents attackers from forging authenticated requests

3. **Implementation Details**
   - Secure, HTTP-only cookie for CSRF secret
   - Same-site cookie attribute to prevent cross-site cookie leakage
   - Custom validation middleware to enforce token presence and validity

4. **Token Delivery**
   - Frontend can request a CSRF token via a dedicated endpoint
   - Token is included in requests via custom HTTP header or form field

## Content Security Policy

Threat Dragon implements a strict Content Security Policy to prevent XSS and other injection attacks:

1. **Default Policy**
   - Default-src: 'none' (deny by default)
   - Script-src: 'self' and nonce-based inline scripts
   - Style-src: 'self', Google Fonts, and nonce-based inline styles
   - Font-src: 'self', Google Fonts
   - Img-src: 'self', data:
   - Connect-src: 'self'
   - Form-action: 'self', GitHub (for OAuth)
   - Frame-ancestors: 'none' (prevents clickjacking)

2. **Nonce-based Execution**
   - Unique cryptographic nonce generated for each request
   - Required for any inline script or style execution
   - Prevents injection of malicious scripts

3. **Report-Only Mode**
   - Available during development to identify CSP violations
   - Helps fine-tune the policy without breaking functionality

## Input Validation

Threat Dragon implements comprehensive input validation to prevent injection attacks and ensure data integrity:

1. **JSON Schema Validation**
   - All API inputs validated against defined schemas
   - Required fields, data types, and formats enforced
   - Prevents malformed or malicious inputs

2. **Schema-based Validation Features**
   - Type checking and coercion
   - Required field validation
   - String length constraints
   - Numeric range validation
   - Pattern matching via regular expressions
   - Enumeration validation
   - Complex object validation

3. **Sanitization**
   - Dangerous HTML stripped from user inputs
   - JavaScript protocols blocked
   - Event handlers blocked
   - Additional properties removed

4. **Implementation**
   - Centralized validation middleware using AJV
   - Consistent error format for validation failures
   - Route-specific validation rules

## Rate Limiting

Threat Dragon implements a tiered rate limiting system to prevent abuse and denial of service:

1. **General API Rate Limiting**
   - 6,000 requests per 30 minutes (default)
   - Applies to most API endpoints
   - Prevents general API abuse

2. **Authentication Rate Limiting**
   - 100 requests per 15 minutes
   - Applies to login, token refresh, and other authentication endpoints
   - Prevents brute force and credential stuffing attacks

3. **Sensitive Operations Rate Limiting**
   - 50 requests per 60 minutes
   - Applies to password reset, user management, and other sensitive operations
   - Provides extra protection for high-value targets

4. **Implementation Details**
   - Express Rate Limit middleware
   - Sliding window algorithm
   - Standard rate limit headers
   - Custom rate limit error messages

## HTTPS and Transport Layer Security

Threat Dragon enforces secure communications:

1. **HTTPS Enforcement**
   - Automatic HTTP to HTTPS redirection
   - HSTS headers with long expiration
   - Secure cookie attributes

2. **TLS Configuration**
   - Supports TLS 1.2+ only
   - Strong cipher suites
   - Perfect forward secrecy
   - Key exchange algorithms with forward secrecy

3. **Certificate Management**
   - Support for custom TLS certificates
   - Environment variables for certificate configuration

## Secure Headers

Threat Dragon sets security-related HTTP headers using Helmet:

1. **X-Content-Type-Options: nosniff**
   - Prevents MIME type sniffing

2. **X-XSS-Protection: 1; mode=block**
   - Enables browser's XSS filters

3. **X-Frame-Options: DENY**
   - Prevents clickjacking by disallowing framing

4. **Referrer-Policy: strict-origin-when-cross-origin**
   - Limits information in the Referer header

5. **Cache-Control Headers**
   - Prevents caching of sensitive information
   - Especially for authentication endpoints

## Error Handling

Threat Dragon implements secure error handling:

1. **Sanitized Error Responses**
   - Stack traces never exposed to users
   - Detailed errors logged internally but not externally
   - Generic error messages for sensitive operations

2. **Consistent Error Format**
   - Standardized error response structure
   - Appropriate HTTP status codes
   - Validation-specific error details when appropriate

3. **Logging Practices**
   - Errors logged with appropriate severity levels
   - Sensitive data redacted from logs
   - Audit logging for security-relevant events

## Frontend Security

Threat Dragon's frontend implements several security features:

1. **Optimized Component Loading**
   - Progressive loading of components
   - Route-based component loading
   - Reduces attack surface by loading only needed code

2. **XSS Prevention**
   - Vue's automatic HTML escaping
   - CSP enforcement
   - Input validation

3. **Secure State Management**
   - Pinia store with security-focused design
   - No sensitive data in localStorage
   - Proper token handling

4. **Network Security**
   - Interceptors for authentication
   - CSRF token inclusion in requests
   - Error handling that doesn't expose sensitive information

## Security Recommendations

For production deployments of Threat Dragon, we recommend:

1. **Environment Variables**
   - Use strong, unique cryptographic keys for all JWT signing and encryption
   - Generate keys using a secure random generator
   - Rotate keys periodically
   - Do not commit keys to source control

2. **Rate Limiting**
   - Adjust rate limits based on your expected traffic
   - Consider using a more robust rate limiting solution for high-traffic deployments
   - Monitor for unusual traffic patterns

3. **HTTPS Configuration**
   - Use trusted TLS certificates
   - Configure proper certificate renewal
   - Regularly test TLS configuration with tools like SSL Labs

4. **Authentication**
   - Consider shorter token lifetimes for high-security deployments
   - Implement additional authentication factors for sensitive operations
   - Use secure, randomly generated secrets for token signing

5. **Monitoring and Logging**
   - Implement centralized logging
   - Set up alerts for suspicious activity
   - Regularly review security logs
   - Consider using a web application firewall (WAF)
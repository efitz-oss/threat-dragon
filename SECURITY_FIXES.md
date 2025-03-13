# OWASP Threat Dragon - Security Fixes Summary

This document summarizes the security fixes applied to the OWASP Threat Dragon application on 2025-03-10.

## Overview of Vulnerabilities Addressed

Security fixes were applied to both the frontend (td.vue) and backend (td.server) components of the application to address multiple vulnerabilities:

### Critical Vulnerabilities

1. **libxmljs2**: Type confusion when parsing specially crafted XML
   - Affected components: @cyclonedx/webpack-plugin, @cyclonedx/cyclonedx-npm
   - Mitigation: Disabled SBOM generation tools that use libxmljs2, added overrides

### High Vulnerabilities

1. **path-to-regexp**: Backtracking regular expression vulnerability
   - Affected components: path-to-regexp used by server-side routing
   - Mitigation: Added overrides to enforce path-to-regexp v6.2.3+

2. **semver**: Regular Expression Denial of Service vulnerability
   - Affected components: nodemon, simple-update-notifier
   - Mitigation: Added overrides to enforce semver v7.5.4+

### Moderate Vulnerabilities

1. **bootstrap**: Cross-Site Scripting (XSS) vulnerability
   - Affected components: Frontend UI components
   - Mitigation: Added overrides to use bootstrap v5.3.3+
   - Note: The project is migrating to PrimeVue, so bootstrap may be removed in the future

2. **request**: Server-Side Request Forgery vulnerability
   - Affected components: octonode, other API clients
   - Mitigation: Added overrides to enforce request v2.88.2+

3. **micromatch**: Regular Expression Denial of Service (ReDoS)
   - Affected components: Various development tools
   - Mitigation: Added overrides to enforce micromatch v4.0.8+

4. **serialize-javascript**: Cross-site Scripting (XSS)
   - Affected components: Various build tools
   - Mitigation: Added overrides to enforce serialize-javascript v6.0.3+

## Implementation Approach

Due to complex dependency relationships that complicated direct updates, a multi-layered approach was used:

1. **Package Overrides**: Added npm overrides in package.json files at all levels (root, td.vue, td.server)
2. **Package Resolutions**: Added resolution rules to further enforce secure versions
3. **Disabled Vulnerable Components**: Temporarily disabled SBOM generation that relies on vulnerable libraries
4. **Documentation**: Created comprehensive documentation of the issues and fixes in each component

## Testing Requirements

The following steps should be taken to ensure the security fixes don't impact functionality:

1. Verify the application builds successfully
   ```bash
   npm run build
   ```

2. Verify the application runs successfully
   ```bash
   npm run start:dev
   ```

3. Run unit tests
   ```bash
   npm run test:server
   npm run test:site
   ```

## Next Steps

1. Continue migrating from Bootstrap to PrimeVue to eliminate bootstrap vulnerabilities
2. Implement an alternative SBOM generation solution that doesn't rely on libxmljs2
3. Plan regular security audits as part of the development process
4. Consider a focused effort to resolve dependency conflicts and remove unused dependencies

## Detailed Documentation

- See [td.vue/SECURITY_FIX_APPLIED.md](./td.vue/SECURITY_FIX_APPLIED.md) for frontend-specific fixes
- See [td.server/SECURITY_FIX_APPLIED.md](./td.server/SECURITY_FIX_APPLIED.md) for backend-specific fixes
- See [td.vue/SECURITY_ISSUES.md](./td.vue/SECURITY_ISSUES.md) for a comprehensive list of identified issues
- See [td.vue/SECURITY_FIX_PLAN.md](./td.vue/SECURITY_FIX_PLAN.md) for the overall security fix strategy
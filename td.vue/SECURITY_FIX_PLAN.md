# Security Vulnerability Fix Plan

This document outlines the security vulnerabilities found in the Threat Dragon project and provides a step-by-step plan to fix them with minimal breaking changes.

## Current Security Issues

Based on our latest npm audit, the following security issues were identified:

### Critical Severity
1. **libxmljs2** - Type confusion when parsing specially crafted XML
   - Affects: @cyclonedx/webpack-plugin

### Moderate Severity
1. **bootstrap (4.0.0 - 4.6.2)** - Cross-Site Scripting (XSS) vulnerability
2. **micromatch (<4.0.8)** - Regular Expression Denial of Service (ReDoS)
3. **request** - Server-Side Request Forgery
4. **serialize-javascript (<6.0.2)** - Cross-site Scripting (XSS)
5. **vue-template-compiler (>=2.0.0)** - client-side Cross-Site Scripting (XSS)

## Dependency Conflicts

Attempts to fix the security issues have revealed several dependency conflicts that prevent straightforward fixes:

1. **babel-jest version conflict**:
   ```
   Found: babel-jest@29.7.0
   Could not resolve dependency:
   peer babel-jest@">= 27 < 28" from @vue/vue2-jest@27.0.0
   ```

2. **serialize-javascript version conflict**:
   ```
   No matching version found for serialize-javascript@>=6.0.3
   ```

3. **Complex interrelated dependencies**:
   The npm audit shows that many of the security issues are in transitive dependencies rather than direct dependencies, making them harder to fix without impacting the entire dependency tree.

## Fix Approach

### 1. Fix Critical Issues First

The libxmljs2 vulnerability through @cyclonedx/webpack-plugin is the most urgent to address. Two approaches are possible:

**Option A: Update the plugin**
```bash
# Temporarily remove problematic resolutions
npm uninstall @cyclonedx/webpack-plugin
npm install @cyclonedx/webpack-plugin@latest --save-dev --legacy-peer-deps
```

**Option B: Replace with Alternative (Recommended)**
```bash
# Remove the vulnerable plugin
npm uninstall @cyclonedx/webpack-plugin --save-dev

# Install safer alternative
npm install @cyclonedx/bom --save-dev --legacy-peer-deps
```

**Option C: Disable SBOM Generation Temporarily**
Find where the CycloneDX webpack plugin is configured in your webpack config and comment it out or remove it until a safer alternative can be implemented.

### 2. Fix Moderate Issues with Minimal Breaking Changes

#### 2.1 Fix http-proxy-middleware
This can be addressed with minimal risk:
```bash
npm install http-proxy-middleware@2.0.7 --save --legacy-peer-deps
```

#### 2.2 Address Bootstrap Carefully
Due to the migration to PrimeVue, consider:
```bash
# Option 1: Keep current version and document the issue
# Option 2: Remove bootstrap if no longer needed
npm uninstall bootstrap --save
```

#### 2.3 For Remaining Issues
For the remaining issues (micromatch, request, serialize-javascript, vue-template-compiler), careful planning is needed:

1. Create a separate branch for security fixes
2. Run targeted upgrades one at a time
3. Test extensively after each upgrade
4. If a fix causes breaking changes, document the workarounds

## Testing Plan

After implementing the security fixes:

1. Run the unit tests
```bash
npm run test:unit
```

2. Check that the application still builds correctly
```bash
npm run build
```

3. Run E2E tests if available
```bash
npm run test:e2e
```

## Long-Term Recommendations

1. **Dependency Cleanup**: Consider removing unused or deprecated dependencies
2. **Regular Security Audits**: Make security scans part of your CI/CD pipeline
3. **Pinned Dependencies**: Consider pinning dependencies to specific versions known to be secure
4. **Runtime Protection**: Add security headers and CSP rules to protect against XSS attacks

## Implementation Notes

Given the complex dependency graph and potential for breaking changes, we recommend addressing these issues in the following order:

1. Fix critical vulnerabilities (libxmljs2) first
2. Fix direct dependencies with safe updates
3. Consider force-upgrading the most problematic transitive dependencies
4. Document any known vulnerabilities that cannot be safely fixed immediately

For any fixes that require removing features or functionality, consult with the development team before proceeding.
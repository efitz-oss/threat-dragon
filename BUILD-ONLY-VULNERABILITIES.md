# Build-Only Vulnerabilities

This document lists vulnerabilities that only affect the build environment and not production deployments of Threat Dragon.

## Development Dependencies Only

These vulnerabilities exist in development dependencies and don't affect production builds:

1. **braces <3.0.3 (High Severity)**
   - Description: Uncontrolled resource consumption vulnerability in braces
   - Affects: Only development tools via webpack/vue-cli-plugin-electron-builder
   - Impact: Only development environment, not production builds

2. **minimatch <3.0.5 (High Severity)**
   - Description: Regular expression denial of service (ReDoS) vulnerability
   - Affects: Development tooling via dir-compare
   - Impact: Only affects build tools, not production code

3. **request (Moderate Severity)**
   - Description: Server-side request forgery (SSRF) vulnerability
   - Affects: Vue CLI development tooling
   - Impact: Only affects development environment

4. **tough-cookie <4.1.3 (Moderate Severity)**
   - Description: Prototype pollution vulnerability
   - Affects: Development tools via request
   - Impact: Only affects development environment

## Recommendation

These vulnerabilities should be tracked and updated when practical, but they don't represent immediate security risks to production deployments or end users. They may be addressed as part of regular dependency maintenance.

Regular audits should be performed to ensure no build-only vulnerabilities become production vulnerabilities due to changes in dependency relationships.
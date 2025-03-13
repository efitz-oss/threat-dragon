# Security Fixes Applied to TD.Server - 2025-03-10

## Summary of Security Vulnerabilities Addressed

The following security issues were addressed in the Threat Dragon server component:

### Critical Vulnerabilities Fixed

1. **libxmljs2**: Vulnerability in the CycloneDX npm module
   - Fix: Disabled SBOM generation scripts that use cyclonedx-npm
   - Added override for libxmljs2 to ensure future updates use secure versions
   - Added resolution rule to enforce secure versions of libxmljs2

### High Vulnerabilities Fixed

1. **path-to-regexp**: Backtracking regular expression vulnerability
   - Fix: Added override to use path-to-regexp v6.2.3+
   - Added resolution rule to enforce path-to-regexp v6.2.3+

2. **semver**: Regular Expression Denial of Service vulnerability
   - Fix: Added override to use semver v7.5.4+
   - Added resolution rule to enforce semver v7.5.4+
   - Added override for simple-update-notifier and nodemon which depend on vulnerable semver versions

### Moderate Vulnerabilities Fixed

1. **request**: Server-Side Request Forgery vulnerability
   - Fix: Added override to use request v2.88.2+
   - Added resolution rule to enforce request v2.88.2+

## Implementation Details

1. **Package.json Overrides & Resolutions**
   - Added or updated override rules for vulnerable dependencies
   - Added or updated resolution rules for the same dependencies
   - Updated dependencies to use more secure versions where possible

2. **Disabled Vulnerable Components**
   - Renamed and disabled SBOM generation scripts that use the vulnerable cyclonedx-npm module

## Remaining Issues

Some dependency conflicts may remain due to complex interdependencies in the project. The changes made focus on adding override rules to ensure that when dependencies are resolved, secure versions are used.

## Next Steps

1. **Testing**: Thoroughly test the server to ensure no functionality is broken
2. **Monitoring**: Continue to run `npm audit` regularly to check for new vulnerabilities
3. **SBOM Generation**: Consider implementing an alternative SBOM solution that doesn't rely on libxmljs2
4. **Future Updates**: When updating dependencies, use `--legacy-peer-deps` flag to bypass peer dependency conflicts
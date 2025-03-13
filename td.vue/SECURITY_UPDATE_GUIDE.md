# Security Update Guide for OWASP Threat Dragon

This guide outlines the steps to fix security vulnerabilities in the Threat Dragon application by removing Vue 2 dependencies and migrating to Vue 3 compatible versions.

## Quick Start

Run the following commands to apply all security fixes:

```bash
# Remove Vue 2 dependencies and regenerate node_modules
cd /Users/efitz/Projects/threat-dragon/td.vue
npm run reinstall

# Start the application with Vue 3 compatibility
npm run dev:vue3
```

## Background

The application has several security vulnerabilities related to:
- Vue 2 dependencies (vue-template-compiler XSS vulnerability)
- Bootstrap 4.x (XSS vulnerability)
- libxmljs2 via CycloneDX plugin (type confusion vulnerability)
- Other transitive dependencies with security issues

## Available Scripts

The following scripts have been created to help fix these issues:

### 1. Dependency Management
- `npm run clean:vue2` - Removes Vue 2 specific dependencies
- `npm run fix:move-file` - Fixes deprecated @npmcli/move-file with @npmcli/fs
- `npm run reinstall` - Completely regenerates node_modules with Vue 3 compatibility

### 2. Development
- `npm run dev:safe` - Runs the dev server with SCSS fixes
- `npm run dev:vue3` - Runs the dev server with Vue 3 compatibility

### 3. Build
- `npm run build:safe` - Builds without SCSS warnings
- `npm run build:vue3` - Builds with Vue 3 compatibility

### 4. Security Audits
- `npm run audit:fix:safe` - Applies safe security fixes
- `npm run audit:fix:interactive` - Interactive security fix tool
- `npm run audit:check:cyclonedx` - Checks for libxmljs2 vulnerability

## How the Fixes Work

1. **Dependency Removals**:
   - Removes bootstrap, bootstrap-vue, vue-template-compiler, and other Vue 2 packages
   - Physical removal from node_modules directory

2. **Override Rules**:
   - Package.json contains overrides to enforce secure versions
   - Covers all known vulnerable dependencies

3. **Configuration Changes**:
   - CycloneDX webpack plugin is disabled to avoid libxmljs2 vulnerability
   - SCSS imports are fixed to avoid build warnings

4. **Vue 3 Compatibility**:
   - The application already uses Vue 3, these changes ensure all dependencies are compatible
   - Using `--legacy-peer-deps` flag with npm to bypass dependency conflicts

## Verification

After applying the fixes, you should verify:

1. Run a security audit to confirm issues are resolved:
   ```bash
   npm audit
   ```

2. Test the application functionality:
   ```bash
   npm run dev:vue3
   ```

3. Build the application:
   ```bash
   npm run build:vue3
   ```

## Future Maintenance

To maintain security going forward:

1. **Regular Audits**: Run `npm audit` regularly
2. **Dependency Updates**: Keep dependencies updated
3. **Remove Unused Code**: Continue removing Vue 2 legacy code
4. **Test Thoroughly**: Test all changes thoroughly

## Documentation

For more detailed information about the security fixes:

- See [VUE3_SECURITY_FIXES.md](./VUE3_SECURITY_FIXES.md) for details on Vue 3 security fixes
- See [SECURITY_ISSUES.md](./SECURITY_ISSUES.md) for a comprehensive list of identified vulnerabilities
- See [SECURITY_FIX_PLAN.md](./SECURITY_FIX_PLAN.md) for the security fix strategy
- See [SECURITY_FIX_APPLIED.md](./SECURITY_FIX_APPLIED.md) for details on the applied fixes
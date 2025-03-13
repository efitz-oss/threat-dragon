# ESM Migration Guide

This document describes the changes made to convert Threat Dragon to use ECMAScript Modules (ESM) exclusively.

## Changes Made

1. **Package Configuration**
   - Added `"type": "module"` to all package.json files (root, td.server, td.vue)
   - Updated script commands to be ESM-compatible

2. **Configuration Files**
   - Converted from CommonJS to ESM:
     - Babel configs: `.babelrc` → `babel.config.mjs`
     - ESLint configs: `.eslintrc.js` → `.eslintrc.mjs`
   - Changed `module.exports = {...}` to `export default {...}`

3. **Build System**
   - Vite was already configured for ESM output
   - Updated config files to use explicit ESM imports/exports

4. **Server Runner**
   - Created ESM-compatible server runner: `dev.mjs`
   - Updated PM2 scripts to use ESM entry points

5. **Vue Runner**
   - Created ESM-compatible Vue runner: `vite-runner.mjs`

6. **Test Configuration**
   - Added `NODE_OPTIONS=--experimental-vm-modules` for Node.js ESM test support
   - Removed CommonJS transform plugins from Babel config

## Benefits of ESM

- Better tree-shaking for smaller bundles
- Native async/await support
- Consistent module resolution
- Better compatibility with modern tooling
- Improved code encapsulation
- Faster load times

## Potential Issues

For any files that still use CommonJS syntax (`require()`, `module.exports`), you'll need to:

1. Convert `require()` to `import` statements
2. Convert `module.exports` to `export` or `export default`
3. Add file extensions to imports (`.js`)
4. Handle circular dependencies differently
5. Use dynamic imports for conditional loading

## Testing

After making these changes, you should test:

1. Development workflow: `npm run dev:server` and `npm run dev:vue`
2. Production build: `npm run build`
3. Test execution: `npm test`
4. Desktop builds: `npm run build:desktop`
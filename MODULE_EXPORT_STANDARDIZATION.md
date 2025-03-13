# Module Export Standardization

## Overview
This document outlines the changes made to standardize module export patterns in the OWASP Threat Dragon codebase. The standardization was performed as part of the modern JavaScript improvements initiative (item #3).

## Standardization Principles
1. **Consistency**: Adopt a consistent pattern across the codebase
2. **Discoverability**: Make exports easy to find and use
3. **Modularity**: Encourage single-responsibility modules

## Guidelines Implemented
1. **Named Exports for Most Cases**:
   - Functions, constants, and utilities use named exports
   - Example: `export function calculateRisk() {...}`

2. **Classes**:
   - Classes use named exports
   - Example: `export class GithubEnv extends Env {...}`

3. **Default Exports**:
   - Removed in favor of named exports
   - Improves modularity and allows importing only what's needed

4. **Module Re-exports**:
   - Used in index.js files to create a clean public API
   - Example: `export { getProvider as get, setProvider as set }`

## Files Modified

### Environment Configuration
- `/td.server/src/env/Env.js`: Converted default export to named exports `export class Env` and `export function getEnvironment()`
- `/td.server/src/env/Github.js`: Converted default export to named export `export class GithubEnv`

### Helpers
- `/td.server/src/helpers/crypto.promise.js`: Converted default export to named export `export function randomBytes()`
- `/td.server/src/helpers/encryption.helper.js`: Converted default export to named exports for all utility functions
- `/td.server/src/helpers/logger.helper.js`: Converted default export to named exports `export class Logger`, `export function getLogger()` and `export function setLogLevel()`

### Repositories
- `/td.server/src/repositories/index.js`: Converted default export to named exports with aliases for backward compatibility
- `/td.server/src/repositories/githubRepo.js`: Converted default export to named exports for all repository functions

### Application Core
- `/td.server/src/app.js`: Converted default export to named export `export function create()`
- `/td.server/src/index.js`: Converted default export to named export `export async function createServer()`
- `/td.server/index.js`: Updated import to use named import `import { create }`
- `/td.server/.eslintrc.js`: Converted CommonJS `module.exports` to ESM `export default`

## Benefits
1. **Improved Imports**: Allows importing only what's needed, reducing bundle size
2. **Better IDE Tooling**: Increased auto-import and auto-complete accuracy
3. **Clearer Dependencies**: Makes dependencies between modules more explicit
4. **Easier Refactoring**: Makes extracting functionality to separate modules simpler

## Future Improvements
1. Standardize module exports across the entire td.vue directory
2. Add JSDoc comments to all exported functions, classes, and constants
3. Consider using TypeScript for even better type definitions and module structure
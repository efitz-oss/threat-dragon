# OWASP Threat Dragon - Development Guide

## Build & Run Commands

- Build: `npm run build`
- Analyze bundle: `cd td.vue && npm run build:analyze`
- Dev server: `npm run dev:server` (backend)
- Dev frontend: `npm run dev:vue` (frontend)
- Start app: `npm start`
- Clean: `npm run clean` (cleans all build artifacts)
- Lint: `cd td.vue && npm run lint`

## ESM Configuration

This project uses ECMAScript Modules (ESM) exclusively. Key points:

- All package.json files have `"type": "module"`
- Configuration files use `.mjs` extension
- Import statements require file extensions
- Instead of CommonJS `require()`, use `import`
- Instead of `module.exports`, use `export` or `export default`
- Node.js tests use `--experimental-vm-modules`

## Test Commands

- All tests: `npm test`
- Unit tests: `npm run test:unit`
- Single unit test: `cd td.vue && npm test -- -t "test name pattern"`
- E2E tests: `npm run test:e2e`
- Lint: `cd td.server && npm run lint` or `cd td.vue && npm run lint`

## Code Style Guidelines

- Vue SFCs with template/script/style sections
- Component naming: PascalCase filenames with 'Td' prefix (e.g., `TdFormButton`)
- 4-space indentation, single quotes for strings
- ES modules with explicit imports/exports
- Pinia for state management with modular store design
- Centralized error handling via `errors.js`
- Winston logger (audit, error, warn, info, debug, silly levels)
- REST-style API routes
- Comprehensive test coverage expected for all new features

## Optimization Guidelines

- Use lazy loading with defineAsyncComponent for non-critical components
- Only import the icons that are needed for each view
- Use dynamic imports for i18n language files except English
- Implement code-splitting with Vue Router's dynamic imports
- Use runtime-only Vue in production builds
- Use v-once directive for static components that don't need to be reactive

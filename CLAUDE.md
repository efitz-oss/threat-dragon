# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build Commands

- Start development: `npm run dev:root` (both server and vue)
- Build app: `npm run build:root`
- Test: `npm run test:root` (all tests)
- Test a single test: `npm run test:single "**/path/to/test.spec.js"`
- Lint: `npm run lint:root`
- Lint with auto-fix: `npm run lint:fix:root`
- Generate SBOM: `npm run make-sbom`

## Code Style

- Single quotes for strings
- 4-space indentation
- Semicolons required
- Vue.js code follows 'plugin:vue/essential' rules
- Jest for testing (with vue3-jest for components)
- Cypress for e2e testing

## Project Structure

- td.server: Backend Node.js application
- td.vue: Frontend Vue.js application
- Vue 3 with Vuex state management
- Bootstrap 5 with Bootstrap-Vue-Next
- Desktop application built with Electron

## Naming Conventions

- PascalCase for components
- camelCase for functions and variables
- Use descriptive names that reflect purpose
- Prefix private methods/properties with underscore

### NPM Script Naming Conventions

- `*:server`: Refers to the td.server directory or server app
- `*:vue`: Refers to the td.vue directory or component
- `*:site`: Refers to td.vue running as a web application
- `*:desktop`: Refers to the Electron application
- `*:root`: Refers to scripts operating on the project root

## Error Handling

- Consistent error handling patterns
- Use try/catch blocks for async code
- Provide informative error messages

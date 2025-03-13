# Development Setup for Vue 3 Migration

This document provides guidance on setting up your development environment for working on the Vue 3 migration of Threat Dragon.

## Dependency Issues

The project is currently experiencing some dependency conflicts that affect the development server. These issues are primarily related to:

1. **ESM/CommonJS Module Conflicts**
   - The `ansi-regex` package is now an ES Module (using `export` statements)
   - Some dependencies like `progress-webpack-plugin` use CommonJS `require()` to load it
   - This causes the error: `SyntaxError: Unexpected token 'export'`

2. **Style Resources Loader Issues**
   - Problems with the `vue-cli-plugin-style-resources-loader` configuration
   - Causes errors like: `Cannot read properties of null (reading 'preProcessor')`

## Temporary Solutions

For now, there are a few ways to work around these issues:

### Option 1: Use the Simplified Vue Config

```bash
# Copy the simplified configuration
cp vue.config.simple.js vue.config.js

# Run the development server
npm run dev
```

### Option 2: Fix Dependencies Directly

```bash
# Run the fix-dependencies script
node fix-dependencies.js

# Install dependencies
npm install

# Use the provided configuration
cp vue.config.js.fix vue.config.js

# Run the development server
npm run dev
```

### Option 3: Install Specific Versions

```bash
# Install compatible versions
npm install --save-dev ansi-regex@5.0.1 strip-ansi@6.0.1
npm install --save-dev progress-webpack-plugin@1.0.12

# Restart your development server
npm run dev
```

## Long-term Solution

The recommended long-term solution is to:

1. **Migrate to Vite**
   - Vue CLI is in maintenance mode, while Vite is the recommended build tool for Vue 3
   - Vite has better ESM support and faster development experience
   - Migration would involve creating a `vite.config.js` file and updating scripts

2. **Clean Dependencies**
   - Remove unnecessary legacy dependencies
   - Update to Vue 3 compatible versions
   - Use strict version management with overrides/resolutions

3. **Finish Component Migration**
   - Complete the transition from Vue 2 to Vue 3
   - Replace all Bootstrap-Vue with PrimeVue
   - Remove all Vuex usage in favor of Pinia

## Migration Progress Tracking

To track migration progress, use the provided script:

```bash
# Generate migration report
npm run scan-migration
```

This will create a `migration-tasks.md` file listing all components that need to be migrated.

## Testing

When testing components, make sure to:

1. Use the updated test patterns described in `TEST_MIGRATION_GUIDE.md`
2. Test with both unit tests and in the application
3. Verify that all PrimeVue components render correctly
4. Test Pinia store integration

## Getting Help

If you encounter issues, check:
- The issue tracker for known problems
- The migration guides in the repository
- The Vue Migration Guide: https://v3-migration.vuejs.org/
- The PrimeVue documentation: https://primevue.org/
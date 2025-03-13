# Vue 3 Security Fixes for OWASP Threat Dragon

This document describes the security fixes applied to the Threat Dragon application by upgrading from Vue 2 to Vue 3.

## Background

The project had several security vulnerabilities related to Vue 2 dependencies:

1. **vue-template-compiler**: Vulnerable to client-side Cross-Site Scripting (XSS)
2. **bootstrap (4.x)**: Vulnerable to Cross-Site Scripting (XSS)
3. **libxmljs2** (via @cyclonedx/webpack-plugin): Type confusion vulnerability 
4. Other transitive dependencies with vulnerabilities

## Changes Applied

### 1. Removed Vue 2 Dependencies

The following Vue 2 dependencies were removed:
- `bootstrap` (replaced with PrimeVue components)
- `bootstrap-vue` (replaced with PrimeVue components)
- `vue-template-compiler` (not needed with Vue 3)
- `vue-cli-plugin-bootstrap-vue` (not needed with PrimeVue)
- `@vue/vue2-jest` (replaced with @vue/vue3-jest)
- `popper.js` (no longer needed)

### 2. Added Security Overrides

Package overrides and resolutions were added to enforce secure versions:
```json
"vue-template-compiler": ">=3.5.13",
"bootstrap": ">=5.3.3",
"libxmljs2": ">=1.1.0",
"requestretry": ">=7.0.0",
"path-to-regexp": ">=6.2.3",
"serialize-javascript": ">=6.0.3",
"express": "^5.0.1"
```

### 3. Disabled SBOM Generation

The CycloneDX webpack plugin was disabled in vue.config.js since it uses the vulnerable libxmljs2 library.

### 4. Created Helper Scripts

Several scripts were created to facilitate the migration and maintenance:
- `remove-vue2-dependencies.js`: Removes Vue 2 specific packages
- `regenerate-dependencies.js`: Completely regenerates node_modules with Vue 3 compatibility
- `dev-no-warnings.js`: Runs the development server without SCSS warnings
- `fix-move-file-deps.js`: Replaces deprecated @npmcli/move-file with @npmcli/fs
- `update-express.js`: Updates Express to v5.0.1 to match td.server and fixes path-to-regexp compatibility

## New NPM Commands

The following npm commands are now available:

- `npm run clean:vue2`: Removes Vue 2 specific dependencies
- `npm run fix:move-file`: Fixes deprecated @npmcli/move-file with @npmcli/fs
- `npm run update:express`: Updates Express to v5.0.1 to match td.server
- `npm run fix:webpack`: Applies fixes for webpack-dev-server compatibility
- `npm run reinstall`: Regenerates node_modules with Vue 3 compatibility
- `npm run dev:safe`: Runs the dev server with fixes for SCSS warnings
- `npm run serve:build`: Builds and serves the application for testing
- `npm run dev:vue3`: Runs the dev server with Vue 3 compatibility
- `npm run build:vue3`: Builds the application with Vue 3 compatibility
- `npm run build:safe`: Builds the application without SCSS warnings

## Testing

After applying these changes, you should test the application thoroughly:

1. Verify the UI components work as expected since Bootstrap was removed
2. Test all functionality to ensure Vue 3 compatibility
3. Verify that no new security warnings are introduced
4. Use the built application with `npm run serve:build` for testing, as the development server has compatibility issues with Express 5.0.1

## Benefits

- **Improved Security**: Removed multiple vulnerable dependencies
- **Future-Proof**: Fully migrated to Vue 3, which has long-term support
- **Smaller Bundle Size**: Removed unnecessary dependencies
- **Modern Architecture**: Using Vue 3's Composition API
- **Better Performance**: Vue 3 includes performance improvements over Vue 2
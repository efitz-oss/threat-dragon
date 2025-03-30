# WebdriverIO to Cypress Migration

This document outlines the migration plan from WebdriverIO to Cypress for desktop Electron app testing in Threat Dragon.

## Summary of Changes

We've implemented a two-pronged approach to address npm vulnerabilities:

1. Added package overrides to fix immediate security issues
2. Started migration from WebdriverIO to Cypress for desktop testing
3. Successfully addressed production vulnerabilities (confirmed with `npm audit --omit=dev`)

## Vulnerabilities Addressed

This migration addresses several high and moderate severity vulnerabilities:

1. High severity vulnerability in the `ws` package (8.0.0 - 8.17.0) which is a dependency of WebdriverIO
2. High severity vulnerability in the `cross-spawn` package (<6.0.6) which is a dependency of yorkie/execa
3. Moderate severity vulnerability in the `postcss` package (<8.4.31) used by Vue CLI components

## Migration Plan

### Step 1: Vulnerability Fixes

We've added package resolutions to address immediate vulnerabilities:

```json
"overrides": {
  "cross-spawn": "^7.0.3",       // Fixes vulnerability in yorkie/execa
  "postcss": "^8.4.31",          // Fixes vulnerability in Vue CLI components
  "yorkie": "npm:husky@^7.0.0",  // Replace yorkie with husky
  "@vue/component-compiler-utils": "^3.3.0",  // Update to fix postcss
  "ws": "^8.17.1",               // Fix ws vulnerability
  "puppeteer-core": "^22.12.0"   // Update puppeteer-core
}
```

We've also removed the `@wdio/cli` dependency from the root package.json to prepare for migration away from WebdriverIO.

### Step 2: WebdriverIO Replacement with Cypress

1. Created new Cypress configuration for desktop testing (`e2e.desktop.config.js`)
2. Added Electron-specific support in Cypress (`tests/e2e/support/desktop.js`)
3. Migrated existing WebdriverIO tests to Cypress format (`tests/e2e/desktop/desktop.cy.js`)
4. Updated npm scripts to use Cypress for desktop testing

### Step 3: Removal of WebdriverIO (To be completed)

Once the migration is confirmed working, we will:

1. Remove WebdriverIO dependencies from package.json
2. Remove WebdriverIO config files
3. Remove unused WebdriverIO test files

## Testing Strategy

During the transition period:
- Both WebdriverIO and Cypress tests are maintained (via different npm scripts)
- The original WebdriverIO tests can be run using `npm run test:e2e:desktop:old`
- The new Cypress tests can be run using `npm run test:e2e:desktop`

## Benefits

1. Consolidation of testing frameworks (Cypress for both web and desktop)
2. Removal of vulnerable dependencies
3. Improved test maintainability
4. Reduced dependency footprint

## Requirements for Full Transition

1. Verify all desktop functionality is properly tested in Cypress
2. Ensure Electron IPC bridging works correctly in tests
3. Update CI/CD pipelines to use the new testing approach

## Conclusion and Next Steps

The changes made in this branch have:
1. Successfully addressed production vulnerabilities through package overrides
2. Created the foundation for migrating from WebdriverIO to Cypress for Electron testing
3. Prepared a path to completely remove WebdriverIO dependencies

Further work needed:
1. Complete the migration of all WebdriverIO tests to Cypress format
2. Validate that all desktop functionality works correctly with Cypress tests
3. Remove the WebdriverIO dependencies completely once migration is validated
4. Update CI/CD pipeline configurations to use the new testing approach

Once these steps are completed, we can fully eliminate the vulnerabilities present in the WebdriverIO dependency chain and simplify our testing infrastructure by standardizing on Cypress for all testing.
# Migration Archive Summary

## Purpose

This archive contains files, scripts, and documentation for the WebdriverIO to Cypress migration implemented to address npm vulnerabilities in the Threat Dragon project.

## Archive Contents

1. **Original WebdriverIO Files**
   - `wdio.config.js` - WebdriverIO configuration
   - `desktop.spec.js` - Original WebdriverIO test

2. **New Cypress Migration Files**
   - `e2e.desktop.config.js` - Cypress configuration
   - `desktop.cy.js` - Migrated Cypress test
   - `desktop.js` - Cypress support file

3. **Documentation**
   - `MIGRATION.md` - Migration process documentation
   - `README.md` - Archive documentation
   - `ARCHIVE-SUMMARY.md` - This file

4. **Reference Files**
   - `package-overrides.json` - Dependency overrides used

5. **Scripts**
   - `complete-migration.sh` - Script to finalize migration

## Usage

To complete the migration:
1. Verify all Cypress tests work correctly
2. Run `complete-migration.sh` to clean up WebdriverIO artifacts
3. Update CI/CD configurations to use the new Cypress tests

## Vulnerabilities Addressed

1. High severity vulnerability in `ws` package (8.0.0 - 8.17.0) via WebdriverIO
2. High severity vulnerability in `cross-spawn` package (<6.0.6) via yorkie/execa
3. Moderate severity vulnerability in `postcss` package (<8.4.31) via Vue CLI components

Created: March 30, 2025
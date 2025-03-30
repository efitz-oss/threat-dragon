# WebdriverIO to Cypress Migration Archive

This directory contains files related to the migration from WebdriverIO to Cypress for desktop Electron app testing in Threat Dragon.

## Original WebdriverIO Files

- `wdio.config.js` - WebdriverIO configuration file
- `desktop.spec.js` - Original WebdriverIO test for desktop app

## New Cypress Migration Files

- `e2e.desktop.config.js` - Cypress configuration for desktop testing
- `desktop.cy.js` - Migrated Cypress test for desktop app
- `desktop.js` - Cypress support file for Electron testing

## Documentation

- `MIGRATION.md` - Detailed documentation about the migration process and plan

## Background

This migration was done to address npm vulnerabilities in WebdriverIO dependencies while consolidating testing frameworks to use Cypress for both web and desktop testing. The migration focused on:

1. Fixing vulnerable dependencies through package overrides
2. Setting up Cypress for Electron desktop testing
3. Migrating tests from WebdriverIO to Cypress

The full changes can be found in the `drive-token-reuse-vuln-upgrade` branch.
# Fixing Dependency Issues for Vue 3 Migration

This document outlines the steps to resolve the dependency conflicts that are preventing the development server from starting.

## Current Issues

1. **ESM/CommonJS Module Conflict**
   
   The primary error is related to `ansi-regex`:
   ```
   Error [ERR_REQUIRE_ESM]: require() of ES Module /Users/efitz/Projects/threat-dragon/node_modules/ansi-regex/index.js 
   from /Users/efitz/Projects/threat-dragon/node_modules/progress-webpack-plugin/node_modules/strip-ansi/index.js not supported.
   ```

   This is happening because:
   - `ansi-regex` version 6.x is an ES Module (using `export` instead of `module.exports`)
   - `strip-ansi` in `progress-webpack-plugin` is trying to use CommonJS `require()` to load it
   - The two module systems are incompatible in this way

2. **Dependency Version Conflicts**
   
   Several packages have version conflicts:
   - `ansi-regex` has multiple versions (5.0.1 and 6.0.1) with different module systems
   - `jest` version in package.json (^29.7.0) conflicts with installed version (27.5.1)
   - Multiple versions of `strip-ansi` with different requirements

## Solution Steps

### 1. Fix the ESM/CommonJS Conflict

The most immediate issue is with `ansi-regex`. We need to pin it to a compatible version:

```json
// In package.json under "resolutions"
"resolutions": {
  "ansi-regex": "5.0.1"
}
```

### 2. Update package.json

Create a dedicated script to fix dependencies:

```bash
#!/bin/bash

# Pin problematic dependencies to compatible versions
npm install --save-exact ansi-regex@5.0.1
npm install --save-exact strip-ansi@6.0.1

# Remove progress-webpack-plugin which is causing issues
npm uninstall progress-webpack-plugin
npm install --save-dev progress-webpack-plugin@1.0.12

# Clean install to rebuild dependency tree
npm ci
```

### 3. Alternative Approach Using Overrides

If the above doesn't work, use npm overrides to force specific versions:

```json
// In package.json under "overrides"
"overrides": {
  "ansi-regex": "5.0.1",
  "strip-ansi": "6.0.1",
  "progress-webpack-plugin": "1.0.12"
}
```

### 4. Last Resort: Temporarily Disable Progress Plugin

If the issues persist, we can temporarily modify the webpack configuration to disable the progress-webpack-plugin:

1. Create a `vue.config.js.fix` file with:
```js
module.exports = {
  chainWebpack: config => {
    // Disable progress-webpack-plugin
    config.plugins.delete('progress');
  }
}
```

2. Rename the current vue.config.js and use this temporary one while developing

## Implementing the Fix

1. Create a new npm script in package.json:

```json
"scripts": {
  "fix-deps": "node ./fix-dependencies.js"
}
```

2. Create fix-dependencies.js:

```js
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('Fixing dependency issues...');

// Find and fix ansi-regex in node_modules
const ansiRegexPath = path.resolve(__dirname, 'node_modules/ansi-regex/package.json');
if (fs.existsSync(ansiRegexPath)) {
  const packageJson = JSON.parse(fs.readFileSync(ansiRegexPath, 'utf8'));
  // Check if it's ESM
  if (packageJson.type === 'module') {
    console.log('Converting ansi-regex to CommonJS...');
    delete packageJson.type;
    packageJson.version = '5.0.1';
    fs.writeFileSync(ansiRegexPath, JSON.stringify(packageJson, null, 2));
  }
}

// Add override in package.json if needed
const mainPackagePath = path.resolve(__dirname, 'package.json');
const mainPackage = JSON.parse(fs.readFileSync(mainPackagePath, 'utf8'));

if (!mainPackage.resolutions) {
  mainPackage.resolutions = {};
}

mainPackage.resolutions['ansi-regex'] = '5.0.1';
mainPackage.resolutions['strip-ansi'] = '6.0.1';

fs.writeFileSync(mainPackagePath, JSON.stringify(mainPackage, null, 2));

console.log('Reinstalling dependencies...');
try {
  execSync('npm install', { stdio: 'inherit' });
  console.log('Dependency issues fixed successfully!');
} catch (error) {
  console.error('Error fixing dependencies:', error);
}
```

Run this script with `npm run fix-deps` to resolve the dependency issues.

## Long-term Solution

For a more sustainable solution:

1. **Upgrade Vue CLI to latest version**
   Consider migrating from Vue CLI to Vite for Vue 3 applications, as it has better ESM support

2. **Clean up package.json**
   Remove unnecessary dependencies and ensure all dependencies are compatible with Vue 3

3. **Use strict version pinning**
   Pin critical dependencies to specific versions to prevent future conflicts
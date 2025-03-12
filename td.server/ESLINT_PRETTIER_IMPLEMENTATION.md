# ESLint and Prettier Implementation

This document outlines the plan for configuring ESLint and Prettier for the OWASP Threat Dragon codebase to enforce modern JavaScript standards.

## Current State

The project currently uses ESLint with quite extensive configuration:

1. **Server (td.server)**: 
   - Uses ESLint with many custom rules
   - Uses `@babel/eslint-parser` for parser
   - No Prettier integration
   - Many formatting rules are set to "off"

2. **Vue Frontend (td.vue)**:
   - Uses ESLint with Vue plugin
   - Has rules for Vue 3
   - No Prettier integration
   - Has some formatting rules configured

## Implementation Goals

1. **Standardize Code Style**:
   - Implement consistent code formatting across the codebase
   - Enforce modern JavaScript best practices

2. **Add Prettier**:
   - Integrate Prettier with ESLint to handle code formatting
   - Configure Prettier to match the project's existing style preferences

3. **Update ESLint Configuration**:
   - Use modern ESLint plugins and configurations
   - Focus ESLint on code quality rather than formatting

4. **Add Automated Formatting**:
   - Provide scripts to automatically format the code
   - Configure pre-commit hooks (optional)

## Implementation Steps

### 1. Server-side Implementation (td.server)

1. **Install Prettier and ESLint-Prettier integration**:
   - Add `prettier`, `eslint-config-prettier`, and `eslint-plugin-prettier`

2. **Update ESLint Configuration**:
   - Move formatting rules to Prettier
   - Update ESLint to focus on code quality

3. **Add Prettier Configuration**:
   - Create `.prettierrc.json` with settings that match the project style

4. **Update NPM Scripts**:
   - Add format script to package.json
   - Modify lint script to use the new configuration

### 2. Vue Frontend Implementation (td.vue)

1. **Install Prettier and ESLint-Prettier integration**:
   - Add required Prettier-related packages

2. **Update Vue ESLint Configuration**:
   - Integrate Prettier with Vue ESLint settings
   - Ensure Vue 3 compatibility

3. **Add Prettier Configuration**:
   - Create `.prettierrc.json` with settings that match the Vue style

4. **Update NPM Scripts**:
   - Add format script to package.json
   - Modify lint script to use the new configuration

### 3. Root Project Implementation

1. **Add Root Configuration**:
   - Create root `.prettierrc.json` and `.eslintrc.js` (optional)
   - Add ignore files for both tools

2. **Update Root Package.json**:
   - Add scripts to lint/format the entire codebase

## Configuration Details

### Prettier Configuration

We'll create a `.prettierrc.json` with settings that match the existing code style:

```json
{
  "singleQuote": true,
  "trailingComma": "es5",
  "tabWidth": 4,
  "semi": true,
  "printWidth": 100,
  "endOfLine": "lf"
}
```

### ESLint Configuration Updates

For server:
```js
{
  "extends": [
    "eslint:recommended",
    "plugin:prettier/recommended"
  ],
  // ...other existing settings
}
```

For Vue:
```js
{
  "extends": [
    "plugin:vue/vue3-recommended",
    "eslint:recommended",
    "plugin:prettier/recommended"
  ],
  // ...other existing settings
}
```

## Benefits

1. **Developer Experience**:
   - Automatic formatting reduces cognitive load and discussions about style
   - Cleaner code reviews that focus on substance rather than style

2. **Code Quality**:
   - Consistent code style across the codebase
   - Enforcement of modern JavaScript practices

3. **Productivity**:
   - Reduced time spent on manual formatting
   - Simplified onboarding for new contributors

## Testing and Validation

After implementation, we'll:
1. Run the linting on existing code to identify issues
2. Apply formatting to a sample file to verify settings
3. Ensure CI pipeline passes with the new configuration
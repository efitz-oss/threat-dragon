# Test Migration Issues and Solutions

This document outlines the issues we're encountering when migrating tests from Jest/Vue Test Utils 1 to Vitest/Vue Test Utils 2, and the solutions we're implementing.

## Current Issues

### 1. Vue-demi and @pinia/testing Compatibility

The main issue we're encountering is a compatibility problem with vue-demi and @pinia/testing in the test environment:

```
SyntaxError: The requested module 'vue' does not provide an export named 'default'
```

This is occurring because:

1. Vue 3 doesn't provide a default export, only named exports
2. Vue-demi and @pinia/testing are still expecting the Vue 2 pattern with a default export
3. Our test utilities are importing from vue-test-utils which works fine, but when combined with @pinia/testing, it tries to use Vue's default export
4. Tests that don't use @pinia/testing work correctly with Vue 3

We've confirmed that simple component tests without Pinia integration work fine. The specific issue is with the @pinia/testing package.

### 2. Test Setup Files

When we try to run tests with the shared setup files, we encounter errors due to the vue-demi incompatibility. The problem appears to be in how the test setup is loading dependencies.

### 3. Component Testing Challenges

Some specific challenges for component testing:

- Testing script setup components requires different approaches to access props and methods
- PrimeVue components need proper stubbing
- Many tests rely on Vue 2 patterns (like createLocalVue)
- The tests assume Vuex is available but we've migrated to Pinia

## Solutions Being Implemented

### Short-term Solutions

1. **Custom Shim for vue-demi**:
   - We've created a custom shim at `src/shims/vue-demi.js` that exports the necessary Vue 3 compatibility layer
   - Aliasing this in vite.config.js, but it's not being recognized in tests

2. **Standalone Test Files**:
   - For critical components, we're creating standalone test files that don't use the shared setup
   - These tests use direct imports from vue-test-utils and avoid vue-demi

3. **Simplified Test Utilities**:
   - We've created a `simple-test-utils.js` file that provides the essential functions without vue-demi dependencies
   - This approach works for individual tests but isn't a complete solution

### Long-term Solutions

1. **Update Test Configuration**:
   - Reconfigure Vitest to properly resolve Vue 3 and vue-demi imports
   - Create a separate test-specific Vite configuration if needed

2. **Migrate All Tests**:
   - Systematically update all test files to use Vue 3 patterns
   - Replace Vuex store tests with Pinia tests using createTestingPinia

3. **Use Single Approach for Testing**:
   - Either fix the shared test utilities for all tests, or
   - Migrate all tests to use the simplified approach

## Working Example: FormButton Test

This is a working example of a component test with Vue 3 patterns:

```javascript
import { describe, it, expect, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import FormButton from '../src/components/FormButton.vue';

describe('FormButton Component', () => {
    let wrapper;
    
    beforeEach(() => {
        wrapper = mount(FormButton, {
            props: {
                onBtnClick: () => {},
                text: 'Save',
                icon: 'save',
                isPrimary: true
            },
            global: {
                stubs: {
                    Button: true
                }
            }
        });
    });
    
    it('renders correctly', () => {
        expect(wrapper.exists()).toBe(true);
    });
    
    it('reads props correctly', () => {
        expect(wrapper.props().text).toBe('Save');
    });
});
```

## Working Solutions

We've identified several working approaches:

1. **Separate Test Config**:
   - Created `vitest.simple.config.js` that doesn't use the shared setup
   - This config only includes `.test.js` files to avoid existing test files
   - Works with direct Vue 3 imports and without vue-demi dependencies

```bash
npx vitest run --config vitest.simple.config.js tests/formbutton.test.js
```

2. **Avoid @pinia/testing**:
   - We've confirmed that tests that don't use @pinia/testing package work correctly
   - For component tests that don't need store data, use standard mount without Pinia
   - For components that do need store data, directly provide it via props or mocks

```javascript
// This works:
mount(MyComponent, {
  props: { /* props */ },
  global: {
    stubs: { /* stubs */ },
    mocks: { 
      $store: { /* mock store */ }
    }
  }
});
```

3. **Custom Vue Shim**:
   - Created a custom Vue 3 shim that adds a default export
   - This approach works but isn't ideal long-term

4. **Use Manual Store Mocks**:
   - For tests that need Pinia stores, manually mock the store functions
   - Avoid using createTestingPinia which requires Vue default export

## Migration Plan

1. **Update Test Files Incrementally**:
   - Create a script to help migrate tests from Vue 2 to Vue 3 patterns
   - Start with simple component tests
   - Then move to components with store dependencies
   - Finally update the store tests

2. **Use Dual Testing Approach**:
   - Run critical tests with the simple config during the migration
   - Continue fixing the main test setup in parallel

3. **Document Patterns**:
   - Create example test templates for different component types
   - Document the migration process for future reference

4. **Test Run Strategy**:
   - Use `npx vitest run --config vitest.simple.config.js` for migrated tests
   - Once migration is complete, consolidate to a single approach
# Vue 3 Testing Solution

This document outlines the solution we've found for testing Vue 3 components and Pinia stores in the Threat Dragon project.

## The Problem

When migrating from Vue 2/Vuex to Vue 3/Pinia, we encountered this error in tests:

```
SyntaxError: The requested module 'vue' does not provide an export named 'default'
```

The issue stems from:

1. Vue 3 doesn't provide a default export (unlike Vue 2)
2. Libraries like `vue-demi` and `@pinia/testing` still expect a default export from Vue
3. Test utilities that rely on these libraries fail with the above error

## The Solution

We've developed a successful approach that doesn't require complex shims or hacks:

### 1. Direct Testing with Vue Test Utils

```javascript
import { mount } from '@vue/test-utils';

describe('Component Test', () => {
    let wrapper;
    
    beforeEach(() => {
        wrapper = mount(MyComponent, {
            props: { /* props */ },
            global: {
                stubs: { /* stubs */ }
            }
        });
    });
    
    it('works correctly', () => {
        expect(wrapper.exists()).toBe(true);
    });
});
```

### 2. Direct Store Mocking

Instead of using `@pinia/testing`, directly mock Pinia stores:

```javascript
import { vi } from 'vitest';

// Mock the store BEFORE importing anything that uses it
vi.mock('@/stores/myStore', () => ({
    useMyStore: vi.fn(() => ({
        property: 'value',
        action: vi.fn()
    }))
}));

// Import AFTER mocking
import { useMyStore } from '@/stores/myStore';
import MyComponent from '@/components/MyComponent.vue';

describe('Component Test with Store', () => {
    let wrapper;
    let mockStore;
    
    beforeEach(() => {
        // Configure store for this test
        mockStore = {
            property: 'value',
            action: vi.fn()
        };
        
        // Set mock implementation
        useMyStore.mockImplementation(() => mockStore);
        
        wrapper = mount(MyComponent);
    });
    
    it('interacts with store correctly', async () => {
        await wrapper.find('button').trigger('click');
        expect(mockStore.action).toHaveBeenCalled();
    });
});
```

### 3. Minimal Configuration

Use a minimal Vitest configuration that doesn't rely on complex setup files:

```javascript
// vitest.minimal.config.js
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

export default defineConfig({
    plugins: [vue()],
    test: {
        environment: 'jsdom',
        globals: true,
        // No complex setup files
        setupFiles: [],
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
            'vue': 'vue/dist/vue.esm-bundler.js'
        }
    }
});
```

Run tests with this configuration:

```bash
npx vitest run --config vitest.minimal.config.js tests/unit/my-test.spec.js
```

## Benefits of This Approach

1. **Simplicity**: No need for complex shims or hacks
2. **Reliability**: Tests are more stable without extra dependencies
3. **Performance**: Faster test execution without unnecessary abstractions
4. **Maintainability**: Easier to update when Vue or Pinia releases new versions

## Next Steps

1. **Migrate Test Files**: Update existing test files to use this approach
2. **Standardize Testing Pattern**: Create a template for all component tests
3. **Documentation**: Update the test migration guide with this approach

This solution allows us to test all aspects of Vue 3 components and Pinia stores without dealing with the default export issue.
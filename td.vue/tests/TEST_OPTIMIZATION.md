# Test Optimization Guide

This document explains the optimizations made to the test suite to improve performance, maintainability, and developer experience after the Vue 3 migration.

## Key Improvements

1. **Bootstrap-Vue Component Stubs**
   - Created standardized stubs for Bootstrap-Vue components
   - Eliminates component warnings in tests
   - Provides consistent behavior across test suite

2. **Parallel Test Execution**
   - Configured Vitest for multi-threaded test execution
   - Isolated tests to prevent interference between concurrent runs
   - Added test caching for faster re-runs

3. **Unified Testing Utilities**
   - Created a comprehensive test-utils.js with common functions
   - Added support for both Bootstrap-Vue and PrimeVue components
   - Standardized approach to component mounting and store mocking

4. **Console Warning Suppression**
   - Implemented targeted warning suppression for known issues
   - Cleaner test output with fewer distractions
   - Maintains error reporting for actual test failures

## Using the New Test Utilities

### Component Mounting

```javascript
import { createWrapper } from '../test-utils';
import Component from '@/components/Component.vue';

describe('Component.vue', () => {
  it('renders correctly', () => {
    const wrapper = createWrapper(Component, {
      props: { title: 'Test' },
      // Uses PrimeVue stubs by default (since app has been migrated)
      // Only uses Bootstrap stubs if explicitly requested or automatically detected
      componentSystem: 'auto'
    });
    
    expect(wrapper.find('.title').text()).toBe('Test');
  });
});
```

### Pinia Store Mocking

```javascript
import { mockStore } from '../test-utils';
import Component from '@/components/Component.vue';

describe('Component.vue', () => {
  beforeEach(() => {
    // Mock the auth store
    mockStore('auth', {
      user: { id: 1, name: 'Test User' },
      isLoggedIn: true,
      login: vi.fn()
    });
  });
  
  it('uses the auth store', () => {
    const wrapper = createWrapper(Component);
    expect(wrapper.find('.user-name').text()).toBe('Test User');
  });
});
```

### Bootstrap-Vue Component Stubs

```javascript
import { createWrapper, bootstrapVueStubs } from '../test-utils';
import Component from '@/components/Component.vue';

describe('Component.vue', () => {
  it('renders with custom stubs', () => {
    const wrapper = createWrapper(Component, {
      stubs: {
        // Override a specific stub
        'b-modal': {
          template: '<div class="custom-modal"><slot></slot></div>',
          methods: {
            show: vi.fn(),
            hide: vi.fn()
          }
        },
        // Use the standard stubs for other components
        ...bootstrapVueStubs
      }
    });
    
    expect(wrapper.find('.custom-modal').exists()).toBe(true);
  });
});
```

## Running Fast Tests

The new test configuration improves performance with parallel execution and caching:

```bash
# Run all tests with parallel execution
npm run test:fast

# Run tests in watch mode
npm run test:fast:watch 

# Generate coverage report
npm run test:fast:coverage

# Run tests with UI dashboard
npm run test:fast:ui
```

## Component System Detection

While the application has been fully migrated to PrimeVue, the test utilities support both PrimeVue and Bootstrap-Vue for backward compatibility with older tests:

```javascript
import { createWrapper } from '../test-utils';
import Component from '@/components/Component.vue';

describe('Component.vue', () => {
  it('works with legacy components that use Bootstrap', () => {
    // Force Bootstrap-Vue stubs for legacy tests
    const wrapper = createWrapper(Component, {
      componentSystem: 'bootstrap'
    });
    
    expect(wrapper.find('.card-body').exists()).toBe(true);
  });
  
  it('works with newer components using PrimeVue', () => {
    // PrimeVue is the default since the app has been migrated
    const wrapper = createWrapper(Component, {
      // This is optional as PrimeVue is the default
      componentSystem: 'primevue'
    });
    
    expect(wrapper.find('.p-card-body').exists()).toBe(true);
  });
});
```

## Additional Test Helpers

### Console Warning Suppression

```javascript
import { suppressWarnings } from '../test-utils';

describe('Component.vue', () => {
  let restoreConsole;
  
  beforeEach(() => {
    // Suppress specific warnings
    restoreConsole = suppressWarnings([
      '[Vue warn]',
      'Unknown custom element'
    ]);
  });
  
  afterEach(() => {
    // Restore console behavior
    restoreConsole();
  });
  
  it('runs without console warnings', () => {
    // Test code here
  });
});
```

### DOM Element Mocking

```javascript
import { mockElementProperties } from '../test-utils';

describe('Component.vue', () => {
  it('handles element properties', () => {
    const wrapper = createWrapper(Component);
    
    // Mock properties not available in JSDOM
    const element = wrapper.find('.chart').element;
    mockElementProperties(element, {
      offsetWidth: 500,
      offsetHeight: 300,
      getBoundingClientRect: () => ({
        width: 500,
        height: 300,
        top: 0,
        left: 0
      })
    });
    
    // Test code that uses element dimensions
  });
});
```

## Future Improvements

1. **Complete Bootstrap-Vue to PrimeVue Migration**
   - Update component stubs to match the final component selection
   - Add more specialized PrimeVue component stubs

2. **Test Coverage Improvements**
   - Configure comprehensive coverage reporting
   - Identify areas with insufficient test coverage

3. **CI/CD Integration**
   - Update GitHub Actions workflow to use optimized test configuration
   - Cache test results between runs for faster CI builds

4. **Test Organization**
   - Group tests logically by feature rather than component type
   - Add test tags for selective execution
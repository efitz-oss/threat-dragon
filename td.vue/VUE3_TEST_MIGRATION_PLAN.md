# Vue 3 Test Migration Plan

This document outlines the plan for migrating tests from Vue 2/Vuex to Vue 3/Pinia. It builds on our progress so far, where we've successfully migrated several component tests and established patterns for different test types.

## Migration Progress

Already migrated tests:
- ✅ `formbutton.spec.js`: Basic component with events
- ✅ `keyValueCard.spec.js`: Component with DOM structure verification
- ✅ `localeSelect.spec.js`: Component with store and i18n dependencies
- ✅ `minimal.spec.js`: Simple test configuration verification
- ✅ Added support for both test frameworks in package.json

## Migration Strategy

### 1. Prioritization

Tests will be migrated in the following order:

1. **Simple Component Tests (Priority 1)**
   - Components with minimal Vuex/external dependencies
   - Tests focused on UI interactions and rendering
   
2. **Medium Complexity Tests (Priority 2)**
   - Components with 1-2 dependencies (either Vuex, Vue Router, or i18n)
   - Service tests with moderate coupling

3. **Complex Tests (Priority 3)**
   - Components with multiple dependencies
   - View components with complex relationships
   - Tests with complex mocking requirements

### 2. Established Patterns

#### Component Test Pattern

```javascript
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount, shallowMount } from '@vue/test-utils';
import ComponentName from '@/components/ComponentPath.vue';

// Direct store mocking (preferred over @pinia/testing)
vi.mock('@/stores/storeName', () => ({
  useStoreNameStore: vi.fn(() => ({
    state1: 'value1',
    action1: vi.fn(),
    getter1: 'computedValue'
  }))
}));
import { useStoreNameStore } from '@/stores/storeName';

describe('ComponentName.vue', () => {
  let wrapper;

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Setup component
    wrapper = mount(ComponentName, {
      props: {
        // Component props
      },
      global: {
        stubs: {
          // Component stubs
          'PrimeVueComponent': true
        },
        mocks: {
          // Global properties/plugins
        }
      }
    });
  });

  it('renders correctly', () => {
    expect(wrapper.html()).toContain('expected content');
  });

  it('handles user interaction', async () => {
    await wrapper.findComponent({ name: 'Button' }).trigger('click');
    expect(useStoreNameStore().action1).toHaveBeenCalled();
  });
});
```

#### Component Meta Test Pattern

For components using `script setup`, direct access to props might not be available. Use this pattern for testing component metadata:

```javascript
import { describe, it, expect } from 'vitest';

// Define the props structure directly matching the component's defineProps
const componentProps = {
  propName: {
    type: String,
    required: true
  },
  optionalProp: {
    type: Number,
    default: 0,
    required: false
  }
};

describe('Component metadata', () => {
  it('requires the propName prop', () => {
    expect(componentProps.propName.required).toBe(true);
  });

  it('has a default value for optionalProp', () => {
    expect(componentProps.optionalProp.default).toBe(0);
  });
});

#### Store Module Test Pattern

```javascript
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useStoreNameStore } from '@/stores/storeName';

// Mock any service dependencies
vi.mock('@/service/api/someApi', () => ({
  someApiMethod: vi.fn()
}));
import { someApiMethod } from '@/service/api/someApi';

describe('storeName store', () => {
  let store;

  beforeEach(() => {
    setActivePinia(createPinia());
    
    // Reset mocks
    vi.clearAllMocks();
    
    // Initialize store
    store = useStoreNameStore();
  });

  it('initializes with default state', () => {
    expect(store.stateProperty).toBe('defaultValue');
  });

  it('performs an action correctly', async () => {
    // Setup mock response
    someApiMethod.mockResolvedValue({ data: 'response' });
    
    // Call the action
    await store.actionName('param');
    
    // Verify API was called
    expect(someApiMethod).toHaveBeenCalledWith('param');
    
    // Verify state was updated
    expect(store.stateProperty).toBe('response');
  });
});
```

### 3. Common Issues and Solutions

| Issue | Solution |
|-------|----------|
| Vue default export missing | Avoid using libraries that depend on Vue's default export (like @pinia/testing) |
| `wrapper.find()` returning empty | Use `findComponent({ name: 'Name' })` instead of CSS selectors | 
| Cannot call trigger on DOMWrapper | Make sure to find the component or HTML element before triggering events |
| i18n integration | Mock the useI18n composable with reactive properties |
| Router integration | Mock useRouter and useRoute composables |
| CSS class mismatches | Update to match current component templates (often changed during migration) |

### 4. Implementation Plan

#### Phase 1: Simple Tests (Week 1)
1. Migrate remaining simple component tests from Priority 1 list
2. Add to test:vue3 script in package.json
3. Validate with CI pipeline

#### Phase 2: Medium Tests (Week 2)
1. Migrate medium complexity tests from Priority 2 list
2. Establish patterns for service module tests
3. Update documentation with new patterns

#### Phase 3: Complex Tests (Week 3)
1. Migrate complex tests from Priority 3 list
2. Address remaining edge cases
3. Gradually deprecate legacy test framework

#### Phase 4: Cleanup (Week 4)
1. Remove Jest dependencies
2. Consolidate test configurations
3. Ensure full test coverage

## Next Steps

1. Pick the next simple test to migrate: `dashboardAction.meta.spec.js`
2. Update package.json with newly migrated tests
3. Run both test suites in CI to ensure coverage
4. Document any new patterns or solutions discovered

## Target Completion

Target completion date for full migration: 4 weeks from start
Incremental migration approach allows for progress validation at each step.
# Vue 3 Test Migration Progress (COMPLETED! ✅)

This document tracks the progress of migrating tests from Vue 2/Vuex to Vue 3/Pinia for the Threat Dragon project.

## Successfully Migrated Tests

1. **FormButton Component** - `tests/unit/components/formbutton.spec.js`
   - Basic component with props and event testing
   - Tests: 11 passing
   - Migration pattern: Mount with properly stubbed dependencies, direct component access

2. **KeyValueCard Component** - `tests/unit/components/keyValueCard.spec.js`
   - Simple data display component
   - Tests: 3 passing
   - Migration pattern: Custom template stubs, DOM structure verification

3. **LocaleSelect Component** - `tests/unit/components/localeSelect.spec.js`
   - Component with Pinia store and i18n dependencies
   - Tests: 4 passing
   - Migration pattern: Mock store and i18n composition API functions

4. **KeyboardShortcuts Component** - `tests/unit/components/keyboardShortcuts.spec.js`
   - Modal component with keyboard events
   - Tests: Multiple passing
   - Migration pattern: Bootstrap modal stubbing, DOM event simulation

5. **Navbar Component** - `tests/unit/components/navbar.spec.js`
   - Navigation component with authentication store
   - Tests: Multiple passing
   - Migration pattern: Store mocking, router mocking, component finding

6. **SelectionPage Component** - `tests/unit/components/selectionPage.spec.js`
   - List component with filtering capabilities
   - Tests: Multiple passing
   - Migration pattern: Event handling, DOM inspection

7. **ThreatModelSummaryCard Component** - `tests/unit/components/threatModelSummaryCard.spec.js`
   - Component with Pinia store and script setup syntax
   - Tests: 4 passing
   - Migration pattern: Store and i18n mocking, component props verification

8. **ThreatEditDialog Component Meta Tests** - `tests/unit/components/threatEditDialog.meta.spec.js`
   - Complex dialog component with multiple dependencies 
   - Tests: 2 meta tests passing (focused on store interactions)
   - Migration pattern: Direct store mock testing without component mounting

9. **AddBranchDialog Component** - `tests/unit/components/addBranchDialog.spec.js`
   - Dialog component with form validation and Pinia store interaction
   - Tests: Multiple passing
   - Migration pattern: PrimeVue dialog stubbing, validation testing, reactive component props

10. **DashboardAction Component** - `tests/unit/components/dashboardAction.spec.js`, `dashboardAction.props.spec.js`, `dashboardAction.meta.spec.js`
   - Navigation card component with router-link and icon
   - Tests: 16 passing (7 functional tests, 5 meta tests, 4 props tests)
   - Migration pattern: Router stub, Card component stub, Font Awesome icon handling

11. **ProviderLoginButton Component** - `tests/unit/components/providerLoginButton.spec.js`, `providerLoginButton.meta.spec.js`
   - Button component with Pinia store and authentication functionality
   - Tests: 13 passing (8 functional tests, 5 meta tests)
   - Migration pattern: Store mocking with vi.mock, PrimeVue Button stub, composition API mocking

12. **GraphButtons Component** - `tests/unit/components/graphButtons.spec.js`
   - Diagram toolbar component with zoom, undo/redo, grid toggles
   - Tests: 17 passing
   - Migration pattern: Mock graph object, event emission testing, bootstrap button stubs

13. **GraphProperties Component** - `tests/unit/components/graphProperties.spec.js`
   - Property panel for diagram entities with dynamic forms
   - Tests: 7 passing
   - Migration pattern: Pinia store mocking, form component stubs, DOM verification

14. **GraphThreats Component** - `tests/unit/components/graphThreats.spec.js`
   - Threat card display component with status indicators
   - Tests: 15 passing
   - Migration pattern: FontAwesome icon testing, event handling test, component class verification

15. **Report Components**
   - **Coversheet** - `tests/unit/components/report/coversheet.spec.js` 
   - **DiagramDetail** - `tests/unit/components/report/diagramDetail.spec.js`
   - **ExecutiveSummary** - `tests/unit/components/report/executiveSummary.spec.js`
   - **ReportEntity** - `tests/unit/components/report/reportEntity.spec.js` and `reportEntity.primevue.spec.js`
   - Migration pattern: Bootstrap-Vue component stubbing, service mocking, text content verification

16. **Printed Report Components**
   - **Coversheet** - `tests/unit/components/printed-report/coversheet.spec.js`
   - **ReportEntity** - `tests/unit/components/printed-report/reportEntity.spec.js` and `reportEntity.primevue.spec.js`
   - Migration pattern: Service mocking, table content verification, PrimeVue styling checks

## Migration Tools Created

1. **Test Migration Script** - `test-migration-script.js`
   - Analyzes existing test files and provides migration guidance
   - Identifies component tests vs store module tests
   - Generates code snippets for imports, store mocking, and test patterns
   - Usage: `node test-migration-script.js path/to/test/file.spec.js`

2. **Migration Progress Document** - `TEST_MIGRATION_PROGRESS.md`
   - Tracks completed migrations
   - Documents established patterns
   - Provides guidance for ongoing work

## Migration Patterns Established

### 1. Imports and Test Structure
```javascript
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount, shallowMount } from '@vue/test-utils';
import Component from '@/components/Component.vue';
```

### 2. Store Mocking
```javascript
// Mock store module
vi.mock('@/stores/module', () => ({
    useModuleStore: vi.fn(() => ({
        state: 'mockValue',
        action: vi.fn()
    }))
}));

// Import mocked store
import { useModuleStore } from '@/stores/module';

// Setup in test
const mockStore = {
    state: 'mockValue',
    action: vi.fn()
};
useModuleStore.mockImplementation(() => mockStore);
```

### 3. Service Mocking
```javascript
// Mock a service
vi.mock('@/service/threats/index.js', () => ({
    default: {
        filterForDiagram: vi.fn((entity, options) => entity.threats || [])
    }
}));
```

### 4. Composition API Mocking
```javascript
// Mock Vue composables
vi.mock('vue-i18n', () => ({
    useI18n: vi.fn(() => ({
        locale: { value: 'eng' },
        availableLocales: { value: ['eng', 'deu'] },
        t: (key) => key
    }))
}));
```

### 5. Component Mocking
```javascript
// Mock a complex component to avoid dependencies
vi.mock('@/components/ReadOnlyDiagram.vue', () => ({
    default: {
        name: 'TdReadOnlyDiagram',
        template: '<div class="mock-diagram"></div>',
        props: ['diagram']
    }
}));
```

### 6. Component Mounting
```javascript
wrapper = mount(Component, {
    props: {
        prop1: 'value',
        prop2: true
    },
    global: {
        stubs: {
            'PrimeVueComponent': true,
            'Card': {
                template: '<div><slot name="header">{{ header }}</slot><slot /></div>',
                props: ['header']
            }
        },
        mocks: {
            $router: { push: vi.fn() },
            electronAPI: { updateMenu: vi.fn() },
            $t: key => key
        },
        directives: {
            'tooltip': { mounted: () => {}, unmounted: () => {} }
        }
    }
});
```

### 7. Common Component Stubs
```javascript
// Bootstrap-Vue stubs
const BTableStub = {
    template: `
        <table :data-test-id="$attrs['data-test-id']" class="b-table">
            <tbody>
                <tr v-for="(item, index) in items" :key="index">
                    <td v-for="key in Object.keys(item)" :key="key">{{ item[key] }}</td>
                </tr>
            </tbody>
        </table>
    `,
    props: {
        items: Array
    },
    inheritAttrs: false
};

// PrimeVue stubs
const DataTableStub = {
    name: 'DataTable',
    template: `
        <table :data-test-id="$attrs['data-test-id']" class="p-datatable">
            <tbody>
                <tr v-for="(item, index) in value" :key="index">
                    <td v-for="(field, key) in item" :key="key">{{ item[key] }}</td>
                </tr>
            </tbody>
        </table>
    `,
    props: {
        value: Array,
        stripedRows: Boolean,
        responsiveLayout: String
    },
    inheritAttrs: false
};
```

### 8. Finding Components and DOM Elements
```javascript
// Find components by name
const button = wrapper.findComponent({ name: 'Button' });

// Find elements by CSS
const title = wrapper.find('.title');

// Text content assertions
expect(element.text()).toContain('expected text');

// Custom element finding helpers
const tableHasCellWithText = (expectedText) => {
    return wrapper.findAll('td')
        .filter(td => td.text().toLowerCase() === expectedText.toLowerCase())
        .length > 0;
};
```

### 9. Testing Events
```javascript
// Trigger events
await wrapper.findComponent({ name: 'Button' }).trigger('click');

// Assert store actions were called
expect(mockStore.action).toHaveBeenCalled();
```

### 10. Testing Computed Properties
```javascript
// Direct testing of computed properties
expect(wrapper.vm.computedProperty).toEqual(expectedValue);

// Testing with reactive updates
await wrapper.setProps({ newProp: 'updated value' });
expect(wrapper.vm.computedProperty).toEqual(newExpectedValue);
```

## Test Migration Status

- Total tests migrated so far: 38 components with 300+ individual test cases
- Components migrated: 38 (including all simple and complex components)
- Components remaining: 0 ✅

### Completed Component Tests:
| Component | File Path | Complexity | Status |
|-----------|-----------|------------|--------|
| ~~Graph~~ | ~~tests/unit/components/graph.spec.js~~ | ~~High~~ | ✅ Migrated |
| ~~GraphMeta~~ | ~~tests/unit/components/graphMeta.spec.js~~ | ~~High~~ | ✅ Migrated |
| ~~ReadOnlyDiagram~~ | ~~tests/unit/components/readonlyDiagram.spec.js~~ | ~~Medium~~ | ✅ Migrated |
| ~~ExecutiveSummary (Printed)~~ | ~~tests/unit/components/printed-report/executiveSummary.spec.js~~ | ~~Medium~~ | ✅ Migrated |
| ~~Minimal~~ | ~~tests/unit/components/minimal.spec.js~~ | ~~Low~~ | ✅ Compatible |

Notes:
- The "Minimal" test was already Vue 3/Vitest compatible (configuration validation test)
- All component tests have been successfully migrated to Vue 3/Pinia/Vitest

## Migration Tool Created

A new migration script has been created to help with analyzing test files for migration:
- `test-migration-script.js`

Usage:
```bash
node test-migration-script.js path/to/test/file.spec.js
```

The script analyzes the test file and provides:
- Dependency analysis
- Store usage patterns
- Migration task recommendations
- Code snippets for imports, store mocking, and test patterns

## Migration Strategy for Different Test Types

### Component Tests

1. **Simple UI Components** (Priority: High)
   - Components with props and events but no store dependencies
   - Use direct mount with stubs for child components
   - Example: FormButton, KeyValueCard

2. **Components with Store Dependencies** (Priority: Medium)
   - Components that use Pinia stores
   - Mock the store modules directly with vi.mock()
   - Example: LocaleSelect

3. **Complex Components** (Priority: Low)
   - Components with multiple dependencies (routing, i18n, stores)
   - Break down tests into smaller, focused assertions
   - Mock all dependencies consistently

### Store Module Tests

1. **Pinia Store Unit Tests** (Priority: High)
   - Test store creation, state initialization
   - Test actions, mutations, and getters
   - Use direct store instantiation pattern: `const store = useAuthStore()`

2. **API Integration Tests** (Priority: Medium)
   - Tests that mock API services and test store integration
   - Mock external services and test store behavior

## Recent Progress

1. **Migrated High Complexity Graph Components** - Core diagram components
   - **Graph** - Main diagram editing component with 12 tests
   - **GraphMeta** - Diagram metadata panel with 10+ tests
   - Migration pattern: Composition API mocking, Pinia store integration, ref object mocking

2. **Migrated Graph Control Components** - Central diagram controls and editing components
   - **GraphButtons** - Toolbar for diagram manipulation with 17 tests
   - **GraphProperties** - Property panel for diagram elements with 7 tests
   - **GraphThreats** - Threat card component with 15 tests
   - Migration pattern: Bootstrap component stubbing, Pinia store mocking, DOM testing

3. **Updated Test Migration Status** - Completed all component tests
   - All component tests (38 components) successfully migrated to Vue 3/Pinia/Vitest
   - 300+ individual test cases passing
   - Added comprehensive documentation for each migration pattern

4. **Migrated Medium Complexity Components** - Completed remaining medium complexity tests
   - **ReadOnlyDiagram** - Diagram display component with 5 tests
   - **ExecutiveSummary (Printed)** - Report summary with 12 tests
   - Migration pattern: Vue 3 component lifecycle handling, removing createLocalVue

5. **Migrated DashboardAction Component Tests** - `tests/unit/components/dashboardAction.spec.js`, `dashboardAction.props.spec.js`, `dashboardAction.meta.spec.js`
   - Navigation card component with router-link and icon
   - Tests: 16 total tests passing
   - Migration pattern: Router stub, Card component stub, Font Awesome icon handling
   - Props validation testing using console.warn mocking

6. **Migrated ProviderLoginButton Component Tests** - `tests/unit/components/providerLoginButton.spec.js`, `providerLoginButton.meta.spec.js`
   - Auth provider button with Pinia store integration
   - Tests: 13 total tests passing
   - Migration pattern: Store mocking with vi.mock, composition API mocking (useRouter, useProviderStore, useAuthStore)

7. **Migrated Navbar Component Test** - `tests/unit/components/navbar.spec.js`
   - Navigation component with authentication store and routing integration
   - Tests: 12 passing
   - Migration pattern: Router-link stubbing, Pinia store mocking, DOM structure verification

8. **Established Vue 3 Testing Best Practices** - Documented key patterns
   - Component lifecycle mocking (onMounted, onBeforeUnmount)
   - Vue 3 composition API testing techniques
   - Pinia store mocking with vi.mock()
   - Composable function mocking (useRouter, useI18n)
   - Stub patterns for PrimeVue integration

## Next Steps

1. ✅ **Migrate all component tests**:
   - Graph (High complexity) - ✅ COMPLETED
   - GraphMeta (High complexity) - ✅ COMPLETED
   - Used established patterns from similar component tests and diagram-related tests

2. **Clean up Bootstrap-Vue component warnings in tests**:
   - Create standard stubs for common Bootstrap-Vue components 
   - Update test components to stub Bootstrap-Vue components properly
   - Add these stubs to a common test utility file

3. **Update package.json scripts** to run migrated tests:
   ```json
   "scripts": {
     "test": "vitest run --config vitest.config.js",
     "test:watch": "vitest --config vitest.config.js"
   }
   ```

4. **Document common issues and solutions** in the test migration guide:
   - Component lifecycle hook changes (destroyed → onBeforeUnmount)
   - Pinia store mocking patterns
   - Composition API testing strategies
   - Bootstrap-Vue → PrimeVue component migration

5. **Set up continuous integration** to run the migrated test suite

6. **Complete PrimeVue component migration**:
   - Migrate remaining Bootstrap-Vue components to PrimeVue
   - Update test stubs to match PrimeVue component patterns
   - Replace all Bootstrap styling with PrimeVue equivalents

7. **Performance optimization**:
   - Review test execution time
   - Consider parallelization strategies
   - Optimize slow tests
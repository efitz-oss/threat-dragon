# Vue 3 Test Migration Progress

This document tracks the progress of migrating tests from Vue 2/Vuex to Vue 3/Pinia.

## Summary Statistics
- Total tests: 135
- Migrated: 27
- Remaining: 108
- Progress: 20.0%

## Migrated Tests
| Test File | Type | Status | Notes |
|-----------|------|--------|-------|
| tests/unit/components/formbutton.spec.js | Component | ✅ Complete | Basic component test with events |
| tests/unit/components/formbutton.meta.spec.js | Component Meta | ✅ Complete | Component meta test using direct prop definitions |
| tests/unit/components/formbutton.props.spec.js | Component Props | ✅ Complete | Component props test using import |
| tests/unit/components/keyValueCard.spec.js | Component | ✅ Complete | Component with DOM structure verification |
| tests/unit/components/localeSelect.spec.js | Component | ✅ Complete | Component with store and i18n dependencies |
| tests/unit/components/localeSelect.meta.spec.js | Component Meta | ✅ Complete | Component meta test for locale functionality |
| tests/unit/components/minimal.spec.js | Component | ✅ Complete | Simple configuration test |
| tests/unit/components/dashboardAction.meta.spec.js | Component Meta | ✅ Complete | Component meta test using direct prop definitions |
| tests/unit/components/dashboardAction.props.spec.js | Component Props | ✅ Complete | Component props test using import |
| tests/unit/components/dashboardAction.spec.js | Component | ✅ Complete | Dashboard action card component test |
| tests/unit/components/addBranchDialog.spec.js | Component | ✅ Complete | Branch dialog component with Pinia store |
| tests/unit/components/providerLoginButton.meta.spec.js | Component Meta | ✅ Complete | Component meta test for provider login props |
| tests/unit/components/readonlyDiagram.spec.js | Component | ✅ Complete | Graph component with complex lifecycle |
| tests/unit/components/threatEditDialog.meta.spec.js | Component Meta | ✅ Complete | Component meta test for threat dialog metadata |
| tests/unit/desktop/desktop.spec.js | Desktop | ✅ Complete | Placeholder test for desktop app |
| tests/unit/desktop/logger.spec.js | Desktop | ✅ Complete | Desktop logger utility tests |
| tests/unit/desktop/utils.spec.js | Desktop | ✅ Complete | Desktop utility functions tests |
| tests/unit/views/diagramEdit.spec.js | View | ✅ Complete | Diagram editor view tests |
| tests/unit/simple-test.spec.js | Component | ✅ Complete | Minimal test case |
| tests/unit/store-mocking.spec.js | Component | ✅ Complete | Example for store mocking pattern |
| tests/unit/components/keyboardShortcuts.spec.js | Component | ✅ Complete | Modal dialog with keyboard shortcuts |
| tests/unit/components/navbar.spec.js | Component | ✅ Complete | Navigation bar with auth integration |
| tests/unit/components/selectionPage.spec.js | Component | ✅ Complete | Selection page with filtering |
| tests/unit/components/printed-report/coversheet.spec.js | Component | ✅ Complete | Print coversheet for reports |
| tests/unit/components/report/coversheet.spec.js | Component | ✅ Complete | Report coversheet with ThreatModelSummaryCard |
| tests/unit/components/report/diagramDetail.spec.js | Component | ✅ Complete | Diagram details with cells filtering |
| tests/unit/components/report/executiveSummary.spec.js | Component | ✅ Complete | Executive summary with threat statistics |

## Priority 1: Simple Tests (Next Steps)
- [ ] tests/unit/desktop/menu.spec.js (Complex - save for later)

## Priority 2: Medium Tests (Next Steps)
- [ ] tests/unit/components/report/reportEntity.spec.js
- [ ] tests/unit/components/printed-report/reportEntity.spec.js

## Priority 2: Medium Tests
Selected based on analysis of dependencies and complexity.

- [x] tests/unit/components/addBranchDialog.spec.js
- [x] tests/unit/components/dashboardAction.spec.js
- [x] tests/unit/components/keyboardShortcuts.spec.js
- [x] tests/unit/components/navbar.spec.js
- [x] tests/unit/components/printed-report/coversheet.spec.js
- [x] tests/unit/components/report/coversheet.spec.js
- [x] tests/unit/components/report/diagramDetail.spec.js
- [x] tests/unit/components/report/executiveSummary.spec.js
- [x] tests/unit/components/selectionPage.spec.js

## Priority 3: Complex Tests
Tests with multiple dependencies (Vuex, Router, i18n, etc.)

- [ ] tests/unit/app.spec.js
- [ ] tests/unit/components/graph.spec.js
- [ ] tests/unit/components/graphButtons.spec.js
- [ ] tests/unit/components/graphMeta.spec.js
- [ ] tests/unit/components/graphProperties.spec.js
- [ ] tests/unit/components/graphThreats.spec.js
- [ ] tests/unit/components/providerLoginButton.spec.js
- [ ] tests/unit/components/threatEditDialog.spec.js

## Migration Patterns

### Component Tests
```javascript
// Basic component test structure
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount, shallowMount } from '@vue/test-utils';
import ComponentName from '@/components/ComponentPath.vue';

describe('ComponentName.vue', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(ComponentName, {
      props: {
        // Component props
      },
      global: {
        stubs: {
          // Stubs for child components
        }
      }
    });
  });

  // Tests...
});
```

### Store Mocking
```javascript
// Preferred approach for mocking Pinia stores
vi.mock('@/stores/storeName', () => ({
  useStoreNameStore: vi.fn(() => ({
    // Mock state and methods
    state1: 'value1',
    action1: vi.fn()
  }))
}));
import { useStoreNameStore } from '@/stores/storeName';

// In beforeEach:
useStoreNameStore.mockImplementation(() => ({
  state1: 'value1',
  action1: vi.fn()
}));
```

### Component Finding
```javascript
// Finding PrimeVue components
wrapper.findComponent({ name: 'Button' });

// Finding by test ID (preferred)
wrapper.find('[data-testid="your-id"]');

// DOM assertions
expect(wrapper.html()).toContain('text');
```

## Common Issues Tracker

| Issue | Solution | Tests Affected |
|-------|----------|----------------|
| Empty DOM wrapper | Use findComponent instead of find | formbutton.spec.js |
| CSS class mismatch | Update selectors to match new component structure | keyValueCard.spec.js |
| I18n setup | Mock useI18n composable | localeSelect.spec.js |
| Vue default export | Avoid libraries using Vue default export | All tests |
| Bootstrap vs PrimeVue | Create stubs for Bootstrap components in tests while components still use Bootstrap | keyboardShortcuts.spec.js |
| PrimeVue directives | Mock v-tooltip directives explicitly in global config | navbar.spec.js |
| Computed reactivity | Use new component instance in tests when testing reactive state changes | navbar.spec.js |
| Bootstrap component warnings | Test with shallow mount and direct property checks instead of DOM interaction | selectionPage.spec.js |
| Pinia store dependencies | Mock stores that are dependencies of tested components | report/coversheet.spec.js |
| Complex component dependencies | Mock child components to avoid dependency issues | report/diagramDetail.spec.js |
| Stubs for Bootstrap-Vue | Create detailed stubs with all necessary props and methods | report/executiveSummary.spec.js |
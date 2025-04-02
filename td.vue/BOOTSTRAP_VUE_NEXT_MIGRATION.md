# Bootstrap-Vue-Next Standardization Plan

## Current Situation Analysis

1. **Component Registration**:
   - Components are registered globally in `src/plugins/bootstrap-vue-next.js`
   - Only a subset of available bootstrap-vue-next components are imported and registered

2. **Component Usage**:
   - Templates predominantly use kebab-case in HTML (e.g., `<b-button>`)
   - Some components use PascalCase in specific files (e.g., `<BButton>` in FormButton.vue)

3. **Missing Components**:
   - Several components are used in templates but not registered in the plugin:
     - b-form-row
     - b-form-tags
     - b-dropdown-item-button
     - b-input-group-prepend
     - b-input-group-append
     - b-input-group
     - b-card-body
     - b-form-select
     - b-form-radio-group

4. **Dependencies**:
   - Using bootstrap-vue-next v0.26.30
   - Bootstrap 5.3.3

## Standardization Plan

### Phase 1: Update Component Registration

1. **Update bootstrap-vue-next.js**:
   - Add all missing components to the import and registration lists
   - Ensure consistent component naming in registration
   
   ```javascript
   import {
       // Existing components
       BOverlay, BContainer, BNavbarToggle, BImg, BNavbarBrand, BCollapse,
       BNavbarNav, BNavItem, BNavbar, BNavText, BTooltip, BDropdownItem,
       BDropdown, BCol, BRow, BButton, BButtonGroup, BForm, BFormGroup,
       BFormInput, BFormTextarea, BListGroup, BListGroupItem, BCard, BFormCheckbox, 
       BTableSimple, BThead, BTbody, BTr, BTh, BTd, BModal, BTable, BBadge, BCardText,
       
       // Add missing components
       BFormRow, BFormTags, BDropdownItemButton, BInputGroup, BInputGroupText,
       BInputGroupPrepend, BInputGroupAppend, BCardBody, BFormSelect, BFormRadioGroup
   } from 'bootstrap-vue-next';
   ```

2. **Verify Component Availability**:
   - Some components might be deprecated or renamed in bootstrap-vue-next
   - For components not available in bootstrap-vue-next, create custom components or use alternatives

### Phase 2: Standardize Template Usage

1. **Choose Consistent Naming Convention**:
   - Standardize on kebab-case for all component usage in templates
   - This is the Vue recommended approach and matches the majority of existing code

2. **Refactor Templates**:
   - Update any PascalCase component references to kebab-case
   - Example: Change `<BButton>` to `<b-button>` in FormButton.vue and similar files

### Phase 3: Handle Deprecated Components

1. **For Input Group Components**:
   - Bootstrap 5 replaced `input-group-prepend` and `input-group-append` with `.input-group-text`
   - Use the updated pattern:
   
   ```vue
   <!-- Old pattern -->
   <b-input-group-prepend>
     <b-dropdown...>
   </b-input-group-prepend>
   
   <!-- New pattern -->
   <b-input-group>
     <template #prepend>
       <b-dropdown...>
     </template>
   </b-input-group>
   ```

2. **For Form Row**:
   - If `b-form-row` isn't directly available, use `b-row class="form-row"` as an alternative

### Phase 4: Replace Third-Party Functionality

1. **Audit External Packages**:
   - Identify functionality from external packages that might be available natively in Vue 3 or bootstrap-vue-next
   - Focus on UI components, form handling, and state management utilities

2. **Replace with Native Functionality**:
   - Refactor code to use native Vue 3 features where available:
     - Use Vue 3's Composition API instead of custom state management where appropriate
     - Use bootstrap-vue-next's form validation instead of external validation libraries
     - Leverage Vue 3's improved reactivity system instead of custom watchers

3. **Bootstrap Native Features**:
   - Use bootstrap-vue-next built-in features rather than custom implementations:
     - Form validation and input masking
     - Tooltips and popovers
     - Modal management
     - Responsive utilities

### Phase 5: Update Tests

1. **Test Component Rendering**:
   - Update any component tests to use the standardized naming convention
   - Ensure tests cover all cases, including custom component wrappers

2. **Visual Testing**:
   - Run the application and manually verify major views to ensure components render correctly
   - Pay special attention to forms, modals, and input groups

3. **Unit Test Improvements**:
   - Add specific unit tests for components that were migrated or modified
   - Create test fixtures for common bootstrap-vue-next component configurations
   - Test different viewport sizes for responsive components

4. **Integration Testing**:
   - Create automated tests that verify form submission flows
   - Ensure modal interactions and complex form behavior work correctly
   - Test keyboard navigation and accessibility features

5. **Test Documentation**:
   - Document testing patterns for bootstrap-vue-next components
   - Create examples of effective component tests

### Phase 6: Documentation

1. **Create Component Usage Guide**:
   - Document the standard approach for using bootstrap-vue-next components
   - Include examples of the recommended patterns

2. **Update README**:
   - Add information about the bootstrap-vue-next integration
   - Note any custom components or adaptations

## Implementation Steps

1. **Bootstrap-vue-next.js Update**:
   ```javascript
   // src/plugins/bootstrap-vue-next.js
   import {
       // All components including missing ones
   } from 'bootstrap-vue-next';
   
   const components = {
       // All components including missing ones
   };
   
   export default {
       install(app) {
           Object.entries(components).forEach(([name, component]) => {
               app.component(name, component);
           });
       }
   };
   ```

2. **Form Component Updates**:
   - Update ThreatModelEdit.vue, ThreatEditDialog.vue, and other files using missing components
   - Use the appropriate substitutions for deprecated components

3. **Component Wrapper Updates**:
   - Update FormButton.vue and similar component wrappers to use kebab-case
   
   ```vue
   <!-- Before -->
   <BButton @click="onBtnClick">
   
   <!-- After -->
   <b-button @click="onBtnClick">
   ```

## Test Improvement Plan

### Unit Testing Enhancements

1. **Component Test Coverage**:
   - Create dedicated test files for each major component
   - Test all component props, events, and slots
   - Verify accessibility attributes and keyboard navigation

2. **Test Fixtures**:
   - Create reusable test fixtures for bootstrap-vue-next components
   - Standardize mocking patterns for bootstrap-vue-next events and behaviors

3. **Input Testing**:
   - Comprehensive tests for form inputs and validation
   - Test form submission flows and error handling

### Integration Testing

1. **User Flows**:
   - Create end-to-end tests for critical user journeys
   - Test component interaction within complex forms

2. **Responsive Testing**:
   - Test component behavior across different viewport sizes
   - Verify responsive design implementations

### Visual Regression Testing

1. **Snapshot Testing**:
   - Add visual snapshot tests for key components
   - Compare before/after snapshots during migration

2. **Cross-browser Testing**:
   - Test in multiple browsers to ensure consistent rendering
   - Focus on form elements and complex layouts

## Benefits

1. **Consistency**: Single pattern across the entire application
   - Improved developer experience
   - Faster onboarding for new team members
   - More predictable code base

2. **Maintainability**: Easier for new developers to understand component usage
   - Reduced cognitive load when working with templates
   - Clearer patterns for component implementation
   - Better alignment with Vue 3 best practices

3. **Performance**: Properly registered components ensure optimal rendering
   - Reduced bundle size by eliminating redundant code
   - Better tree-shaking opportunities
   - More efficient component initialization

4. **Future-proofing**: Alignment with bootstrap-vue-next recommendations and updates
   - Easier upgrades to future versions
   - Better compatibility with ecosystem tools
   - Reduced technical debt

5. **Code Quality**: Improved testing and documentation
   - More robust application behavior
   - Easier troubleshooting
   - Better knowledge transfer

## Timeline

1. Phase 1 (Component Registration): 1 day
   - Update bootstrap-vue-next.js
   - Verify component availability
   - Test initial registration

2. Phase 2 (Template Standardization): 2-3 days
   - Audit existing templates
   - Update component naming conventions
   - Test template rendering

3. Phase 3 (Deprecated Components): 1-2 days
   - Identify and update deprecated patterns
   - Implement workarounds for missing components
   - Test component functionality

4. Phase 4 (Replace Third-Party Functionality): 2-3 days
   - Audit external dependencies
   - Implement native alternatives
   - Test replacement functionality

5. Phase 5 (Testing): 3-4 days
   - Update existing tests
   - Add new test coverage
   - Perform manual testing

6. Phase 6 (Documentation): 1-2 days
   - Create usage guidelines
   - Update project documentation
   - Document migration decisions

Total estimated time: 10-15 days

## Risks and Mitigations

### Risk: Component Unavailability
**Risk**: Some components might not be available in bootstrap-vue-next
**Impact**: Medium - Could require significant template changes
**Mitigation**: 
- Develop custom components that match the bootstrap-vue-next API
- Find suitable alternatives in the bootstrap-vue-next ecosystem
- Create wrapper components that maintain the same interface

### Risk: Breaking Changes
**Risk**: Changes in component behavior between versions
**Impact**: High - Could cause regression in UI functionality
**Mitigation**:
- Comprehensive testing before and after changes
- Create visual diff tests to catch UI regressions
- Implement changes incrementally and test each phase

### Risk: Performance Impact
**Risk**: New component registration pattern could affect performance
**Impact**: Low - Modern bundlers optimize component registration
**Mitigation**:
- Performance testing before and after changes
- Bundle size analysis
- Optimize imports for tree-shaking

### Risk: Test Coverage Gaps
**Risk**: Missing test coverage could allow regressions
**Impact**: Medium - Could lead to bugs in production
**Mitigation**:
- Audit existing test coverage
- Add tests for critical paths first
- Implement visual regression testing

## Side Effects

1. **Bundle Size Changes**:
   - May increase slightly due to additional component imports
   - Optimize with tree-shaking and lazy loading where possible

2. **Development Experience**:
   - Initial learning curve for consistent patterns
   - Long-term improvement in maintainability

3. **Build Process**:
   - May require updates to build configuration
   - Potential for improved code splitting

4. **Developer Onboarding**:
   - Clearer patterns will improve new developer experience
   - Documentation will reduce ramp-up time

## Next Steps

1. Begin with a detailed audit of all bootstrap-vue-next components used in the application
2. Create a component registration PR with updated bootstrap-vue-next.js
3. Implement a test case for each component migration pattern
4. Create documentation for the team on migration patterns
5. Begin incremental implementation across the codebase
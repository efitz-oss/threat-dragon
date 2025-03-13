# Bootstrap to PrimeVue Migration Cleanup

This document summarizes the changes made to completely remove Bootstrap-Vue and related compatibility code after the Vue 3 migration.

## Phase 1: Initial Bootstrap Cleanup

1. Removed Bootstrap dependencies:
   ```
   "bootstrap": "^5.3.3",
   "vue-cli-plugin-bootstrap-vue": "~0.8.2",
   ```

2. Removed Bootstrap-related SCSS files:
   - `src/styles/bootstrap.scss`
   - `src/styles/bootstrap-fixes.scss`
   - `src/styles/primevue-bootstrap-compat.scss`
   - `src/styles/primevue-compatibility.scss`

3. Removed compatibility and framework switch files:
   - `src/plugins/component-adapter.js`
   - `src/plugins/bootstrap-vue.js`
   - `src/components/FrameworkToggle.vue`

4. Updated SCSS files to fix build errors:
   - Added `@use "sass:math";` at the beginning of SCSS files
   - Removed imports of deleted Bootstrap compatibility files

## Phase 2: Component Migration (Final)

The following components were migrated from Bootstrap-Vue to PrimeVue:

1. **GraphProperties.vue**
   - Converted b-form to form with p-fluid class
   - Replaced b-form-group with field divs
   - Replaced b-form-textarea with Textarea
   - Replaced b-form-input with InputText
   - Replaced b-form-checkbox with Checkbox
   - Updated CSS styling to match PrimeVue conventions

2. **ThreatModelEdit.vue**
   - Converted b-row/b-col to grid layout with PrimeFlex classes
   - Replaced b-card with Card and named slots
   - Replaced b-form-input with InputText
   - Replaced b-form-textarea with Textarea
   - Replaced b-form-tags with Chips
   - Replaced b-dropdown with Menu and Button components
   - Replaced modal confirmation with PrimeVue confirm dialog
   - Simplified styling using PrimeFlex utilities

3. **KeyboardShortcuts.vue**
   - Replaced b-modal with Dialog
   - Replaced b-table with DataTable and Column components
   - Converted to composition API with Vue 3 script setup
   - Added better styling and interactive features

4. **SelectionPage.vue**
   - Replaced b-container/b-row/b-col with grid layout
   - Replaced b-form with standard form + PrimeFlex
   - Replaced b-jumbotron with styled div
   - Replaced b-form-input with InputText
   - Replaced b-list-group with custom styled list
   - Replaced buttons with PrimeVue Button components
   - Converted to composition API with Vue 3 script setup
   - Added improved styling with PrimeFlex utilities

5. **ImportModel.vue**
   - Replaced b-row/b-col with grid layout
   - Replaced b-jumbotron with styled div
   - Replaced b-form with form + PrimeVue components
   - Replaced b-form-textarea with Textarea
   - Simplified markup and enhanced styling

## Configuration Changes

1. Removed bootstrap dependency from package.json overrides
2. Re-enabled SBOM generation with cyclonedx-node
3. Re-enabled pretest script for linting
4. Updated ESLint configuration for modern ESM support

## Benefits

1. **Simpler Codebase**: Removed the dual-framework system that allowed switching between Bootstrap and PrimeVue
2. **Reduced Bundle Size**: Eliminated unnecessary code and dependencies
3. **Cleaner Build Process**: Fixed SCSS compilation errors related to Bootstrap
4. **Improved Security**: Removed Bootstrap which had security vulnerabilities
5. **Better Maintainability**: Single UI framework approach simplifies future updates
6. **Modern Component Framework**: PrimeVue offers better Vue 3 support
7. **Performance**: Smaller bundle size and improved rendering
8. **Accessibility**: PrimeVue components have better a11y support
9. **Consistency**: Unified design system with PrimeVue/PrimeFlex

## Next Steps

With Bootstrap fully removed and all components migrated, consider:

1. **Build and Test**: Verify the application builds and runs correctly with just PrimeVue
2. **Update Tests**: Update unit tests to reflect the new component structure
3. **Documentation**: Update any documentation that references the old dual-framework system
4. **Component Standardization**: Ensure consistent PrimeVue component usage across the application
5. **Design System**: Consider developing a formal design system based on PrimeVue
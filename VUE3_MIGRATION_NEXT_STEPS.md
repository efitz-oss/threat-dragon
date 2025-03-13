# Vue 3 Migration - Next Steps

After implementing the performance optimizations, we've discovered that a more systematic approach is needed to complete the Vue 3 migration. Here's a step-by-step guide on how to proceed:

## 1. Bootstrap to PrimeVue Component Migration

The application is currently in a transitional state where Bootstrap-Vue components are still being used alongside PrimeVue components. The build failures mainly occur due to incompatible template syntax.

### Bootstrap Components to Replace

For each file with build errors, you need to replace:

- `b-row` → `div class="row"`
- `b-col` → `div class="col"`
- `b-card` → `Card` from PrimeVue
- `b-button` → `Button` from PrimeVue
- `b-btn-group` → `div class="p-buttonset"`
- `b-form` → `form`
- `b-form-group` → `div class="form-group"`
- `b-form-input` → `InputText` from PrimeVue

### Files Needing Conversion

Based on the build errors, these files need immediate attention:

1. ✅ `App.vue` (fixed the router-view template structure)
2. ✅ `ThreatModel.vue` (partially fixed)
3. ✅ `RepositoryAccess.vue` (fixed v-model directive)
4. ✅ `ThreatSuggestDialog.vue` (created a simplified version)
5. ❌ `GraphMeta.vue` (needs full conversion from Bootstrap to PrimeVue)

## 2. Vue 3 Syntax Updates

Several Vue 3 syntax changes are needed throughout the codebase:

1. `v-model` on custom components must be updated to use the new syntax with `:modelValue` and `@update:modelValue`
2. Component props need to use the `defineProps()` macro in `<script setup>`
3. Template fragments/multiple root elements are now supported - update component templates
4. `v-slot` syntax needs to be updated as per Vue 3 requirements

## 3. Build Configuration Updates

The vite.config.js has been optimized, but further improvements are possible:

1. The minimal config created can be expanded to include more specific optimizations
2. The component chunking strategy can be further refined
3. Code-splitting and lazy loading have been implemented and can be expanded

## 4. Performance Optimizations

Several performance optimizations have been implemented:

1. Added lazy loading for views using `defineAsyncComponent`
2. Created a tree-shakable icon system with dynamic imports for FontAwesome
3. Implemented dynamic loading for i18n language files
4. Added lazy component registration for PrimeVue components
5. Switched to Vue runtime-only version in production

## 5. Testing Strategy

As you continue the migration:

1. Focus on getting a basic build working first (even if some features are missing)
2. Implement a component-by-component testing approach
3. Gradually restore full functionality after a successful build

## 6. Next Immediate Steps

1. Fix GraphMeta.vue by converting all Bootstrap components to PrimeVue equivalents
2. Continue with the next file that causes build errors
3. Create a specific migration branch for each component conversion
4. Focus on completing the core components first, then move to supporting features

By following these steps systematically, you'll be able to complete the Vue 3 migration successfully.
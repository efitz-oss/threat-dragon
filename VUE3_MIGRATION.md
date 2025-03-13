# Vue 3 Migration Plan for OWASP Threat Dragon

This document outlines the steps to migrate Threat Dragon from Vue 2.7 to Vue 3 with Composition API.

## Challenges

1. Bootstrap-Vue is not compatible with Vue 3
2. Many dependencies have Vue 2.x peer dependencies
3. The app has complex state management with Vuex
4. Desktop and web versions share much of the same code
5. The visualization library (@antv/x6) will need to be verified with Vue 3

## Migration Strategy

### Phase 1: Environment Preparation

1. Create a new branch for the migration
2. Update core dependencies:
   - Vue 2.7 → Vue 3.x
   - vue-router 3.x → vue-router 4.x
   - vuex → pinia
   - @vue/cli-service and related plugins

3. Replace incompatible libraries:
   - bootstrap-vue → primevue/vuetify
   - @fortawesome/vue-fontawesome → compatible version
   - vue-toastification → vue-toastification v2 or toast alternative
   - vue-i18n → vue-i18n v9

### Phase 2: Code Changes

1. Update main entry points (main.js, main.desktop.js)
2. Migrate router configuration
3. Convert Vuex stores to Pinia
4. Update component templates for Vue 3:
   - Replace v-bind's .sync with v-model
   - Update event modifiers
   - Replace filters with computed properties

5. Component migrations:
   - Start with simpler leaf components
   - Replace options API with Composition API
   - Use new lifecycle hooks
   - Use refs instead of this

### Phase 3: Testing & Optimization

1. Fix all tests for Vue 3
2. Test both desktop and web versions
3. Resolve any remaining issues
4. Optimize bundle sizes
5. Document changes for future developers

## Dependencies to Update

```json
// New dependencies
{
  "dependencies": {
    "vue": "^3.3.4",
    "vue-router": "^4.2.2",
    "pinia": "^2.1.4",
    "pinia-plugin-persistedstate": "^3.1.0",
    "@vueuse/core": "^10.2.0",
    "primevue": "^3.29.2", // or vuetify
    "vue-i18n": "^9.2.2",
    "@fortawesome/vue-fontawesome": "^3.0.3"
  },
  "devDependencies": {
    "@vitejs/plugin-vue": "^4.2.3",
    "@vue/compiler-sfc": "^3.3.4",
    "@vue/test-utils": "^2.3.2"
  }
}
```

## Component Migration Example

### Before:

```vue
<template>
  <div>
    <h1>{{ title }}</h1>
    <button @click="increment">Count: {{ count }}</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      count: 0
    }
  },
  computed: {
    title() {
      return 'Hello ' + this.$store.state.user.name;
    }
  },
  methods: {
    increment() {
      this.count++;
    }
  }
}
</script>
```

### After:

```vue
<template>
  <div>
    <h1>{{ title }}</h1>
    <button @click="increment">Count: {{ count }}</button>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
const count = ref(0)

const title = computed(() => {
  return 'Hello ' + userStore.name
})

function increment() {
  count.value++
}
</script>
```

## Recommended Approach

Given the complexity of this migration, we recommend these steps:

1. Create a playground branch to test the Vue 3 setup
2. Start with a minimal working Vue 3 application
3. Migrate core components one by one
4. Test frequently to catch issues early
5. Consider using the migration build if needed for compatibility

## Migration Tracking

- [x] Update build tools and dependencies  
- [x] Migrate main.js and entry points
- [x] Migrate router
- [x] Migrate store from Vuex to Pinia (example created)
- [x] Migrate UI components from BootstrapVue to PrimeVue (framework set up)
- [x] Update i18n configuration
- [x] Migrate core components to Composition API (key components migrated)
- [x] Migrate graph and diagram components to Composition API
  - [x] Graph.vue
  - [x] GraphButtons.vue
  - [x] GraphMeta.vue
  - [x] GraphProperties.vue
  - [x] GraphThreats.vue
  - [x] ReadOnlyDiagram.vue
- [x] Migrate view components
  - [x] DiagramEdit.vue
  - [x] ThreatModel.vue
- [x] Migrate report components
  - [x] Coversheet.vue (report)
  - [x] ExecutiveSummary.vue (report)
  - [x] ReportEntity.vue (report)
  - [x] DiagramDetail.vue
  - [x] Coversheet.vue (printed-report)
  - [x] ExecutiveSummary.vue (printed-report)
  - [x] ReportEntity.vue (printed-report)
  - [x] ReportModel.vue (view)
- [x] Migrate Git provider components
  - [x] SelectionPage.vue (shared component)
  - [x] RepositoryAccess.vue
  - [x] BranchAccess.vue
  - [x] ThreatModelSelect.vue
- [ ] Migrate remaining components
  - [ ] Demo model components
- [ ] Complete the migration of Vuex stores to Pinia
- [ ] Update tests
- [ ] Test desktop functionality

## Migration Examples

Several examples have been created to demonstrate the migration process:

1. **VUE3_MIGRATION_EXAMPLE.vue** - Shows how to migrate a component (LocaleSelect) from Options API to Composition API
2. **VUE3_MIGRATION_STORE_EXAMPLE.js** - Shows how to migrate a Vuex store module to Pinia
3. **VUE3_MIGRATION_MAIN.js** - Shows how to update the main entry point
4. **VUE3_MIGRATION_ROUTER.js** - Shows how to update the router configuration

Additionally, the actual migration implementation files have been created:

### Core Framework
1. **src/main.vue3.js** - Updated main entry point for Vue 3
2. **src/router/index.vue3.js** - Updated router configuration for Vue Router 4
3. **src/i18n/index.vue3.js** - Updated i18n configuration for Vue I18n 9
4. **src/stores/locale.js** - Example Pinia store replacing Vuex

### Components
1. **src/App.vue3.vue** - Main application component migrated to Composition API
2. **src/components/Navbar.vue3.vue** - Navigation bar migrated to Composition API and PrimeVue
3. **src/components/LocaleSelect.vue3.vue** - Locale selection component migrated to Composition API
4. **src/components/FormButton.vue3.vue** - Reusable button component migrated to Composition API
5. **src/components/ProviderLoginButton.vue3.vue** - Login button component migrated to Composition API
6. **src/components/ThreatEditDialog.vue3.vue** - Complex form dialog migrated to PrimeVue

### UI Framework Transition
1. **src/plugins/primevue.js** - PrimeVue configuration and component registration
2. **src/styles/primevue-theme.scss** - Custom theme for PrimeVue matching app style
3. **src/styles/primevue-compatibility.scss** - Compatibility layer for Bootstrap classes

### Views
1. **src/views/HomePage.vue3.vue** - Home page migrated to Composition API and PrimeVue

These files demonstrate the actual implementation of the Vue 3 migration, including both the core framework changes and component migrations.
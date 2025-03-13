# Vue 2 to Vue 3 Component Migration Guide

This document outlines the pattern used to migrate components from Vue 2 Options API to Vue 3 Composition API in the Threat Dragon project.

## General Pattern

### Vue 2 Options API Component (Before)

```vue
<template>
  <div>
    <b-btn @click="onClick">{{ buttonText }}</b-btn>
    <p>{{ computedValue }}</p>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { SOME_ACTION } from '@/store/actions/some';

export default {
  name: 'ExampleComponent',
  props: {
    buttonText: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      localValue: ''
    };
  },
  computed: {
    ...mapState({
      stateValue: state => state.module.value
    }),
    ...mapGetters(['getSomeValue']),
    computedValue() {
      return this.stateValue + this.localValue;
    }
  },
  methods: {
    onClick() {
      this.$store.dispatch(SOME_ACTION);
      this.localValue = 'clicked';
    }
  },
  mounted() {
    console.log('Component mounted');
  }
};
</script>
```

### Vue 3 Composition API Component (After)

```vue
<template>
  <div>
    <Button @click="onClick">{{ buttonText }}</Button>
    <p>{{ computedValue }}</p>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useSomeStore } from '@/stores/some';
import Button from 'primevue/button';

// Props
const props = defineProps({
  buttonText: {
    type: String,
    required: true
  }
});

// State
const localValue = ref('');
const someStore = useSomeStore();

// Computed
const computedValue = computed(() => {
  return someStore.value + localValue.value;
});

// Methods
const onClick = () => {
  someStore.performAction();
  localValue.value = 'clicked';
};

// Lifecycle Hooks
onMounted(() => {
  console.log('Component mounted');
});
</script>
```

## Migration Steps

1. **Update Template**:
   - Replace Bootstrap-Vue components with PrimeVue components
   - Update event handlers and bindings for Vue 3 syntax

2. **Convert Script Block**:
   - Replace `<script>` with `<script setup>`
   - Import required composition API functions from Vue
   - Import Pinia stores instead of using Vuex mapState/mapGetters

3. **Convert Component Properties**:
   - Props: Use `defineProps()` instead of the `props` option
   - Data: Replace with `ref()` or `reactive()`
   - Computed: Use `computed()` function
   - Methods: Define as regular functions
   - Lifecycle hooks: Use on* prefixed functions (`onMounted`, `onUnmounted`, etc.)

4. **Replace Vuex Store Access**:
   - Use Pinia stores with `useStore()` pattern
   - Access state directly as properties (no more mapState)
   - Access actions as methods on the store instance

5. **Component Registration**:
   - Import PrimeVue components directly
   - No need to register in `components` option

## UI Component Replacements

| Bootstrap-Vue | PrimeVue |
|---------------|----------|
| `<b-btn>` | `<Button>` |
| `<b-form>` | `<form>` with PrimeVue inputs |
| `<b-input>` | `<InputText>` |
| `<b-card>` | `<Card>` |
| `<b-dropdown>` | `<Dropdown>` or `<Menu>` |
| `<b-modal>` | `<Dialog>` |
| `<b-table>` | `<DataTable>` |
| `<b-tabs>` | `<TabView>` and `<TabPanel>` |
| `<b-row>` | `<div class="grid">` |
| `<b-col>` | `<div class="col">` |
| `<b-container>` | `<div class="container">` |

## Benefits

1. **Better Performance**: Vue 3's Composition API is more efficient
2. **Code Organization**: Logic can be grouped by feature rather than by option type
3. **Reusability**: Easily extract and reuse logic across components
4. **TypeScript Support**: Better type checking with TypeScript
5. **Tree-Shaking**: Smaller bundle size due to better tree-shaking support
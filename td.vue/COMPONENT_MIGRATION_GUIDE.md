# Vue 2 to Vue 3 Component Migration Guide

This document outlines the process for migrating Vue 2 components to Vue 3 using the Composition API and PrimeVue components.

## Migration Steps

1. **Convert from Options API to Composition API**
   - Replace `export default { ... }` with `<script setup>`
   - Use `defineProps()` instead of the `props` option
   - Import composables and Vue functions directly
   - Use `ref()`, `reactive()`, and `computed()` for state management
   - Replace lifecycle hooks with their composition equivalents

2. **Replace Bootstrap-Vue with PrimeVue**
   - Replace b-row/b-col with PrimeVue's grid system (div with .grid and .col-* classes)
   - Replace b-button with PrimeVue's Button component
   - Replace b-card with PrimeVue's Card component
   - Replace b-form inputs with PrimeVue's form components

3. **Migrate from Vuex to Pinia**
   - Replace `this.$store.state.module.property` with store composables:
     - `const store = useStore()`
     - Access state directly: `store.property`
   - Replace `this.$store.dispatch('action')` with direct method calls:
     - `store.action()`
   - Replace `this.$store.commit('mutation')` with direct state changes:
     - `store.property = newValue`

## Component Patterns

### Vue 2 Component (Options API with Bootstrap-Vue)

```vue
<template>
  <b-card :header="title">
    <b-row>
      <b-col md="6">
        <div>{{ content }}</div>
      </b-col>
    </b-row>
  </b-card>
</template>

<script>
export default {
  name: 'ExampleComponent',
  props: {
    title: String
  },
  data() {
    return {
      content: 'Hello World'
    }
  },
  methods: {
    doSomething() {
      this.$store.dispatch('module/action');
    }
  },
  computed: {
    computedValue() {
      return this.$store.state.module.value;
    }
  },
  mounted() {
    console.log('Component mounted');
  }
}
</script>
```

### Vue 3 Component (Composition API with PrimeVue)

```vue
<template>
  <Card :header="title">
    <div class="grid">
      <div class="col-12 md:col-6">
        <div>{{ content }}</div>
      </div>
    </div>
  </Card>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import Card from 'primevue/card';
import { useModuleStore } from '@/stores/module';

// Props
const props = defineProps({
  title: {
    type: String,
    default: ''
  }
});

// Store
const moduleStore = useModuleStore();

// State
const content = ref('Hello World');

// Computed
const computedValue = computed(() => moduleStore.value);

// Methods
const doSomething = () => {
  moduleStore.action();
};

// Lifecycle
onMounted(() => {
  console.log('Component mounted');
});
</script>
```

## PrimeVue Grid System

Bootstrap's grid system uses `b-row` and `b-col`. In PrimeVue:

```html
<!-- Bootstrap-Vue -->
<b-row>
  <b-col md="6" lg="4">Content</b-col>
  <b-col md="6" lg="8">More content</b-col>
</b-row>

<!-- PrimeVue -->
<div class="grid">
  <div class="col-12 md:col-6 lg:col-4">Content</div>
  <div class="col-12 md:col-6 lg:col-8">More content</div>
</div>
```

## PrimeVue Form Elements

```html
<!-- Bootstrap-Vue -->
<b-form-input v-model="name" placeholder="Enter name"></b-form-input>
<b-form-checkbox v-model="checked">Check me</b-form-checkbox>
<b-button variant="primary" @click="submit">Submit</b-button>

<!-- PrimeVue -->
<InputText v-model="name" placeholder="Enter name" />
<Checkbox v-model="checked" :binary="true" />
<label class="p-checkbox-label">Check me</label>
<Button label="Submit" severity="primary" @click="submit" />
```

## Bootstrap to PrimeVue Classes

| Bootstrap | PrimeVue |
|-----------|----------|
| mt-2 | p-mt-2 |
| mb-3 | p-mb-3 |
| px-2 | p-px-2 |
| d-flex | p-d-flex |
| justify-content-between | p-jc-between |
| text-center | p-text-center |
| bg-primary | p-bg-primary |
| text-danger | p-text-danger |

## Best Practices

1. Always use `<script setup>` for new components
2. Use typed props with `defineProps<{ ... }>()`
3. Prefer composables for reusable logic
4. Use `ref()` for primitive values and `reactive()` for objects
5. Use async/await for asynchronous operations
6. Import PrimeVue components individually
7. Use CSS grid and flexbox for layout when possible

## Testing Components

See the `TEST_MIGRATION_GUIDE.md` for details on testing Vue 3 components.

## Resources

- [Vue 3 Composition API Documentation](https://vuejs.org/guide/extras/composition-api-faq.html)
- [PrimeVue Documentation](https://primevue.org/)
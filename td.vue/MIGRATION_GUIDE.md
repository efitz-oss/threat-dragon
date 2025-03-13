# Vue 3 Migration Guide

This document outlines the best practices and migration steps for the OWASP Threat Dragon application moving to Vue 3 and modern patterns.

## 1. Composition API Migration

The application is transitioning from Vue 2's Options API to Vue 3's Composition API. Here's how to migrate components:

### Before (Options API):

```vue
<script>
export default {
  name: 'MyComponent',
  props: {
    title: String
  },
  data() {
    return {
      count: 0
    }
  },
  computed: {
    doubleCount() {
      return this.count * 2;
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

### After (Composition API with `<script setup>`):

```vue
<script setup>
import { ref, computed } from 'vue';

// Props
const props = defineProps({
  title: String
});

// State
const count = ref(0);

// Computed
const doubleCount = computed(() => count.value * 2);

// Methods
function increment() {
  count.value++;
}
</script>
```

### Key Migration Points:

1. Replace `export default {}` with `<script setup>`
2. Import Vue composition functions: `ref`, `computed`, `watch`, etc.
3. Use `defineProps()` for props
4. Use `defineEmits()` for emitted events
5. Replace `data()` properties with `ref()` or `reactive()`
6. Replace `methods` with regular functions
7. Replace `computed` properties with `computed()` functions

## 2. Store Migration (Vuex to Pinia)

We're moving from Vuex to Pinia for state management. Here's how to migrate:

### Before (Vuex Module):

```js
// store/modules/counter.js
export default {
  state: {
    count: 0
  },
  getters: {
    doubleCount: (state) => state.count * 2
  },
  mutations: {
    INCREMENT: (state) => state.count++
  },
  actions: {
    increment: ({ commit }) => commit('INCREMENT')
  }
};
```

### After (Pinia Store):

```js
// stores/counter.js
import { defineStore } from 'pinia';

export const useCounterStore = defineStore('counter', {
  // State
  state: () => ({
    count: 0
  }),
  
  // Getters
  getters: {
    doubleCount: (state) => state.count * 2
  },
  
  // Actions
  actions: {
    increment() {
      this.count++;
    }
  }
});

// Alternative setup syntax:
export const useCounterStore = defineStore('counter', () => {
  // State
  const count = ref(0);
  
  // Getters
  const doubleCount = computed(() => count.value * 2);
  
  // Actions
  function increment() {
    count.value++;
  }
  
  return { count, doubleCount, increment };
});
```

### Updating Components:

#### Before (Vuex):

```vue
<script>
import { mapState, mapActions } from 'vuex';

export default {
  computed: {
    ...mapState({
      count: state => state.counter.count
    })
  },
  methods: {
    ...mapActions(['increment'])
  }
}
</script>
```

#### After (Pinia):

```vue
<script setup>
import { useCounterStore } from '@/stores/counter';

// Access the store
const counterStore = useCounterStore();

// Access state and actions directly
function handleClick() {
  counterStore.increment();
  console.log(counterStore.count);
}
</script>
```

## 3. Migration Utility

We've created a utility to help with the transition from Vuex to Pinia. It provides compatibility for components that still use the Vuex pattern:

```js
// src/stores/utils/vuex-migration.js
import { useStore } from '@/stores/utils/vuex-migration';

// Use this in components that still need Vuex access
const store = useStore();
store.dispatch('SOME_ACTION', payload);
```

## 4. UI Components Migration

We're transitioning from Bootstrap Vue to PrimeVue:

### Before (Bootstrap Vue):
```vue
<b-card title="Card Title">
  <b-button variant="primary" @click="handleClick">Click me</b-button>
</b-card>
```

### After (PrimeVue):
```vue
<Card>
  <template #header>Card Title</template>
  <template #content>
    <Button severity="primary" @click="handleClick">Click me</Button>
  </template>
</Card>
```

## Migration Progress Tracking

- [ ] Component migration to Composition API
- [ ] State management migration to Pinia
- [ ] UI components migration to PrimeVue
- [ ] Route handling updates
- [ ] Testing framework updates

## Resources

- [Vue 3 Composition API Guide](https://vuejs.org/guide/extras/composition-api-faq.html)
- [Pinia Documentation](https://pinia.vuejs.org/)
- [PrimeVue Documentation](https://primevue.org/documentation)
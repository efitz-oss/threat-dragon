# Vuex to Pinia Store Migration Guide

This document outlines the pattern used to migrate Threat Dragon's Vuex stores to Pinia.

## General Pattern

### Vuex Store Structure (Before)

```js
// store/modules/example.js
import { EXAMPLE_ACTION, EXAMPLE_MUTATION } from '../actions/example.js';

const state = {
  data: null,
  loading: false
};

const actions = {
  [EXAMPLE_ACTION]: ({ commit }, payload) => commit(EXAMPLE_MUTATION, payload)
};

const mutations = {
  [EXAMPLE_MUTATION]: (state, payload) => {
    state.data = payload;
  }
};

const getters = {
  getData: (state) => state.data
};

export default {
  state,
  actions,
  mutations,
  getters
};
```

### Pinia Store Structure (After)

```js
// stores/example.js
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useExampleStore = defineStore('example', () => {
  // State (replaces Vuex state)
  const data = ref(null);
  const loading = ref(false);
  
  // Getters (replaces Vuex getters)
  const getData = computed(() => data.value);
  
  // Actions (combines Vuex actions and mutations)
  const performAction = (payload) => {
    data.value = payload;
  };
  
  // Return state and methods
  return {
    // State
    data,
    loading,
    
    // Getters
    getData,
    
    // Actions
    performAction
  };
}, {
  // Optional: Persistence configuration
  persist: {
    storage: sessionStorage,
    key: 'td.pinia.example'
  }
});
```

## Migration Steps

1. **Create Pinia Store**: Create a new file in the `src/stores` directory with the same name as the Vuex module.

2. **Convert State**:
   - Replace Vuex state object with Vue 3 refs
   - Example: `const data = ref(null);`

3. **Convert Getters**:
   - Replace Vuex getters with Vue 3 computed properties
   - Example: `const getData = computed(() => data.value);`

4. **Combine Actions and Mutations**:
   - In Pinia, actions directly modify state, so mutations are no longer needed
   - Convert Vuex actions and their corresponding mutations into Pinia actions

5. **Add Persistence**:
   - Add `persist` option to store that requires persistence
   - Configure storage type and key

## Component Usage Comparison

### Vuex (Before)

```js
import { mapState, mapGetters, mapActions } from 'vuex';
import { EXAMPLE_ACTION } from '@/store/actions/example.js';

export default {
  computed: {
    ...mapState({
      data: state => state.example.data
    }),
    ...mapGetters(['getData'])
  },
  methods: {
    onButtonClick() {
      this.$store.dispatch(EXAMPLE_ACTION, 'new value');
    }
  }
};
```

### Pinia (After)

```js
import { useExampleStore } from '@/stores/example';

// Inside setup() or script setup
const exampleStore = useExampleStore();

// Access state
const data = computed(() => exampleStore.data);

// Access getters
const getterValue = computed(() => exampleStore.getData);

// Dispatch actions
function onButtonClick() {
  exampleStore.performAction('new value');
}
```

## Benefits of Pinia

1. **Simpler Architecture**: No mutations, no modules, just stores with state, getters, and actions
2. **Type Safety**: Better TypeScript support
3. **Developer Experience**: Simpler debugging and DevTools integration
4. **Vue 3 Compatibility**: Built for Vue 3 and the Composition API
5. **Direct State Modification**: No need to use mutations to modify state

## Libraries Removed

- `vuex`: Replaced with `pinia`
- `vuex-persist`: Replaced with `pinia-plugin-persistedstate`
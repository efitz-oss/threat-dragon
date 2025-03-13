# Vuex to Pinia Migration Guide

This document outlines the process for migrating from Vuex to Pinia for state management in the Threat Dragon application.

## Key Differences Between Vuex and Pinia

| Feature | Vuex | Pinia |
|---------|------|-------|
| Store Structure | Single store with modules | Multiple stores |
| State | Requires mutations to change | Direct modification allowed |
| Mutations | Required | Not used (use actions or direct modifications) |
| Getters | Defined in getters object | Computed properties returned from store |
| Namespacing | Required for modules | Not needed, stores are independent |
| TypeScript Support | Limited | Full (auto-completion, type safety) |
| Devtools | Built-in | Built-in with better visualization |
| Code Organization | Larger, more verbose | Leaner, more intuitive |

## Migration Steps

### 1. Create Equivalent Pinia Store

**Vuex Module:**
```js
// store/modules/auth.js
export default {
  namespaced: true,
  state: {
    user: null,
    isLocal: false
  },
  mutations: {
    SET_USER(state, user) {
      state.user = user;
    },
    SET_LOCAL(state, isLocal) {
      state.isLocal = isLocal;
    }
  },
  actions: {
    login({ commit }, user) {
      commit('SET_USER', user);
    },
    setLocal({ commit }) {
      commit('SET_LOCAL', true);
    }
  },
  getters: {
    isAuthenticated: state => !!state.user,
    isLocal: state => state.isLocal
  }
};
```

**Pinia Store:**
```js
// stores/auth.js
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref(null);
  const isLocal = ref(false);
  
  // Getters (as computed properties)
  const isAuthenticated = computed(() => !!user.value);
  
  // Actions
  const login = (userData) => {
    user.value = userData;
  };
  
  const setLocal = () => {
    isLocal.value = true;
  };
  
  return {
    // State
    user,
    isLocal,
    
    // Getters
    isAuthenticated,
    
    // Actions
    login,
    setLocal
  };
}, {
  persist: {
    storage: localStorage,
    key: 'td.auth'
  }
});
```

### 2. Update Components

**Vuex in Vue 2:**
```js
// Vue 2 with Vuex
export default {
  computed: {
    user() {
      return this.$store.state.auth.user;
    },
    isAuthenticated() {
      return this.$store.getters['auth/isAuthenticated'];
    }
  },
  methods: {
    login() {
      this.$store.dispatch('auth/login', { username: 'user' });
    }
  }
};
```

**Pinia in Vue 3:**
```js
// Vue 3 with Pinia
import { useAuthStore } from '@/stores/auth';

export default {
  setup() {
    const authStore = useAuthStore();
    
    const login = () => {
      authStore.login({ username: 'user' });
    };
    
    return {
      // Access state directly
      user: authStore.user,
      
      // Access getters directly
      isAuthenticated: authStore.isAuthenticated,
      
      // Methods
      login
    };
  }
};
```

Or with Composition API and `<script setup>`:

```js
<script setup>
import { useAuthStore } from '@/stores/auth';

// Store
const authStore = useAuthStore();

// Methods
const login = () => {
  authStore.login({ username: 'user' });
};
</script>

<template>
  <div>
    <p v-if="authStore.isAuthenticated">Welcome, {{ authStore.user.username }}</p>
    <button @click="login">Login</button>
  </div>
</template>
```

### 3. Handle Store Persistence

**Vuex:**
```js
// Store persistence with vuex-persist
import VuexPersist from 'vuex-persist';

const vuexPersist = new VuexPersist({
  key: 'td-app',
  storage: localStorage
});

export default new Vuex.Store({
  plugins: [vuexPersist.plugin],
  // ...
});
```

**Pinia:**
```js
// main.js
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

// In the store definition
export const useAuthStore = defineStore('auth', () => {
  // Store implementation
}, {
  persist: {
    storage: localStorage,
    key: 'td.auth'
  }
});
```

## Migrating Specific Vuex Features

### 1. Modules

Vuex modules become individual Pinia stores:

```js
// stores/index.js
export { useAuthStore } from './auth';
export { useThreatmodelStore } from './threatmodel';
export { useConfigStore } from './config';
// ...etc
```

### 2. Actions with Async Operations

**Vuex:**
```js
actions: {
  async fetchData({ commit }) {
    try {
      const response = await api.getData();
      commit('SET_DATA', response.data);
      return response.data;
    } catch (error) {
      commit('SET_ERROR', error);
      throw error;
    }
  }
}
```

**Pinia:**
```js
// Within the store
const fetchData = async () => {
  try {
    const response = await api.getData();
    data.value = response.data;
    return response.data;
  } catch (error) {
    error.value = error;
    throw error;
  }
};
```

### 3. Using Other Stores

**Vuex:**
```js
actions: {
  async doSomething({ commit, dispatch }) {
    await dispatch('otherModule/otherAction', null, { root: true });
    commit('UPDATE_STATE');
  }
}
```

**Pinia:**
```js
// Within the store
import { useOtherStore } from './otherStore';

const doSomething = async () => {
  const otherStore = useOtherStore();
  await otherStore.otherAction();
  // Update local state directly
  someState.value = newValue;
};
```

## Testing Pinia Stores

**Mocking Pinia stores in tests:**

```js
import { setActivePinia, createPinia } from 'pinia';
import { useAuthStore } from '@/stores/auth';

describe('AuthStore', () => {
  beforeEach(() => {
    // Create a fresh pinia for each test
    setActivePinia(createPinia());
  });

  it('initializes with correct values', () => {
    const store = useAuthStore();
    expect(store.user).toBeNull();
    expect(store.isAuthenticated).toBe(false);
  });

  it('can login a user', () => {
    const store = useAuthStore();
    store.login({ username: 'testuser' });
    expect(store.user.username).toBe('testuser');
    expect(store.isAuthenticated).toBe(true);
  });
});
```

**Using Testing Pinia:**

```js
import { createTestingPinia } from '@pinia/testing';
import { mount } from '@vue/test-utils';
import { useAuthStore } from '@/stores/auth';
import LoginComponent from '@/components/LoginComponent.vue';

describe('LoginComponent', () => {
  it('logs in when button is clicked', async () => {
    const wrapper = mount(LoginComponent, {
      global: {
        plugins: [
          createTestingPinia({
            initialState: {
              auth: { user: null }
            }
          })
        ]
      }
    });

    const store = useAuthStore();
    
    // Mock the action
    store.login = vi.fn();
    
    // Click the login button
    await wrapper.find('button').trigger('click');
    
    // Check that the action was called
    expect(store.login).toHaveBeenCalledWith({ username: 'user' });
  });
});
```

## Resources

- [Pinia Documentation](https://pinia.vuejs.org/)
- [Vue 3 Documentation](https://vuejs.org/)
- [Migration from Vuex](https://pinia.vuejs.org/cookbook/migration-vuex.html)
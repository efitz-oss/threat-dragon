# Test Migration Guide: Vue 2 to Vue 3 (with Vue Test Utils)

This document provides guidance for migrating tests from Vue 2 to Vue 3 using Vue Test Utils v2.

## Key Changes

### Setup and Imports

**Vue 2 Testing (Vue Test Utils v1)**
```js
import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';

const localVue = createLocalVue();
localVue.use(Vuex);
```

**Vue 3 Testing (Vue Test Utils v2)**
```js
import { shallowMount } from '@vue/test-utils';
import { createTestingPinia } from '@pinia/testing';
```

### Mounting Components

**Vue 2 Testing**
```js
const wrapper = shallowMount(Component, {
  localVue,
  store,
  propsData: { /* props */ },
  mocks: { /* mocks */ },
  stubs: { /* stubs */ }
});
```

**Vue 3 Testing**
```js
const wrapper = shallowMount(Component, {
  global: {
    plugins: [
      createTestingPinia({
        initialState: {
          // Initial store state
        },
        stubActions: false
      })
    ],
    stubs: { /* stubs */ },
    mocks: { /* mocks */ }
  },
  props: { /* props */ } // Note: propsData is now props
});
```

### Store Access and Testing

**Vue 2 Testing with Vuex**
```js
// Mock store setup
const store = new Vuex.Store({
  modules: {
    auth: {
      namespaced: true,
      state: { /* state */ },
      actions: { /* actions */ }
    }
  }
});

// In test
expect(store.state.auth.user).toBeDefined();
store.dispatch('auth/login');
```

**Vue 3 Testing with Pinia**
```js
// Access stores in tests
import { useAuthStore } from '@/stores/auth';

// In test
const authStore = useAuthStore();
expect(authStore.user).toBeDefined();
authStore.login();
```

### Finding Elements

**Vue 2 Testing**
```js
wrapper.find('.class-name').trigger('click');
wrapper.findComponent(ComponentName).vm.doSomething();
```

**Vue 3 Testing**
```js
// Similar syntax but prefer data-testid attributes
wrapper.find('[data-testid="your-test-id"]').trigger('click');
wrapper.findComponent(ComponentName).vm.doSomething();
```

### Slots and Rendering HTML

**Vue 2 Testing**
```js
const wrapper = shallowMount(Component, {
  slots: {
    default: '<div>Default slot content</div>'
  }
});
```

**Vue 3 Testing**
```js
const wrapper = shallowMount(Component, {
  slots: {
    default: () => '<div>Default slot content</div>'
  }
});
```

### Event Handling

**Vue 2 Testing**
```js
wrapper.find('button').trigger('click');
expect(wrapper.emitted().click).toBeTruthy();
```

**Vue 3 Testing**
```js
await wrapper.find('button').trigger('click'); // Note: await is now recommended
expect(wrapper.emitted('click')).toBeTruthy();
```

### Using nextTick

**Vue 2 Testing**
```js
await wrapper.vm.$nextTick();
```

**Vue 3 Testing**
```js
// Import directly from Vue
import { nextTick } from 'vue';
await nextTick();
```

### Testing Composables

For testing composables in Vue 3:

```js
import { renderComposable } from '@/utils/test-helpers';
import { useMyComposable } from '@/composables/myComposable';

describe('useMyComposable', () => {
  it('should do something', () => {
    const { result } = renderComposable(() => useMyComposable());
    expect(result.value).toBe(expectedValue);
  });
});
```

## Example: Component Test Migration

### Vue 2 Test

```js
import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import MyComponent from '@/components/MyComponent.vue';

const localVue = createLocalVue();
localVue.use(Vuex);

describe('MyComponent.vue', () => {
  let store;
  let actions;
  
  beforeEach(() => {
    actions = {
      fetchData: jest.fn()
    };
    
    store = new Vuex.Store({
      modules: {
        data: {
          namespaced: true,
          state: {
            items: []
          },
          actions
        }
      }
    });
  });
  
  it('renders correctly', () => {
    const wrapper = shallowMount(MyComponent, {
      localVue,
      store,
      propsData: {
        title: 'My Title'
      }
    });
    
    expect(wrapper.find('h1').text()).toBe('My Title');
    wrapper.find('button').trigger('click');
    expect(actions.fetchData).toHaveBeenCalled();
  });
});
```

### Vue 3 Test

```js
import { shallowMount } from '@vue/test-utils';
import { createTestingPinia } from '@pinia/testing';
import { useDataStore } from '@/stores/data';
import MyComponent from '@/components/MyComponent.vue';

describe('MyComponent.vue', () => {
  it('renders correctly', async () => {
    const wrapper = shallowMount(MyComponent, {
      global: {
        plugins: [
          createTestingPinia({
            initialState: {
              data: {
                items: []
              }
            }
          })
        ]
      },
      props: {
        title: 'My Title'
      }
    });
    
    const dataStore = useDataStore();
    // Mock the action
    dataStore.fetchData = vi.fn();
    
    expect(wrapper.find('h1').text()).toBe('My Title');
    await wrapper.find('button').trigger('click');
    expect(dataStore.fetchData).toHaveBeenCalled();
  });
});
```

## Resources

- [Vue Test Utils v2 Documentation](https://test-utils.vuejs.org/)
- [Pinia Testing Guide](https://pinia.vuejs.org/cookbook/testing.html)
- [Vitest Documentation](https://vitest.dev/)
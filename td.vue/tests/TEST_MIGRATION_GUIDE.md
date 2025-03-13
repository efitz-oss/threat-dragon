# Test Migration Guide: Vue 2/Vuex to Vue 3/Pinia

This guide outlines how to migrate tests from Vue 2 with Vuex to Vue 3 with Pinia for the Threat Dragon project.

## Key Differences

1. **Test Utils API Changes**
   - No more `createLocalVue`
   - Props passed via `props` instead of `propsData`
   - Global configuration via `global` option
   - Component stubs via `global.stubs` or `global.components`

2. **Pinia Instead of Vuex**
   - Manual mocking of store composables is preferred
   - Access stores with composable functions (`useXStore()`)
   - Mock store actions directly on the store instance

3. **Composition API**
   - Testing components using Composition API and `<script setup>`
   - Mocking composables (like `useI18n`, `useRouter`)

4. **Other Changes**
   - Using `vi` instead of `jest` for Vitest
   - Using `findComponent` with object instead of component constructors

## Migration Steps

### 1. Update Imports

```javascript
// Vue 2/Vuex/Jest
import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import jest from 'jest';

// Vue 3/Pinia/Vitest
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount, shallowMount } from '@vue/test-utils';
```

### 2. Setup Component Testing

```javascript
// Vue 2/Vuex
const localVue = createLocalVue();
localVue.use(BootstrapVue);
localVue.component('font-awesome-icon', FontAwesomeIcon);
const store = new Vuex.Store({
  modules: {
    module: {
      state: { /* ... */ },
      actions: { /* ... */ }
    }
  }
});
const wrapper = shallowMount(Component, {
  localVue,
  store,
  propsData: { /* ... */ }
});

// Vue 3/Pinia
const wrapper = mount(Component, {
  props: { /* ... */ },
  global: {
    stubs: {
      // Stub components as needed
      'Button': true,
      'router-link': true
    },
    mocks: {
      // Provide mocks for globals
      $t: (key) => key,
      $route: { /* ... */ },
      $router: { /* ... */ }
    }
  }
});
```

### 3. Mocking Pinia Stores

```javascript
// Mock the store module directly
vi.mock('@/stores/locale', () => ({
    useLocaleStore: vi.fn(() => ({
        locale: 'eng',
        selectLocale: vi.fn()
    }))
}));

// Import the mocked store
import { useLocaleStore } from '@/stores/locale';

describe('Component Test', () => {
    let wrapper;
    let mockStore;

    beforeEach(() => {
        // Configure the mock store
        mockStore = {
            locale: 'eng',
            selectLocale: vi.fn()
        };
        
        // Set the mock implementation
        useLocaleStore.mockImplementation(() => mockStore);
        
        wrapper = mount(Component, {
            props: { /* ... */ }
        });
    });

    it('calls store action', async () => {
        await wrapper.find('button').trigger('click');
        expect(mockStore.selectLocale).toHaveBeenCalled();
    });
});
```

### 4. Testing Component Props with Script Setup

```javascript
// Component with script setup
<script setup>
defineProps({
  text: {
    type: String,
    required: true
  }
});
</script>

// Testing props in Vue 3
it('reads the prop value', () => {
  expect(wrapper.props().text).toEqual('expected text');
});

it('requires the text prop', () => {
  const propDef = wrapper.vm.$options.props.text;
  expect(propDef.required).toBe(true);
});
```

### 5. Testing Events

```javascript
// Vue 2/Vuex
it('emits an event', async () => {
  await wrapper.find('button').trigger('click');
  expect(wrapper.emitted().eventName).toBeTruthy();
});

// Vue 3/Pinia
it('emits an event', async () => {
  await wrapper.find('button').trigger('click');
  expect(wrapper.emitted('eventName')).toBeTruthy();
});
```

## Example: Basic Component Test

```javascript
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import FormButton from '@/components/FormButton.vue';

describe('FormButton Component', () => {
    let wrapper;
    
    beforeEach(() => {
        wrapper = mount(FormButton, {
            props: {
                onBtnClick: vi.fn(),
                text: 'Save',
                icon: 'save',
                isPrimary: true
            },
            global: {
                stubs: {
                    Button: true
                }
            }
        });
    });
    
    it('renders correctly', () => {
        expect(wrapper.exists()).toBe(true);
    });
    
    it('reads props correctly', () => {
        expect(wrapper.props().text).toBe('Save');
    });
    
    it('triggers click handler when clicked', async () => {
        const mockFn = vi.fn();
        await wrapper.setProps({ onBtnClick: mockFn });
        
        await wrapper.trigger('click');
        expect(mockFn).toHaveBeenCalled();
    });
});
```

## Example: Component with Store Test

```javascript
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';

// Mock the store module directly
vi.mock('@/stores/auth', () => ({
    useAuthStore: vi.fn(() => ({
        username: 'testuser',
        logout: vi.fn()
    }))
}));

// Import the mocked store
import { useAuthStore } from '@/stores/auth';
import Navbar from '@/components/Navbar.vue';

describe('Navbar Component', () => {
    let wrapper;
    let mockAuthStore;
    let mockRouter;

    beforeEach(() => {
        mockAuthStore = {
            username: 'testuser',
            logout: vi.fn()
        };
        
        mockRouter = {
            push: vi.fn().mockResolvedValue({})
        };
        
        useAuthStore.mockImplementation(() => mockAuthStore);
        
        wrapper = mount(Navbar, {
            global: {
                stubs: {
                    'Button': true,
                    'Menubar': true
                },
                mocks: {
                    $router: mockRouter,
                    $t: key => key
                }
            }
        });
    });

    it('shows username when logged in', () => {
        const loggedInText = wrapper.find('.logged-in-as');
        expect(loggedInText.text()).toContain('testuser');
    });
    
    it('logs out when sign out button is clicked', async () => {
        const signOutBtn = wrapper.find('#nav-sign-out');
        await signOutBtn.trigger('click');
        
        expect(mockAuthStore.logout).toHaveBeenCalled();
        expect(mockRouter.push).toHaveBeenCalledWith('/');
    });
});
```

## Running Tests

To run tests with the simplified configuration:

```bash
npx vitest run --config vitest.simple.config.js tests/unit/basic-button.test.js
```

## Migration Checklist

- [ ] Update imports to use Vitest and Vue Test Utils 2
- [ ] Replace component mounting code to use proper Vue 3 patterns
- [ ] Convert Vuex store mocking to use Pinia store composables
- [ ] Update event testing to use async/await pattern
- [ ] Run tests with the simplified configuration until all tests pass

## Resources

- [Vue Test Utils v2 docs](https://test-utils.vuejs.org/)
- [Vitest docs](https://vitest.dev/)
- [Pinia docs](https://pinia.vuejs.org/)
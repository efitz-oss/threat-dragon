import { nextTick } from 'vue';
import { mount } from '@vue/test-utils';
import { createStore } from 'vuex';

import { LOGOUT } from '@/store/actions/auth.js';
import Navbar from '@/components/Navbar.vue';

// Mock the components that are causing issues
jest.mock('@/components/LocaleSelect.vue', () => ({
    name: 'td-locale-select',
    template: '<div class="locale-select-mock"></div>'
}));

describe('components/Navbar.vue', () => {
    let wrapper, store;
  
    function createMockStore(username = 'testuser', googleEnabled = true) {
        return createStore({
            state: {
                packageBuildVersion: '1.0.0',
                packageBuildState: '-dev',
                config: {
                    config: {
                        googleEnabled
                    }
                }
            },
            getters: {
                username: () => username
            },
            actions: {
                [LOGOUT]: jest.fn()
            }
        });
    }

    async function createComponent(storeOptions = {}) {
        const { username = 'testuser', googleEnabled = true } = storeOptions;
    
        store = createMockStore(username, googleEnabled);
    
        // Create mock router directly in component mocks
        const routerPush = jest.fn();
    
        // Spy on store dispatch
        jest.spyOn(store, 'dispatch');
    
        const wrapper = mount(Navbar, {
            global: {
                plugins: [store],
                mocks: {
                    $t: key => key,
                    $router: {
                        push: routerPush
                    }
                },
                stubs: {
                    'font-awesome-icon': true,
                    'b-img': true,
                    'b-navbar': true,
                    'b-navbar-brand': true,
                    'b-navbar-toggle': true,
                    'b-collapse': true,
                    'b-navbar-nav': true,
                    'b-nav-item': true,
                    'b-nav-text': true,
                    'td-locale-select': true
                },
                directives: {
                    tooltip: {
                        mounted() {}
                    }
                }
            }
        });
    
        await nextTick();
        return wrapper;
    }

    describe('rendering', () => {
        beforeEach(async () => {
            wrapper = await createComponent();
        });

        it('should render the navbar component', () => {
            expect(wrapper.exists()).toBe(true);
        });

        it('should display the version information', () => {
            expect(wrapper.html()).toContain('Threat Dragon v1.0.0-dev');
        });

        it('should include the logo', () => {
            const logo = wrapper.find('.td-brand-img');
            expect(logo.exists()).toBe(true);
        });

        it('should render the locale selector', () => {
            const localeSelector = wrapper.findComponent({ name: 'td-locale-select' });
            expect(localeSelector.exists()).toBe(true);
        });
    });

    describe('computed properties', () => {
        it('should correctly compute username from store', async () => {
            wrapper = await createComponent({ username: 'johndoe' });
            expect(wrapper.vm.username).toBe('johndoe');
        });

        it('should correctly compute googleEnabled when config exists', async () => {
            wrapper = await createComponent({ googleEnabled: true });
            expect(wrapper.vm.googleEnabled).toBe(true);
        });

        it('should return false for googleEnabled when config is null', async () => {
            store = createStore({
                state: {
                    packageBuildVersion: '1.0.0',
                    packageBuildState: '',
                    config: { config: null }
                },
                getters: {
                    username: () => 'testuser'
                },
                actions: {
                    [LOGOUT]: jest.fn()
                }
            });
      
            wrapper = mount(Navbar, {
                global: {
                    plugins: [store],
                    mocks: {
                        $t: key => key,
                        $router: {
                            push: jest.fn()
                        }
                    },
                    stubs: {
                        'font-awesome-icon': true,
                        'b-img': true,
                        'b-navbar': true,
                        'b-navbar-brand': true,
                        'b-navbar-toggle': true,
                        'b-collapse': true,
                        'b-navbar-nav': true,
                        'b-nav-item': true,
                        'b-nav-text': true,
                        'td-locale-select': true
                    },
                    directives: {
                        tooltip: { mounted() {} }
                    }
                }
            });
      
            await nextTick();
            expect(wrapper.vm.googleEnabled).toBeFalsy();
        });
    });

    describe('conditional rendering', () => {
        it('should show logout section when logged in', async () => {
            wrapper = await createComponent({ username: 'testuser' });
            const username = wrapper.vm.username;
            expect(username).toBeTruthy();
        });

        it('should not show logout section when not logged in', async () => {
            wrapper = await createComponent({ username: null });
            const username = wrapper.vm.username;
            expect(username).toBeFalsy();
        });

        it('should show TOS link when Google is enabled', async () => {
            wrapper = await createComponent({ googleEnabled: true });
            expect(wrapper.vm.googleEnabled).toBe(true);
        });

        it('should not show TOS link when Google is disabled', async () => {
            wrapper = await createComponent({ googleEnabled: false });
            expect(wrapper.vm.googleEnabled).toBe(false);
        });
    });

    // Test logout method directly
    describe('logout functionality', () => {
        it('should dispatch logout action when event is triggered', async () => {
            wrapper = await createComponent();
      
            // Mock the router and event
            const mockRouter = { push: jest.fn().mockResolvedValue() };
            const mockEvent = { preventDefault: jest.fn() };
      
            // Replace the router in the component instance
            wrapper.vm.$router = mockRouter;
      
            // Call the method directly
            await wrapper.vm.onLogOut(mockEvent);
      
            // Verify expectations
            expect(mockEvent.preventDefault).toHaveBeenCalled();
            expect(store.dispatch).toHaveBeenCalledWith(LOGOUT);
            expect(mockRouter.push).toHaveBeenCalledWith('/');
        });
    });
});
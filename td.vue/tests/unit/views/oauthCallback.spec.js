import { nextTick } from 'vue';
import { createStore } from 'vuex';
import { AUTH_SET_JWT } from '@/store/actions/auth.js';
import loginApi from '@/service/api/loginApi.js';
import OAuthCallback from '@/views/OAuthCallback.vue';
import { mount } from '@vue/test-utils';

// Mock vue-router
const mockPush = jest.fn();
jest.mock('vue-router', () => ({
    useRouter: () => ({
        push: mockPush
    }),
    useRoute: () => ({
        query: { code: '1234-12345' }
    })
}));

// Will mock window.location in each test case

// Mock loginApi
jest.mock('@/service/api/loginApi.js', () => ({
    completeLoginAsync: jest.fn()
}));

describe('views/OAuthCallback.vue', () => {
    const jwt = 'foobar';
    const code = '1234-12345';
    const provider = 'test';
    let wrapper, mockStore;
    let originalLocation;

    beforeEach(() => {
        console.error = jest.fn();
        console.log = jest.fn();
        mockPush.mockClear();
        loginApi.completeLoginAsync.mockClear();
        
        // Save original location
        originalLocation = window.location;
        
        // Setup default window.location mock
        delete window.location;
        window.location = {
            search: '?code=1234-12345',
            hash: '',
            href: 'https://example.com/oauth-callback'
        };
    });

    afterEach(() => {
        // Restore original location after each test
        window.location = originalLocation;
    });

    describe('expected path', () => {
        beforeEach(async () => {
            // Create vuex store with the provider
            mockStore = createStore({
                state: {
                    provider: {
                        selected: provider
                    }
                },
                actions: {
                    AUTH_SET_JWT: jest.fn()
                }
            });
            
            // Spy on the dispatch method
            jest.spyOn(mockStore, 'dispatch');
            
            // Mock API response
            loginApi.completeLoginAsync.mockResolvedValue({ data: jwt });
            
            // Mount the component
            wrapper = mount(OAuthCallback, {
                global: {
                    plugins: [mockStore]
                }
            });
            
            // Wait for mounted hook to execute
            await nextTick();
            await nextTick(); // Additional nextTick for async code
        });

        it('completes the login', () => {
            // Verify login was completed
            expect(loginApi.completeLoginAsync).toHaveBeenCalledWith(provider, code);
        });

        it('dispatches the AUTH_SET_JWT action', () => {
            // Verify store action was dispatched
            expect(mockStore.dispatch).toHaveBeenCalledWith('AUTH_SET_JWT', { data: jwt });
        });

        it('navigates to the dashboard', () => {
            // Verify navigation
            expect(mockPush).toHaveBeenCalledWith({ name: 'MainDashboard' });
        });
    });

    describe('missing provider', () => {
        beforeEach(async () => {
            // Create vuex store without the provider
            mockStore = createStore({
                state: {
                    provider: {
                        selected: null
                    }
                },
                actions: {
                    PROVIDER_SELECTED: jest.fn()
                }
            });
            
            // Spy on the dispatch method
            jest.spyOn(mockStore, 'dispatch');
            
            // Mock API response
            loginApi.completeLoginAsync.mockResolvedValue({ data: jwt });
            
            // Mount the component
            wrapper = mount(OAuthCallback, {
                global: {
                    plugins: [mockStore]
                }
            });
            
            // Wait for mounted hook to execute
            await nextTick();
            await nextTick(); // Additional nextTick for async code
        });

        it('defaults to google provider when provider is missing', () => {
            expect(mockStore.dispatch).toHaveBeenCalledWith('PROVIDER_SELECTED', 'google');
            expect(loginApi.completeLoginAsync).toHaveBeenCalledWith('google', code);
        });
    });
    
    describe('hash fragment code extraction', () => {
        const hashCode = 'hash-code-12345';
        
        beforeEach(async () => {
            // Setup window location with hash fragment containing code
            window.location.search = ''; // No query parameters
            window.location.hash = `#/oauth-return?code=${hashCode}`;
            
            // Create vuex store with the provider
            mockStore = createStore({
                state: {
                    provider: {
                        selected: provider
                    }
                },
                actions: {
                    AUTH_SET_JWT: jest.fn()
                }
            });
            
            // Spy on the dispatch method
            jest.spyOn(mockStore, 'dispatch');
            
            // Mock API response
            loginApi.completeLoginAsync.mockResolvedValue({ data: jwt });
            
            // Mount the component
            wrapper = mount(OAuthCallback, {
                global: {
                    plugins: [mockStore]
                }
            });
            
            // Wait for mounted hook to execute
            await nextTick();
            await nextTick(); // Additional nextTick for async code
        });
        
        it('extracts code from hash fragment', () => {
            expect(loginApi.completeLoginAsync).toHaveBeenCalledWith(provider, hashCode);
        });
    });

    describe('error handling', () => {
        beforeEach(async () => {
            // Create vuex store with the provider
            mockStore = createStore({
                state: {
                    provider: {
                        selected: provider
                    }
                }
            });
            
            // Mock API error
            loginApi.completeLoginAsync.mockRejectedValue(new Error('API error'));
            
            // Mount the component
            wrapper = mount(OAuthCallback, {
                global: {
                    plugins: [mockStore]
                }
            });
            
            // Wait for mounted hook to execute
            await nextTick();
            await nextTick(); // Additional nextTick for async code
        });

        it('handles API errors gracefully', () => {
            expect(console.error).toHaveBeenCalled();
            expect(loginApi.completeLoginAsync).toHaveBeenCalled();
        });
    });
});

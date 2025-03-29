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

// Mock window.location
const originalLocation = window.location;
delete window.location;
window.location = {
    search: '?code=1234-12345'
};

// Mock loginApi
jest.mock('@/service/api/loginApi.js', () => ({
    completeLoginAsync: jest.fn()
}));

describe('views/OAuthCallback.vue', () => {
    const jwt = 'foobar';
    const code = '1234-12345';
    const provider = 'test';
    let wrapper, mockStore;

    beforeEach(() => {
        console.error = jest.fn();
        mockPush.mockClear();
        loginApi.completeLoginAsync.mockClear();
    });

    afterAll(() => {
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
                }
            });
            
            // Mount the component
            wrapper = mount(OAuthCallback, {
                global: {
                    plugins: [mockStore]
                }
            });
            
            // Wait for mounted hook to execute
            await nextTick();
        });

        it('navigates to home page if provider is missing', () => {
            expect(mockPush).toHaveBeenCalledWith({ name: 'HomePage' });
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

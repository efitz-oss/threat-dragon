import { describe, it, expect, beforeEach, vi } from 'vitest';
import { shallowMount } from '@vue/test-utils';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

// Mock the stores
vi.mock('@/stores/provider', () => ({
    useProviderStore: vi.fn(() => ({
        selectProvider: vi.fn(),
    })),
}));

vi.mock('@/stores/auth', () => ({
    useAuthStore: vi.fn(() => ({
        setLocal: vi.fn(),
    })),
}));

// Mock the router
vi.mock('vue-router', () => ({
    useRouter: vi.fn(() => ({
        push: vi.fn(),
    })),
}));

// Mock the loginApi
vi.mock('@/service/api/loginApi.js', () => ({
    default: {
        loginAsync: vi.fn(),
    },
}));

import { useProviderStore } from '@/stores/provider';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';
import loginApi from '@/service/api/loginApi.js';
import TdProviderLoginButton from '@/components/ProviderLoginButton.vue';

describe('components/ProviderLoginButton.vue', () => {
    const getProvider = () => ({
        key: 'github',
        displayName: 'GitHub',
        provider: {},
        icon: ['fab', 'github'],
    });

    const mountWithProvider = () => {
        wrapper = shallowMount(TdProviderLoginButton, {
            props: {
                provider,
            },
            global: {
                stubs: {
                    Button: {
                        template:
                            '<button class="p-button" @click="$emit(\'click\')"><slot /></button>',
                        emits: ['click'],
                    },
                    'font-awesome-icon': FontAwesomeIcon,
                },
                mocks: {
                    $t: (key) => key,
                },
            },
        });
    };

    let wrapper, provider;
    let mockProviderStore, mockAuthStore, mockRouter;

    describe('components', () => {
        describe('local session', () => {
            beforeEach(async () => {
                provider = getProvider();
                provider.key = 'local';

                // Set up mocks
                mockProviderStore = {
                    selectProvider: vi.fn(),
                };
                useProviderStore.mockReturnValue(mockProviderStore);

                mockAuthStore = {
                    setLocal: vi.fn(),
                };
                useAuthStore.mockReturnValue(mockAuthStore);

                mockRouter = {
                    push: vi.fn(),
                };
                useRouter.mockReturnValue(mockRouter);

                mountWithProvider();
                await wrapper.find('button').trigger('click');
            });

            it('reads the provider value', () => {
                expect(wrapper.props().provider).toEqual(provider);
            });

            it('uses a button', () => {
                expect(wrapper.find('button').exists()).toBe(true);
            });

            it('uses a font awesome icon', () => {
                expect(wrapper.findComponent(FontAwesomeIcon).exists()).toBe(true);
            });

            it('calls the provider store selectProvider method', () => {
                expect(mockProviderStore.selectProvider).toHaveBeenCalledWith(provider.key);
            });

            it('calls the auth store setLocal method', () => {
                expect(mockAuthStore.setLocal).toHaveBeenCalled();
            });

            it('navigates to the dashboard', () => {
                expect(mockRouter.push).toHaveBeenCalledWith('/dashboard');
            });
        });

        describe('other provider', () => {
            beforeEach(async () => {
                provider = getProvider();

                // Set up mocks
                mockProviderStore = {
                    selectProvider: vi.fn(),
                };
                useProviderStore.mockReturnValue(mockProviderStore);

                mockAuthStore = {
                    setLocal: vi.fn(),
                };
                useAuthStore.mockReturnValue(mockAuthStore);

                loginApi.loginAsync.mockResolvedValue({ data: 'https://oauth.example.com' });

                // Mock window.location
                const originalLocation = window.location;
                delete window.location;
                window.location = { href: '' };

                mountWithProvider();
                await wrapper.find('button').trigger('click');
            });

            it('calls the provider store selectProvider method', () => {
                expect(mockProviderStore.selectProvider).toHaveBeenCalledWith(provider.key);
            });

            it('calls the login api', () => {
                expect(loginApi.loginAsync).toHaveBeenCalledWith(provider.key);
            });
        });
    });
});

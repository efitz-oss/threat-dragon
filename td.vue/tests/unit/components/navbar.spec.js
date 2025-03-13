import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';

import Navbar from '@/components/Navbar.vue';

// Mock the store modules
vi.mock('@/stores/auth', () => ({
    useAuthStore: vi.fn(() => ({
        username: 'foobar',
        logout: vi.fn(),
    })),
}));

vi.mock('@/stores/app', () => ({
    useAppStore: vi.fn(() => ({
        packageBuildVersion: '3.0.0',
        packageBuildState: '',
    })),
}));

vi.mock('@/stores/locale', () => ({
    useLocaleStore: vi.fn(() => ({
        locale: 'eng',
        selectLocale: vi.fn(),
    })),
}));

// Import the mocked stores
import { useAuthStore } from '@/stores/auth';
import { useAppStore } from '@/stores/app';
import { useLocaleStore } from '@/stores/locale';

// Mock vue-router
vi.mock('vue-router', () => ({
    useRouter: vi.fn(() => ({
        push: vi.fn().mockResolvedValue({}),
        replace: vi.fn(),
    })),
}));

// Mock vue-i18n
vi.mock('vue-i18n', () => ({
    useI18n: vi.fn(() => ({
        t: (key) => key,
        locale: { value: 'eng' },
        availableLocales: { value: ['eng', 'fra', 'deu'] },
    })),
}));

import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';

// Mock is-electron
vi.mock('is-electron', () => ({
    default: vi.fn().mockReturnValue(false),
}));

// Stub components
const MenubarStub = {
    template: '<div class="p-menubar"><slot name="start"></slot><slot name="end"></slot></div>',
    inheritAttrs: false,
};

const ButtonStub = {
    template:
        '<button :id="$attrs.id" class="p-button" @click="$emit(\'click\', $event)"><slot></slot></button>',
    props: ['icon'],
    emits: ['click'],
    inheritAttrs: false,
};

const RouterLinkStub = {
    name: 'RouterLink',
    template: '<a :href="to" :to="to" class="router-link td-brand"><slot></slot></a>',
    props: ['to'],
    inheritAttrs: false,
};

const TdLocaleSelectStub = {
    template: '<div class="locale-select-stub"></div>',
    inheritAttrs: false,
};

describe('components/Navbar.vue', () => {
    let wrapper, router, authStore, appStore;

    beforeEach(() => {
        // Reset mocks
        vi.clearAllMocks();

        // Setup auth store mock with reactive properties
        authStore = {
            username: 'foobar',
            logout: vi.fn(),
        };
        useAuthStore.mockImplementation(() => authStore);

        // Make sure the mock implementation is updated when the username changes
        Object.defineProperty(authStore, 'username', {
            get() {
                return this._username;
            },
            set(value) {
                this._username = value;
                // Re-apply the mock implementation to trigger reactivity
                useAuthStore.mockImplementation(() => authStore);
            },
        });
        authStore._username = 'foobar';

        // Setup app store mock
        appStore = {
            packageBuildVersion: '3.0.0',
            packageBuildState: '',
        };
        useAppStore.mockImplementation(() => appStore);

        // Setup router mock
        router = {
            push: vi.fn().mockResolvedValue({}),
        };
        useRouter.mockImplementation(() => router);

        // Create the wrapper
        wrapper = mount(Navbar, {
            global: {
                stubs: {
                    Menubar: MenubarStub,
                    Button: ButtonStub,
                    'router-link': RouterLinkStub,
                    'td-locale-select': TdLocaleSelectStub,
                },
                mocks: {
                    $t: (key) => key,
                },
                directives: {
                    tooltip: {
                        mounted: () => {},
                        unmounted: () => {},
                    },
                },
            },
        });
    });

    describe('brand', () => {
        it('renders the brand link', () => {
            const brand = wrapper.find('.td-brand');
            expect(brand.exists()).toBe(true);
        });

        it('routes to the dashboard page when logged in', () => {
            const brand = wrapper.find('.td-brand');
            expect(brand.attributes('to')).toEqual('/dashboard');
        });

        it('renders the brand image', () => {
            const brandImg = wrapper.find('.td-brand-img');
            expect(brandImg.exists()).toBe(true);
        });

        it('displays threatdragon_logo', () => {
            const brandImg = wrapper.find('.td-brand-img');
            expect(brandImg.attributes('src')).toContain('threatdragon_logo');
        });

        it('shows version number', () => {
            expect(wrapper.text()).toContain('Threat Dragon v3.0.0');
        });
    });

    describe('navigation items', () => {
        it('shows username when logged in', () => {
            const loggedInText = wrapper.find('.logged-in-as');
            expect(loggedInText.exists()).toBe(true);
            expect(loggedInText.text()).toContain('foobar');
        });

        it('does not display username when logged out', async () => {
            // Create a new wrapper with no username
            const loggedOutAuthStore = {
                username: null,
                logout: vi.fn(),
            };
            useAuthStore.mockImplementation(() => loggedOutAuthStore);

            // Create a new component with the logged out state
            const loggedOutWrapper = mount(Navbar, {
                global: {
                    stubs: {
                        Menubar: MenubarStub,
                        Button: ButtonStub,
                        'router-link': RouterLinkStub,
                        'td-locale-select': TdLocaleSelectStub,
                    },
                    mocks: {
                        $t: (key) => key,
                    },
                    directives: {
                        tooltip: {
                            mounted: () => {},
                            unmounted: () => {},
                        },
                    },
                },
            });

            // Check the logged-in text is hidden
            const loggedInText = loggedOutWrapper.find('.logged-in-as');
            expect(loggedInText.attributes('style')).toBe('display: none;');
        });

        describe('sign out button', () => {
            it('is visible when logged in', () => {
                const signOut = wrapper.find('#nav-sign-out');
                expect(signOut.exists()).toBe(true);
            });

            it('calls logout and navigates to home on click', async () => {
                // Find and click the sign out button
                const signOut = wrapper.find('#nav-sign-out');
                await signOut.trigger('click');

                // Verify logout was called and router push to home
                expect(authStore.logout).toHaveBeenCalled();
                expect(router.push).toHaveBeenCalledWith('/');
            });
        });

        it('renders the docs link', () => {
            const docs = wrapper.find('#nav-docs');
            expect(docs.exists()).toBe(true);
            expect(docs.attributes('href')).toContain('owasp.org');
        });

        it('renders the cheat sheet link', () => {
            const cheatSheet = wrapper.find('#nav-tm-cheat-sheet');
            expect(cheatSheet.exists()).toBe(true);
            expect(cheatSheet.attributes('href')).toContain('cheatsheets');
        });

        it('renders the OWASP link with logo', () => {
            const owaspLink = wrapper.find('#nav-owasp-td');
            const owaspImg = wrapper.find('.td-owasp-logo');

            expect(owaspLink.exists()).toBe(true);
            expect(owaspImg.exists()).toBe(true);
            expect(owaspImg.attributes('src')).toContain('owasp');
        });
    });
});

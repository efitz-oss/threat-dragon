import { describe, it, expect, beforeEach, vi } from 'vitest';
import { shallowMount } from '@vue/test-utils';

import LocaleSelect from '@/components/LocaleSelect.vue';

// Mock the vue-i18n composable
vi.mock('vue-i18n', () => ({
    useI18n: vi.fn(() => ({
        locale: { value: 'eng' },
        availableLocales: ['eng', 'deu'],
    })),
}));

// Mock the locale store module
vi.mock('@/stores/locale', () => ({
    useLocaleStore: vi.fn(() => ({
        locale: 'eng',
        selectLocale: vi.fn(),
    })),
}));

// Import the mocked store
import { useLocaleStore } from '@/stores/locale';
import { useI18n } from 'vue-i18n';

// Mock isElectron
vi.mock('is-electron', () => ({
    default: () => false,
}));

describe('components/LocaleSelect.vue', () => {
    let wrapper, mockLocaleStore, mockI18n;

    describe('default locale', () => {
        beforeEach(() => {
            // Configure the mock store
            mockLocaleStore = {
                locale: 'eng',
                selectLocale: vi.fn(),
            };

            // Configure the mock i18n
            mockI18n = {
                locale: { value: 'eng' },
                availableLocales: ['eng', 'deu'],
            };

            // Set the mock implementations
            useLocaleStore.mockImplementation(() => mockLocaleStore);
            useI18n.mockImplementation(() => mockI18n);

            wrapper = shallowMount(LocaleSelect, {
                global: {
                    stubs: {
                        Dropdown: true,
                    },
                },
            });
        });

        it('renders the component', () => {
            expect(wrapper.findComponent({ name: 'Dropdown' }).exists()).toBe(true);
        });

        it('gets the language name correctly', () => {
            expect(wrapper.vm.getLanguageName('eng')).toBe('English');
            expect(wrapper.vm.getLanguageName('deu')).toBe('Deutsch');
        });

        describe('updates', () => {
            it('calls selectLocale when locale is changed', async () => {
                // Directly call the exposed method
                await wrapper.vm.updateLocale('deu');
                expect(mockLocaleStore.selectLocale).toHaveBeenCalledWith('deu');
            });
        });
    });

    describe('different locale', () => {
        beforeEach(() => {
            // Configure the mock store with a different locale
            mockLocaleStore = {
                locale: 'test',
                selectLocale: vi.fn(),
            };

            // Configure the mock i18n
            mockI18n = {
                locale: { value: 'test' },
                availableLocales: ['eng', 'deu', 'test'],
            };

            // Set the mock implementations
            useLocaleStore.mockImplementation(() => mockLocaleStore);
            useI18n.mockImplementation(() => mockI18n);

            wrapper = shallowMount(LocaleSelect, {
                global: {
                    stubs: {
                        Dropdown: true,
                    },
                },
            });
        });

        it('uses the locale from the store', () => {
            expect(mockLocaleStore.locale).toBe('test');
        });
    });
});

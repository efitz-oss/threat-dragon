/**
 * Test that shows how to mock Pinia stores without helper libraries
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';

// Mock the Pinia store - do this BEFORE importing anything that uses it
vi.mock('@/stores/locale', () => ({
    useLocaleStore: vi.fn(() => ({
        locale: 'eng',
        selectLocale: vi.fn(),
    })),
}));

// Import the component and store AFTER mocking
import FormButton from '@/components/FormButton.vue';
import { useLocaleStore } from '@/stores/locale';

describe('Component with Store Mocking', () => {
    let wrapper;
    let mockStore;

    beforeEach(() => {
        // Setup the mock store for this test
        mockStore = {
            locale: 'eng',
            selectLocale: vi.fn(),
        };

        // Update the mock implementation
        useLocaleStore.mockImplementation(() => mockStore);

        wrapper = mount(FormButton, {
            props: {
                onBtnClick: () => {},
                text: 'Save',
                icon: 'save',
            },
            global: {
                stubs: {
                    Button: true,
                },
            },
        });
    });

    it('renders correctly', () => {
        expect(wrapper.exists()).toBe(true);
    });

    it('can access mocked store', () => {
        const store = useLocaleStore();
        expect(store.locale).toBe('eng');

        // Update the store value
        store.locale = 'fra';
        expect(store.locale).toBe('fra');
    });

    it('allows mocking store actions', async () => {
        const store = useLocaleStore();
        await store.selectLocale('fra');
        expect(mockStore.selectLocale).toHaveBeenCalledWith('fra');
    });
});

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';

import { useLocaleStore, LOCALE_SELECTED } from '@/stores/locale.js';

describe('stores/locale.js', () => {
    beforeEach(() => {
        // Create a fresh Pinia instance for each test
        setActivePinia(createPinia());
    });

    describe('state', () => {
        it('initializes with default locale set to eng', () => {
            const localeStore = useLocaleStore();

            expect(localeStore.locale).toBe('eng');
        });
    });

    describe('actions', () => {
        describe('selectLocale', () => {
            it('sets the locale', () => {
                const localeStore = useLocaleStore();
                const newLocale = 'fra';

                // Call selectLocale action
                localeStore.selectLocale(newLocale);

                // Verify state updated
                expect(localeStore.locale).toBe(newLocale);
            });
        });
    });

    describe('legacy dispatch pattern', () => {
        it('supports legacy LOCALE_SELECTED action through dispatch helper', () => {
            // Import the dispatchLocaleAction function that provides backward compatibility
            const { dispatchLocaleAction } = require('@/stores/locale.js');

            const store = useLocaleStore();
            const newLocale = 'esp';

            // Spy on the store action
            vi.spyOn(store, 'selectLocale');

            // Mock useLocaleStore to return our store with the spy
            const originalUseLocaleStore = global.useLocaleStore;
            global.useLocaleStore = vi.fn().mockReturnValue(store);

            try {
                // Use the legacy dispatch pattern
                dispatchLocaleAction(LOCALE_SELECTED, newLocale);

                // Verify the action was called
                expect(store.selectLocale).toHaveBeenCalledWith(newLocale);

                // Verify state was updated
                expect(store.locale).toBe(newLocale);
            } finally {
                // Restore the original useLocaleStore
                global.useLocaleStore = originalUseLocaleStore;
            }
        });
    });
});

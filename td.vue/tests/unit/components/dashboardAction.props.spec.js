/**
 * Test that just checks prop definitions without rendering the component
 *
 * Note: For Vue 3 with script setup, prop definitions may not be accessible directly from
 * the imported component object. So we use mount to verify prop validation by checking
 * console warnings.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { mount } from '@vue/test-utils';
import TdDashboardAction from '@/components/DashboardAction.vue';

// This will test prop validation by checking for expected console warnings
describe('components/DashboardAction.vue - Props only', () => {
    let originalConsoleWarn;

    beforeEach(() => {
        // Mock console.warn to catch prop validation warnings
        originalConsoleWarn = console.warn;
        console.warn = vi.fn();
    });

    afterEach(() => {
        // Restore original console.warn
        console.warn = originalConsoleWarn;
    });

    it('requires the to prop', () => {
        mount(TdDashboardAction, {
            props: {
                // missing to prop
                icon: 'icon',
                description: 'description',
            },
            global: {
                stubs: {
                    'router-link': true,
                    Card: true,
                    'font-awesome-icon': true,
                },
            },
        });

        // Should warn about missing required prop
        expect(console.warn).toHaveBeenCalled();
        expect(console.warn.mock.calls[0][0]).toContain('Missing required prop: "to"');
    });

    it('requires the icon prop', () => {
        mount(TdDashboardAction, {
            props: {
                to: '/path',
                // missing icon prop
                description: 'description',
            },
            global: {
                stubs: {
                    'router-link': true,
                    Card: true,
                    'font-awesome-icon': true,
                },
            },
        });

        expect(console.warn).toHaveBeenCalled();
        expect(console.warn.mock.calls[0][0]).toContain('Missing required prop: "icon"');
    });

    it('does not require the iconPreface value', () => {
        // Should not warn about missing iconPreface
        mount(TdDashboardAction, {
            props: {
                to: '/path',
                icon: 'icon',
                description: 'description',
                // iconPreface missing but optional
            },
            global: {
                stubs: {
                    'router-link': true,
                    Card: true,
                    'font-awesome-icon': true,
                },
            },
        });

        // Should NOT warn about missing optional prop
        expect(console.warn).not.toHaveBeenCalledWith(
            expect.stringContaining('Missing required prop: "iconPreface"')
        );
    });

    it('requires the description', () => {
        mount(TdDashboardAction, {
            props: {
                to: '/path',
                icon: 'icon',
                // missing description prop
            },
            global: {
                stubs: {
                    'router-link': true,
                    Card: true,
                    'font-awesome-icon': true,
                },
            },
        });

        expect(console.warn).toHaveBeenCalled();
        expect(console.warn.mock.calls[0][0]).toContain('Missing required prop: "description"');
    });
});

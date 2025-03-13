import { shallowMount } from '@vue/test-utils';
import { describe, it, expect, beforeEach, vi } from 'vitest';

import ThreatModelSummaryCard from '@/components/ThreatModelSummaryCard.vue';

// Mock the threatmodel store
vi.mock('@/stores/threatmodel', () => ({
    useThreatmodelStore: vi.fn(() => ({
        data: {
            summary: {
                title: 'Test Model',
                owner: 'Test Owner',
            },
            detail: {
                reviewer: 'Test Reviewer',
                contributors: [{ name: 'Contributor 1' }, { name: 'Contributor 2' }],
            },
        },
    })),
}));

// Mock vue-i18n
vi.mock('vue-i18n', () => ({
    useI18n: vi.fn(() => ({
        t: (key) => key,
    })),
}));

// No need to mock KeyValueCard, we'll just check the props being passed to it

describe('components/ThreatModelSummaryCard.vue', () => {
    let wrapper;

    describe('without title prefix', () => {
        beforeEach(() => {
            wrapper = shallowMount(ThreatModelSummaryCard);
        });

        it('renders the KeyValueCard component', () => {
            const keyValueCard = wrapper.findComponent({ name: 'td-key-value-card' });
            expect(keyValueCard.exists()).toBe(true);
        });

        it('passes the correct title to the KeyValueCard', () => {
            const keyValueCard = wrapper.findComponent({ name: 'td-key-value-card' });
            expect(keyValueCard.props('title')).toBe('Test Model');
        });

        it('passes the correct values to the KeyValueCard', () => {
            const keyValueCard = wrapper.findComponent({ name: 'td-key-value-card' });
            const values = keyValueCard.props('values');

            expect(values.length).toBe(3);
            expect(values[0].key).toBe('threatmodel.owner');
            expect(values[0].value).toBe('Test Owner');
            expect(values[1].key).toBe('threatmodel.reviewer');
            expect(values[1].value).toBe('Test Reviewer');
            expect(values[2].key).toBe('threatmodel.contributors');
            expect(values[2].value).toBe('Contributor 1, Contributor 2');
        });
    });

    describe('with title prefix', () => {
        beforeEach(() => {
            wrapper = shallowMount(ThreatModelSummaryCard, {
                props: {
                    titlePrefix: 'Prefix',
                },
            });
        });

        it('includes the title prefix in the card title', () => {
            const keyValueCard = wrapper.findComponent({ name: 'td-key-value-card' });
            expect(keyValueCard.props('title')).toBe('Prefix Test Model');
        });
    });
});

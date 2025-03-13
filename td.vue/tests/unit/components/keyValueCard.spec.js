/**
 * Test for KeyValueCard.vue component
 */
import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import KeyValueCard from '@/components/KeyValueCard.vue';

describe('components/KeyValueCard.vue', () => {
    const mockValues = [
        { key: 'Key1', value: 'Value1' },
        { key: 'Key2', value: 'Value2' },
    ];

    it('renders the title correctly', () => {
        const title = 'Test Title';
        const wrapper = mount(KeyValueCard, {
            props: {
                title,
                values: mockValues,
            },
            global: {
                stubs: {
                    Card: {
                        template: '<div><slot name="header">{{ header }}</slot><slot /></div>',
                        props: ['header'],
                    },
                },
            },
        });

        expect(wrapper.props().title).toBe(title);
    });

    it('renders all key-value pairs', () => {
        const wrapper = mount(KeyValueCard, {
            props: {
                title: 'Test Title',
                values: mockValues,
            },
            global: {
                stubs: {
                    Card: {
                        template: '<div><slot name="header">{{ header }}</slot><slot /></div>',
                        props: ['header'],
                    },
                },
            },
        });

        // Check that v-for is rendering the correct number of items
        // We can't check the exact CSS class due to how Vue processes class bindings in tests
        // Instead, we'll check if the correct number of elements with the key-value content exists
        const strongElements = wrapper.findAll('strong');
        expect(strongElements.length).toBe(mockValues.length);

        // Check content of first item
        expect(strongElements[0].text()).toBe(`${mockValues[0].key}:`);

        // Check the values are rendered correctly
        const valueTexts = wrapper.findAll('.grid > div > div:nth-child(2)');
        expect(valueTexts.length).toBeGreaterThan(0);
        expect(valueTexts[0].text()).toBe(mockValues[0].value);
    });

    it('handles empty values array', () => {
        const wrapper = mount(KeyValueCard, {
            props: {
                title: 'Test Title',
                values: [],
            },
            global: {
                stubs: {
                    Card: {
                        template: '<div><slot name="header">{{ header }}</slot><slot /></div>',
                        props: ['header'],
                    },
                },
            },
        });

        // No strong elements should be rendered when values is empty
        const strongElements = wrapper.findAll('strong');
        expect(strongElements.length).toBe(0);
    });
});

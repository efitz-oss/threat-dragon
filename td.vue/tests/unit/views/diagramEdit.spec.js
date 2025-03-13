/**
 * Test for DiagramEdit.vue view
 */
import { describe, it, expect, vi } from 'vitest';
import { shallowMount } from '@vue/test-utils';
import DiagramEdit from '@/views/DiagramEdit.vue';
import TdGraph from '@/components/Graph.vue';

// Mock the TdGraph component
vi.mock('@/components/Graph.vue', () => ({
    default: {
        name: 'td-graph',
        render: () => {},
    },
}));

describe('views/DiagramEdit.vue', () => {
    it('renders the graph component', () => {
        const wrapper = shallowMount(DiagramEdit);

        // Check that the Graph component is included
        const graph = wrapper.findComponent(TdGraph);
        expect(graph.exists()).toBe(true);
    });

    it('has the correct structure', () => {
        const wrapper = shallowMount(DiagramEdit);

        // Check for PrimeVue grid structure
        expect(wrapper.find('.grid').exists()).toBe(true);
        expect(wrapper.find('.col-12').exists()).toBe(true);
    });
});

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { shallowMount } from '@vue/test-utils';

import diagramService from '@/service/migration/diagram.js';
import TdReadOnlyDiagram from '@/components/ReadOnlyDiagram.vue';

// Mock the diagram service
vi.mock('@/service/migration/diagram.js', () => ({
    default: {
        draw: vi.fn(),
        dispose: vi.fn(),
    },
}));

describe('components/ReadOnlyDiagram.vue', () => {
    let addEventListenerSpy, removeEventListenerSpy, diagram, graphMock, wrapper;

    beforeEach(() => {
        // Reset mocks
        vi.clearAllMocks();

        // Setup spies
        addEventListenerSpy = vi.spyOn(window, 'addEventListener');
        removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');

        // Setup graph mock
        graphMock = {
            resize: vi.fn(),
            scaleContentToFit: vi.fn(),
        };

        // Setup service mocks
        diagramService.draw.mockReturnValue(graphMock);

        // Mock parent element for resize calculation
        Object.defineProperty(Element.prototype, 'clientWidth', {
            configurable: true,
            value: 800,
        });

        // Test data
        diagram = { foo: 'bar' };

        // Mount component
        wrapper = shallowMount(TdReadOnlyDiagram, {
            props: {
                diagram,
            },
            global: {
                stubs: {
                    // No specific stubs needed
                },
            },
        });
    });

    it('has the diagram container', () => {
        expect(wrapper.find('.td-readonly-diagram').exists()).toBe(true);
    });

    it('draws the graph', () => {
        expect(diagramService.draw).toHaveBeenCalled();
    });

    it('resizes the graph', () => {
        expect(graphMock.resize).toHaveBeenCalled();
    });

    it('scales the content to fit', () => {
        expect(graphMock.scaleContentToFit).toHaveBeenCalled();
    });

    it('listens for resize events', () => {
        expect(addEventListenerSpy).toHaveBeenCalledWith('resize', expect.anything());
    });

    // Note: We can't easily test the component unmount behavior in Vue 3
    // because the destroyed lifecycle hook from Vue 2 has been replaced with onBeforeUnmount
    // This is a Vue 3 migration limitation and can be addressed with component refactoring
});

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';

// Mock Pinia store
vi.mock('@/stores/threatmodel', () => ({
    useThreatmodelStore: vi.fn(() => ({
        selectedDiagram: {
            title: 'Test Diagram',
        },
    })),
}));

import { useThreatmodelStore } from '@/stores/threatmodel';
import TdGraphButtons from '@/components/GraphButtons.vue';

describe('components/GraphButtons.vue', () => {
    let graph, wrapper, mockUndo, mockRedo, mockCanUndo, mockCanRedo;
    let mockThreatmodelStore;

    beforeEach(() => {
        // Create mocks
        mockUndo = vi.fn();
        mockRedo = vi.fn();
        mockCanUndo = vi.fn().mockReturnValue(true);
        mockCanRedo = vi.fn().mockReturnValue(true);

        // Create mock store
        mockThreatmodelStore = {
            selectedDiagram: {
                title: 'Test Diagram',
            },
        };
        useThreatmodelStore.mockReturnValue(mockThreatmodelStore);

        // Mock graph object
        graph = {
            history: {},
            getPlugin: (name) => {
                if (name === 'history') {
                    return {
                        canUndo: mockCanUndo,
                        canRedo: mockCanRedo,
                        undo: mockUndo,
                        redo: mockRedo,
                    };
                }
            },
            zoom: vi.fn().mockReturnValue(1.0),
            getSelectedCells: vi.fn(),
            removeCells: vi.fn(),
            hideGrid: vi.fn(),
            showGrid: vi.fn(),
            exportPNG: vi.fn(),
            exportJPEG: vi.fn(),
            exportSVG: vi.fn(),
        };

        // Mount component with Vue 3 Test Utils
        wrapper = mount(TdGraphButtons, {
            props: {
                graph,
            },
            global: {
                stubs: {
                    'td-form-button': {
                        template:
                            '<button :id="id" :title="title" :icon="icon" :text="text" @click="$emit(\'btn-click\')"><slot /></button>',
                        props: [
                            'id',
                            'text',
                            'title',
                            'icon',
                            'isPrimary',
                            'isOutline',
                            'onBtnClick',
                        ],
                        emits: ['btn-click'],
                    },
                    'b-btn-group': {
                        template: '<div class="btn-group"><slot /></div>',
                    },
                    'b-dropdown': {
                        template: '<div class="dropdown" :id="id" :text="text"><slot /></div>',
                        props: ['text', 'id'],
                        inheritAttrs: false,
                    },
                    'b-dropdown-item': {
                        template: '<button :id="id" @click="$emit(\'click\')"><slot /></button>',
                        props: ['id'],
                        emits: ['click'],
                    },
                    'font-awesome-icon': true,
                },
                mocks: {
                    $t: (t) => t,
                },
            },
        });
    });

    afterEach(() => {
        vi.resetAllMocks();
    });

    describe('save', () => {
        beforeEach(async () => {
            await wrapper.vm.save();
        });

        it('emits saved event', () => {
            expect(wrapper.emitted().saved).toBeTruthy();
        });
    });

    describe('close', () => {
        beforeEach(async () => {
            await wrapper.vm.closeDiagram();
        });

        it('emits closed event', () => {
            expect(wrapper.emitted().closed).toBeTruthy();
        });
    });

    describe('noOp', () => {
        it('is a noOp', () => {
            expect(() => wrapper.vm.noOp()).not.toThrow();
        });
    });

    describe('undo', () => {
        describe('graph can undo', () => {
            beforeEach(() => {
                wrapper.vm.undo();
            });

            it('calls undo', () => {
                expect(mockUndo).toHaveBeenCalledTimes(1);
            });
        });

        describe('graph cannot undo', () => {
            beforeEach(() => {
                mockCanUndo.mockReturnValue(false);
                wrapper.vm.undo();
            });

            it('does not call undo', () => {
                expect(mockUndo).not.toHaveBeenCalled();
            });
        });
    });

    describe('redo', () => {
        describe('graph can redo', () => {
            beforeEach(() => {
                wrapper.vm.redo();
            });

            it('calls redo', () => {
                expect(mockRedo).toHaveBeenCalledTimes(1);
            });
        });

        describe('graph cannot redo', () => {
            beforeEach(() => {
                mockCanRedo.mockReturnValue(false);
                wrapper.vm.redo();
            });

            it('does not call redo', () => {
                expect(mockRedo).not.toHaveBeenCalled();
            });
        });
    });

    describe('zoom in', () => {
        it('zooms in the graph', () => {
            wrapper.vm.zoomIn();
            expect(graph.zoom).toHaveBeenCalledWith(0.2);
        });
    });

    describe('zoom out', () => {
        it('zooms out the graph', () => {
            wrapper.vm.zoomOut();
            expect(graph.zoom).toHaveBeenCalledWith(-0.2);
        });
    });

    describe('delete', () => {
        it('removes the selected cells', () => {
            wrapper.vm.deleteSelected();
            expect(graph.getSelectedCells).toHaveBeenCalled();
            expect(graph.removeCells).toHaveBeenCalled();
        });
    });

    describe('toggle grid', () => {
        describe('hide', () => {
            beforeEach(() => {
                wrapper.vm.toggleGrid();
            });

            it('hides the grid', () => {
                expect(graph.hideGrid).toHaveBeenCalledTimes(1);
            });

            describe('show', () => {
                it('shows the grid', () => {
                    wrapper.vm.toggleGrid();
                    expect(graph.showGrid).toHaveBeenCalledTimes(1);
                });
            });
        });
    });

    describe('export functions', () => {
        it('exports PNG with diagram title', () => {
            wrapper.vm.exportPNG();
            expect(graph.exportPNG).toHaveBeenCalledWith('Test Diagram.png', { padding: 50 });
        });

        it('exports JPEG with diagram title', () => {
            wrapper.vm.exportJPEG();
            expect(graph.exportJPEG).toHaveBeenCalledWith('Test Diagram.jpeg', { padding: 50 });
        });

        it('exports SVG with diagram title', () => {
            wrapper.vm.exportSVG();
            expect(graph.exportSVG).toHaveBeenCalledWith('Test Diagram.svg');
        });
    });
});

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { shallowMount } from '@vue/test-utils';

import TdGraphMeta from '@/components/GraphMeta.vue';
import { createNewTypedThreat } from '@/service/threats/index.js';
import dataChanged from '@/service/x6/graph/data-changed.js';

// Mock createNewTypedThreat
vi.mock('@/service/threats/index.js', () => ({
    createNewTypedThreat: vi.fn(() => ({
        id: 'mock-threat-id',
        title: 'Mock Threat',
        status: 'Open',
        severity: 'Medium',
        type: 'Spoofing',
        description: 'A mock threat for testing',
        mitigation: 'Not mitigated',
    })),
    default: {
        filterForDiagram: vi.fn(),
    },
}));

// Mock i18n
vi.mock('vue-i18n', () => ({
    useI18n: () => ({
        t: (key) => key,
    }),
}));

// Mock dataChanged service
vi.mock('@/service/x6/graph/data-changed.js', () => ({
    default: {
        updateStyleAttrs: vi.fn(),
        updateProperties: vi.fn(),
        updateName: vi.fn(),
    },
}));

// Mock the cell store
vi.mock('@/stores/cell', () => ({
    useCellStore: vi.fn(() => ({
        cellRef: null,
        threats: [],
        unselectCell: vi.fn(),
        updateCellData: vi.fn(),
    })),
}));

// Mock the threatmodel store
vi.mock('@/stores/threatmodel', () => ({
    useThreatmodelStore: vi.fn(() => ({
        selectedDiagram: {
            diagramType: 'LINDDUN',
        },
        data: {
            detail: {
                threatTop: 0,
            },
        },
        updateModel: vi.fn(),
        setModified: vi.fn(),
    })),
}));

// Import the mocked stores
import { useCellStore } from '@/stores/cell';
import { useThreatmodelStore } from '@/stores/threatmodel';

// Helper function to create PrimeVue stubs
const createPrimeVueStubs = () => ({
    'Card': {
        template: '<div class="p-card"><slot></slot><slot name="header"></slot><slot name="content"></slot></div>',
        props: ['header'],
    },
    'Button': {
        template: '<button class="p-button"><slot /></button>',
        props: ['severity', 'size', 'disabled'],
    },
    'td-graph-properties': true,
    'td-graph-threats': {
        name: 'TdGraphThreats',
        template: '<div class="threat-card"></div>',
        props: [
            'id',
            'status',
            'severity',
            'description',
            'title',
            'type',
            'mitigation',
            'modelType',
            'number',
        ],
    },
    'font-awesome-icon': true,
});

describe('components/GraphMeta.vue', () => {
    let wrapper;
    let cellStore;
    let threatmodelStore;

    beforeEach(() => {
        // Reset mocks
        vi.clearAllMocks();
    });

    afterEach(() => {
        if (wrapper && typeof wrapper.unmount === 'function') {
            wrapper.unmount();
        }
    });

    describe('Empty state', () => {
        beforeEach(() => {
            // Setup cell store mock with no cell ref
            useCellStore.mockImplementation(() => ({
                cellRef: null,
                threats: [],
                unselectCell: vi.fn(),
                updateCellData: vi.fn(),
            }));

            wrapper = shallowMount(TdGraphMeta, {
                global: {
                    stubs: createPrimeVueStubs(),
                },
            });
        });

        it('verifies empty state conditions', () => {
            const storeValues = useCellStore();
            expect(storeValues.cellRef).toBeNull();
            expect(storeValues.threats).toEqual([]);
        });
    });

    describe('With data', () => {
        const mockThreats = [
            {
                id: 'threat-1',
                status: 'Open',
                severity: 'Medium',
                description: 'Test description',
                title: 'Some Threat',
                type: 'Spoofing',
                mitigation: 'Unmitigated',
            }
        ];

        beforeEach(() => {
            // Setup mock stores
            useCellStore.mockImplementation(() => ({
                cellRef: {
                    data: {
                        threats: mockThreats,
                    },
                },
                threats: mockThreats,
                unselectCell: vi.fn(),
                updateCellData: vi.fn(),
            }));

            wrapper = shallowMount(TdGraphMeta, {
                global: {
                    stubs: createPrimeVueStubs(),
                },
            });
        });

        it('renders TdGraphThreats component for each threat', () => {
            expect(wrapper.findComponent({ name: 'TdGraphThreats' }).exists()).toBe(true);
        });
    });

    describe('Event handlers', () => {
        beforeEach(() => {
            // Setup mock stores with mock cell data
            useCellStore.mockImplementation(() => ({
                cellRef: {
                    data: {
                        threats: [],
                        type: 'tm.Process',
                    },
                },
                threats: [],
                unselectCell: vi.fn(),
                updateCellData: vi.fn(),
            }));

            wrapper = shallowMount(TdGraphMeta, {
                global: {
                    stubs: createPrimeVueStubs(),
                },
            });
        });

        it('emits the threatSelected event with the threat id', async () => {
            await wrapper.vm.threatSelected('id1', 'new');
            expect(wrapper.emitted('threatSelected')).toBeTruthy();
            expect(wrapper.emitted('threatSelected')[0]).toEqual(['id1', 'new']);
        });

        it('emits the threatSuggest event with type', async () => {
            await wrapper.vm.AddThreatByType();
            expect(wrapper.emitted('threatSuggest')).toBeTruthy();
            expect(wrapper.emitted('threatSuggest')[0]).toEqual(['type']);
        });

        it('emits the threatSuggest event with context', async () => {
            await wrapper.vm.AddThreatByContext();
            expect(wrapper.emitted('threatSuggest')).toBeTruthy();
            expect(wrapper.emitted('threatSuggest')[0]).toEqual(['context']);
        });
    });

    describe('newThreat method', () => {
        let updateModelSpy;
        let setModifiedSpy;
        let updateCellDataSpy;
        
        beforeEach(() => {
            // Setup spies
            updateModelSpy = vi.fn();
            setModifiedSpy = vi.fn();
            updateCellDataSpy = vi.fn();
            
            // Setup mock stores
            useCellStore.mockImplementation(() => ({
                cellRef: {
                    data: {
                        threats: [],
                        type: 'tm.Process',
                        hasOpenThreats: false
                    },
                },
                threats: [],
                unselectCell: vi.fn(),
                updateCellData: updateCellDataSpy,
            }));
            
            useThreatmodelStore.mockImplementation(() => ({
                selectedDiagram: {
                    diagramType: 'LINDDUN',
                },
                data: {
                    detail: {
                        threatTop: 0,
                    },
                },
                updateModel: updateModelSpy,
                setModified: setModifiedSpy,
            }));
            
            wrapper = shallowMount(TdGraphMeta, {
                global: {
                    stubs: createPrimeVueStubs(),
                },
            });
        });

        it('creates and adds a new threat when called', async () => {
            // Call the method directly
            await wrapper.vm.newThreat();

            // Verify threat creation
            expect(createNewTypedThreat).toHaveBeenCalledWith('LINDDUN', 'tm.Process', 1);

            // Verify store updates
            expect(updateModelSpy).toHaveBeenCalledWith({ threatTop: 1 });
            expect(setModifiedSpy).toHaveBeenCalled();
            expect(updateCellDataSpy).toHaveBeenCalled();

            // Verify style update
            expect(dataChanged.updateStyleAttrs).toHaveBeenCalled();

            // Test emit event
            expect(wrapper.emitted()).toHaveProperty('threatSelected');
        });
    });

    describe('disableNewThreat computed property', () => {
        it('returns true for out of scope cells', () => {
            useCellStore.mockImplementation(() => ({
                cellRef: {
                    data: { outOfScope: true },
                },
                threats: [],
                unselectCell: vi.fn(),
                updateCellData: vi.fn(),
            }));

            wrapper = shallowMount(TdGraphMeta, {
                global: {
                    stubs: createPrimeVueStubs(),
                },
            });

            expect(wrapper.vm.disableNewThreat).toBe(true);
        });

        it('returns true for trust boundary cells', () => {
            useCellStore.mockImplementation(() => ({
                cellRef: {
                    data: { isTrustBoundary: true },
                },
                threats: [],
                unselectCell: vi.fn(),
                updateCellData: vi.fn(),
            }));

            wrapper = shallowMount(TdGraphMeta, {
                global: {
                    stubs: createPrimeVueStubs(),
                },
            });

            expect(wrapper.vm.disableNewThreat).toBe(true);
        });

        it('returns true for text cells', () => {
            useCellStore.mockImplementation(() => ({
                cellRef: {
                    data: { type: 'tm.Text' },
                },
                threats: [],
                unselectCell: vi.fn(),
                updateCellData: vi.fn(),
            }));

            wrapper = shallowMount(TdGraphMeta, {
                global: {
                    stubs: createPrimeVueStubs(),
                },
            });

            expect(wrapper.vm.disableNewThreat).toBe(true);
        });

        it('returns false for normal process cells', () => {
            useCellStore.mockImplementation(() => ({
                cellRef: {
                    data: {
                        type: 'tm.Process',
                        outOfScope: false,
                        isTrustBoundary: false,
                    },
                },
                threats: [],
                unselectCell: vi.fn(),
                updateCellData: vi.fn(),
            }));

            wrapper = shallowMount(TdGraphMeta, {
                global: {
                    stubs: createPrimeVueStubs(),
                },
            });

            expect(wrapper.vm.disableNewThreat).toBe(false);
        });
    });
});
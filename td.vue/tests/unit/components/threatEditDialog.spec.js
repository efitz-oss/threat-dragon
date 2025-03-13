import { shallowMount } from '@vue/test-utils';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createI18n } from 'vue-i18n';

import TdThreatEditDialog from '@/components/ThreatEditDialog.vue';
import dataChanged from '@/service/x6/graph/data-changed.js';

// Mock the Pinia stores
vi.mock('@/stores/cell', () => ({
    useCellStore: vi.fn(() => ({
        cellRef: {
            data: {
                threatFrequency: {
                    availability: 0,
                    confidentiality: 0,
                    integrity: 0,
                },
                threats: [],
                type: 'actor',
            },
        },
        updateCellData: vi.fn(),
    })),
}));

vi.mock('@/stores/threatmodel', () => ({
    useThreatmodelStore: vi.fn(() => ({
        data: {
            detail: {
                threatTop: 0,
            },
        },
        setModified: vi.fn(),
    })),
}));

// Mock the PrimeVue confirm dialog
vi.mock('primevue/useconfirm', () => ({
    useConfirm: vi.fn(() => ({
        require: vi.fn(({ accept, reject }) => {
            // Simulate confirm action in tests
            if (global.confirmChoice === true) {
                accept();
            } else {
                reject();
            }
        }),
    })),
}));

// Mock the threat models service
vi.mock('@/service/threats/models/index.js', () => ({
    default: {
        getThreatTypesByElement: vi.fn(() => ({
            'threats.model.cia.confidentiality': true,
            'threats.model.cia.integrity': true,
            'threats.model.cia.availability': true,
        })),
        getFrequencyMapByElement: vi.fn((model, type) => ({
            confidentiality: 0,
            integrity: 0,
            availability: 0,
        })),
    },
}));

// Import the other dependencies
import { useCellStore } from '@/stores/cell';
import { useThreatmodelStore } from '@/stores/threatmodel';
import { useConfirm } from 'primevue/useconfirm';

describe('components/ThreatEditDialog.vue', () => {
    let wrapper;
    const threatId = 'asdf-asdf-asdf-asdf';

    const getThreatData = () => ({
        status: 'Open',
        severity: 'High',
        description: 'Some description',
        title: 'My terrifying threat',
        type: 'Information Disclosure',
        mitigation: 'we will mitigate it eventually',
        modelType: 'CIA',
        new: false,
        number: 0,
        score: '',
        id: threatId,
    });

    // Setup store mocks
    let cellStore, threatmodelStore, confirm;

    beforeEach(() => {
        // Reset mocks
        vi.clearAllMocks();

        // Setup stores with fresh mocks
        cellStore = useCellStore();
        threatmodelStore = useThreatmodelStore();
        confirm = useConfirm();

        // Setup cell data with threats
        cellStore.cellRef.data.threats = [getThreatData()];

        // Setup dataChanged mock
        dataChanged.updateStyleAttrs = vi.fn();

        // Create i18n instance for the test
        const i18n = createI18n({
            legacy: false,
            locale: 'en',
            messages: {
                en: {},
            },
        });

        // Create wrapper
        wrapper = shallowMount(TdThreatEditDialog, {
            global: {
                plugins: [i18n],
                stubs: {
                    'b-modal': {
                        template: '<div><slot></slot><slot name="modal-footer"></slot></div>',
                        methods: {
                            show: vi.fn(),
                            hide: vi.fn(),
                        },
                    },
                    'b-form': true,
                    'b-form-row': true,
                    'b-col': true,
                    'b-form-group': true,
                    'b-form-input': true,
                    'b-form-select': true,
                    'b-form-radio-group': true,
                    'b-form-textarea': true,
                    'b-button': true,
                },
            },
        });

        // Setup modal ref methods
        wrapper.vm.editModal = {
            show: vi.fn(),
            hide: vi.fn(),
        };
    });

    describe('ui elements', () => {
        beforeEach(() => {
            wrapper.vm.editThreat(threatId);
        });

        it('has a bootstrap modal', () => {
            const modal = wrapper.findComponent({ name: 'b-modal' });
            expect(modal.exists()).toBe(true);
        });

        it('shows the modal', () => {
            expect(wrapper.vm.editModal.show).toHaveBeenCalled();
        });

        it('hides the modal', () => {
            wrapper.vm.hideModal();
            expect(wrapper.vm.editModal.hide).toHaveBeenCalled();
        });

        it('has a title input', () => {
            const input = wrapper.find('#title');
            expect(input.exists()).toBe(true);
        });

        it('has a threat type input', () => {
            const input = wrapper.find('#threat-type');
            expect(input.exists()).toBe(true);
        });

        it('has a status input', () => {
            const input = wrapper.find('#status');
            expect(input.exists()).toBe(true);
        });

        it('has a score input', () => {
            const input = wrapper.find('#score');
            expect(input.exists()).toBe(true);
        });

        it('has a priority input', () => {
            const input = wrapper.find('#priority');
            expect(input.exists()).toBe(true);
        });

        it('has a description input', () => {
            const input = wrapper.find('#description');
            expect(input.exists()).toBe(true);
        });

        it('has a mitigations input', () => {
            const input = wrapper.find('#mitigation');
            expect(input.exists()).toBe(true);
        });
    });

    describe('confirmDelete', () => {
        beforeEach(() => {
            wrapper.vm.editThreat(threatId);
        });

        describe('canceled', () => {
            beforeEach(async () => {
                global.confirmChoice = false;
                await wrapper.vm.confirmDelete();
            });

            it('does not delete the threat', () => {
                expect(cellStore.updateCellData).not.toHaveBeenCalled();
            });
        });

        describe('with confirmation', () => {
            beforeEach(async () => {
                global.confirmChoice = true;
                await wrapper.vm.confirmDelete();
            });

            it('updates the cell data with empty threats array', () => {
                expect(cellStore.updateCellData).toHaveBeenCalledWith({
                    threatFrequency: {
                        availability: 0,
                        confidentiality: 0,
                        integrity: 0,
                    },
                    threats: [],
                    type: 'actor',
                    hasOpenThreats: false,
                });
            });

            it('updates the style attributes', () => {
                expect(dataChanged.updateStyleAttrs).toHaveBeenCalled();
            });

            it('hides the modal', () => {
                expect(wrapper.vm.editModal.hide).toHaveBeenCalled();
            });

            it('marks the model as modified', () => {
                expect(threatmodelStore.setModified).toHaveBeenCalled();
            });
        });
    });

    describe('updateThreat', () => {
        beforeEach(() => {
            wrapper.vm.editThreat(threatId);
            wrapper.vm.updateThreat();
        });

        it('updates the cell data with threat changes', () => {
            expect(cellStore.updateCellData).toHaveBeenCalled();
        });

        it('marks the model as modified', () => {
            expect(threatmodelStore.setModified).toHaveBeenCalled();
        });

        it('updates the style attributes', () => {
            expect(dataChanged.updateStyleAttrs).toHaveBeenCalled();
        });

        it('hides the modal', () => {
            expect(wrapper.vm.editModal.hide).toHaveBeenCalled();
        });
    });
});

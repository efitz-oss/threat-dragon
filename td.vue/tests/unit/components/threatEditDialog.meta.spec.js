import { describe, it, expect, beforeEach, vi } from 'vitest';

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

// Mock the data changed service
vi.mock('@/service/x6/graph/data-changed.js', () => ({
    default: {
        updateStyleAttrs: vi.fn(),
    },
}));

// Mock threat models
vi.mock('@/service/threats/models/index.js', () => ({
    default: {
        getThreatTypesByElement: vi.fn(() => ({
            'threats.model.cia.confidentiality': true,
            'threats.model.cia.integrity': true,
            'threats.model.cia.availability': true,
        })),
        getFrequencyMapByElement: vi.fn(() => ({
            confidentiality: 0,
            integrity: 0,
            availability: 0,
        })),
    },
}));

// Import the dependencies
import { useCellStore } from '@/stores/cell';
import { useThreatmodelStore } from '@/stores/threatmodel';
import dataChanged from '@/service/x6/graph/data-changed.js';

describe('components/ThreatEditDialog.vue - Meta Tests', () => {
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
    let cellStore, threatmodelStore;

    describe('store interactions', () => {
        beforeEach(() => {
            // Reset mocks
            vi.clearAllMocks();

            // Setup stores with fresh mocks
            cellStore = useCellStore();
            threatmodelStore = useThreatmodelStore();

            // Setup cell data with threats
            cellStore.cellRef.data.threats = [getThreatData()];

            // Setup dataChanged mock
            dataChanged.updateStyleAttrs = vi.fn();
        });

        it('exposes necessary parameters for threat editing', () => {
            expect(cellStore.cellRef.data.threats[0].id).toBe(threatId);
            expect(cellStore.updateCellData).toBeDefined();
            expect(threatmodelStore.setModified).toBeDefined();
            expect(dataChanged.updateStyleAttrs).toBeDefined();
        });

        it('allows access to threat data', () => {
            const threat = cellStore.cellRef.data.threats.find((t) => t.id === threatId);
            expect(threat).toBeDefined();
            expect(threat.title).toBe('My terrifying threat');
            expect(threat.status).toBe('Open');
            expect(threat.severity).toBe('High');
        });
    });
});

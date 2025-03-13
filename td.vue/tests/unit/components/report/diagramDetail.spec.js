import { shallowMount } from '@vue/test-utils';
import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock ReadOnlyDiagram component to avoid dependency on x6 modules
vi.mock('@/components/ReadOnlyDiagram.vue', () => ({
    default: {
        name: 'TdReadOnlyDiagram',
        template: '<div class="mock-diagram"></div>',
        props: ['diagram'],
    },
}));

// Mock ReportEntity component
vi.mock('@/components/report/ReportEntity.vue', () => ({
    default: {
        name: 'TdReportEntity',
        template: '<div class="mock-report-entity"></div>',
        props: [
            'entity',
            'outOfScope',
            'showMitigated',
            'showOutOfScope',
            'showProperties',
            'showEmpty',
        ],
    },
}));

// Mock PrintReportEntity component
vi.mock('@/components/printed-report/ReportEntity.vue', () => ({
    default: {
        name: 'TdPrintReportEntity',
        template: '<div class="mock-print-report-entity"></div>',
        props: [
            'entity',
            'outOfScope',
            'showMitigated',
            'showOutOfScope',
            'showProperties',
            'showEmpty',
        ],
    },
}));

import TdDiagramDetail from '@/components/report/DiagramDetail.vue';
import TdReadOnlyDiagram from '@/components/ReadOnlyDiagram.vue';
import TdReportEntity from '@/components/report/ReportEntity.vue';

// Stubs for Bootstrap-Vue components
const BRowStub = {
    template: '<div class="row"><slot></slot></div>',
    props: ['class'],
};

const BColStub = {
    template: '<div class="col"><slot></slot></div>',
};

describe('components/report/DiagramDetail.vue', () => {
    let propsData, wrapper;

    const getData = () => ({
        diagram: {
            title: 'foo',
            cells: [],
        },
        showDiagram: true,
        showMitigated: true,
        showOutOfScope: true,
        showEmpty: true,
    });

    const setup = (data) => {
        wrapper = shallowMount(TdDiagramDetail, {
            props: {
                diagram: data.diagram,
                showDiagram: data.showDiagram,
                showMitigated: data.showMitigated,
                showOutOfScope: data.showOutOfScope,
                showEmpty: data.showEmpty,
            },
            global: {
                stubs: {
                    'b-row': BRowStub,
                    'b-col': BColStub,
                },
            },
        });
    };

    describe('with diagram', () => {
        beforeEach(() => {
            propsData = getData();
            setup(propsData);
        });

        it('displays the diagram title', () => {
            expect(wrapper.find('.td-diagram-title').text()).toEqual(propsData.diagram.title);
        });

        it('shows the diagram', () => {
            expect(wrapper.findComponent(TdReadOnlyDiagram).exists()).toEqual(true);
        });
    });

    describe('without diagram', () => {
        beforeEach(() => {
            propsData = getData();
            propsData.showDiagram = false;
            setup(propsData);
        });

        it('displays the diagram title', () => {
            expect(wrapper.find('.diagram-page-title').exists()).toEqual(false);
        });

        it('shows the diagram', () => {
            expect(wrapper.findComponent(TdReadOnlyDiagram).exists()).toEqual(false);
        });
    });

    describe('entitiesWithThreats', () => {
        let cells;

        it('shows empty elements', () => {
            cells = [{ data: { threats: [] } }, { data: { threats: [{}] } }];
            propsData = getData();
            propsData.diagram.cells = cells;
            setup(propsData);
            expect(wrapper.findAllComponents(TdReportEntity)).toHaveLength(2);
        });

        it('hides empty elements', () => {
            cells = [{ data: { threats: [] } }, { data: { threats: [{}] } }];
            propsData = getData();
            propsData.diagram.cells = cells;
            propsData.showEmpty = false;
            setup(propsData);
            expect(wrapper.findAllComponents(TdReportEntity)).toHaveLength(1);
        });

        it('shows out of scope elements', () => {
            cells = [
                { data: { outOfScope: false, threats: [{}] } },
                { data: { outOfScope: true, threats: [{}] } },
            ];
            propsData = getData();
            propsData.diagram.cells = cells;
            propsData.showEmpty = false;
            setup(propsData);
            expect(wrapper.findAllComponents(TdReportEntity)).toHaveLength(2);
        });

        it('hides out of scope elements', () => {
            cells = [
                { data: { outOfScope: false, threats: [{}] } },
                { data: { outOfScope: true, threats: [{}] } },
            ];
            propsData = getData();
            propsData.diagram.cells = cells;
            propsData.showEmpty = false;
            propsData.showOutOfScope = false;
            setup(propsData);
            expect(wrapper.findAllComponents(TdReportEntity)).toHaveLength(1);
        });

        it('shows mitigated threats', () => {
            cells = [
                { data: { threats: [{ status: 'Open' }] } },
                { data: { threats: [{ status: 'Mitigated' }] } },
                { data: { threats: [{ status: 'Mitigated' }, { status: 'Open' }] } },
            ];
            propsData = getData();
            propsData.diagram.cells = cells;
            propsData.showEmpty = false;
            setup(propsData);
            expect(wrapper.findAllComponents(TdReportEntity)).toHaveLength(3);
        });

        it('hides mitigated threats', () => {
            cells = [
                { data: { threats: [{ status: 'Open' }] } },
                { data: { threats: [{ status: 'Mitigated' }] } },
                { data: { threats: [{ status: 'Mitigated' }, { status: 'Open' }] } },
            ];
            propsData = getData();
            propsData.diagram.cells = cells;
            propsData.showEmpty = false;
            propsData.showMitigated = false;
            setup(propsData);
            expect(wrapper.findAllComponents(TdReportEntity)).toHaveLength(2);
        });
    });
});

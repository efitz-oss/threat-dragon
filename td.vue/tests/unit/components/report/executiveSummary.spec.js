import { shallowMount } from '@vue/test-utils';
import { describe, it, expect, beforeEach, vi } from 'vitest';

import TdExecutiveSummary from '@/components/report/ExecutiveSummary.vue';

// Stubs for Bootstrap-Vue components
const BCardStub = {
    template:
        '<div class="card"><div class="card-header">{{ header }}</div><div class="card-body"><slot></slot></div></div>',
    props: ['header'],
};

const BTableStub = {
    template:
        '<table class="table"><tbody><tr v-for="(item, index) in items" :key="index"><td>{{ item.name }}</td><td>{{ item.value }}</td></tr></tbody></table>',
    props: ['items', 'fields'],
    methods: {
        getDataTestId(item) {
            return { 'data-test-id': item.name };
        },
    },
};

const BRowStub = {
    template: '<div class="row"><slot></slot></div>',
};

const BColStub = {
    template: '<div class="col"><slot></slot></div>',
};

describe('components/report/ExecutiveSummary.vue', () => {
    let propsData, wrapper;

    const getData = () => ({
        summary: 'some summary',
        threats: [
            { status: 'Open', severity: 'High' },
            { status: 'Open', severity: 'Medium' },
            { status: 'NotApplicable', severity: 'Low' },
            { status: 'Open', severity: 'Low' },
            { status: 'Open', severity: '' },
            { status: 'Mitigated', severity: '' },
        ],
    });

    const setup = (data) => {
        wrapper = shallowMount(TdExecutiveSummary, {
            props: {
                summary: data.summary,
                threats: data.threats,
            },
            global: {
                stubs: {
                    'b-card': BCardStub,
                    'b-table': BTableStub,
                    'b-row': BRowStub,
                    'b-col': BColStub,
                },
                mocks: {
                    $t: (t) => t,
                },
            },
        });
    };

    beforeEach(() => {
        propsData = getData();
        setup(propsData);
    });

    it('displays the executive summary title', () => {
        const summary = wrapper.find('.card-header');
        expect(summary.text()).toEqual('report.executiveSummary');
    });

    it('displays the description title', () => {
        expect(wrapper.find('.td-description-title').text()).toEqual('threatmodel.description');
    });

    it('displays the summary', () => {
        expect(wrapper.find('.td-summary').text()).toEqual(propsData.summary);
    });

    it('displays the report summary subtitle', () => {
        expect(wrapper.find('.td-report-summary').text()).toEqual('report.summary');
    });

    it('gets only the open threats', () => {
        expect(wrapper.vm.getOpenThreats()).toHaveLength(4);
    });

    it('counts the total threats', () => {
        expect(wrapper.vm.total).toEqual(6);
    });

    it('counts the mitigated threats', () => {
        expect(wrapper.vm.mitigated).toEqual(1);
    });

    it('counts the unmitigated threats', () => {
        expect(wrapper.vm.notMitigated).toEqual(5);
    });

    it('gets the data test id from the row item', () => {
        const item = { name: 'foo' };
        const res = wrapper.vm.getDataTestId(item);
        expect(res['data-test-id']).toEqual(item.name);
    });
});

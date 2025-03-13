import { shallowMount } from '@vue/test-utils';
import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock the threatmodel store
vi.mock('@/stores/threatmodel', () => ({
    useThreatmodelStore: vi.fn(() => ({
        title: 'Mock Title',
        summary: {
            title: 'Mock Title',
            owner: 'Mock Owner',
            reviewer: 'Mock Reviewer',
            contributors: ['Contributor1', 'Contributor2'],
        },
    })),
}));

import TdCoverSheet from '@/components/report/Coversheet.vue';
import TdThreatModelSummaryCard from '@/components/ThreatModelSummaryCard.vue';

describe('components/report/Coversheet.vue', () => {
    let summary, wrapper;

    const getSummary = () => ({
        title: 'My Awesome Model',
        owner: 'Bob',
        reviewer: 'Marley',
        contributors: ['Alice', 'Babs'],
        branding: true,
    });

    // Create stubs for Bootstrap-Vue components
    const BRowStub = {
        template: '<div class="row"><slot></slot></div>',
        props: ['class'],
    };

    const BColStub = {
        template: '<div class="col"><slot></slot></div>',
    };

    const setup = (data) => {
        wrapper = shallowMount(TdCoverSheet, {
            props: {
                title: data.title,
                owner: data.owner,
                reviewer: data.reviewer,
                contributors: data.contributors,
                branding: data.branding,
            },
            global: {
                stubs: {
                    'b-row': BRowStub,
                    'b-col': BColStub,
                },
                mocks: {
                    $t: (key) => key,
                },
            },
        });
    };

    describe('with branding', () => {
        beforeEach(() => {
            summary = getSummary();
            setup(summary);
        });

        it('displays the branding', () => {
            expect(wrapper.find('.td-brand-text').text()).toContain('OWASP Threat Dragon');
        });

        it('displays the summary card', () => {
            expect(wrapper.findComponent(TdThreatModelSummaryCard).exists()).toEqual(true);
        });
    });

    describe('without branding', () => {
        beforeEach(() => {
            summary = getSummary();
            summary.branding = false;
            setup(summary);
        });

        it('hides the brand text', () => {
            expect(wrapper.find('.td-brand-text').exists()).toEqual(false);
        });

        it('displays the summary card', () => {
            expect(wrapper.findComponent(TdThreatModelSummaryCard).exists()).toEqual(true);
        });
    });
});

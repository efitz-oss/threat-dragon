import { shallowMount } from '@vue/test-utils';
import { describe, it, expect, beforeEach, vi } from 'vitest';

import TdReportEntity from '@/components/printed-report/ReportEntity.vue';

// Mock the threat service
vi.mock('@/service/threats/index.js', () => ({
    default: {
        filterForDiagram: vi.fn((entity, options) => entity.threats || []),
    },
}));

describe('components/printed-report/ReportEntity.vue', () => {
    let propsData, wrapper;

    const getData = () => ({
        outOfScope: false,
        entity: {
            data: {
                name: 'Some threat',
                type: 'td.Actor',
                description: 'Some actor doing some things',
                threats: [
                    {
                        number: '1',
                        title: 't1',
                        severity: 'High',
                        score: '10',
                        status: 'Open',
                        type: 'type1',
                        description: 'Threat 1',
                        mitigation: 'We did things',
                    },
                    {
                        number: '2',
                        title: 't2',
                        severity: 'Medium',
                        score: '20',
                        status: 'Mitigated',
                        type: 'type2',
                        description: 'Threat 2',
                        mitigation: 'We did other things',
                    },
                ],
            },
        },
    });

    const setup = (data) => {
        wrapper = shallowMount(TdReportEntity, {
            global: {
                mocks: {
                    $t: (t) => t,
                },
            },
            props: {
                outOfScope: data.outOfScope,
                entity: data.entity,
            },
        });
    };

    beforeEach(() => {
        propsData = getData();
        setup(propsData);
    });

    const tableHasCellWithText = (expectedText) => {
        return (
            wrapper
                .findAll('td')
                .filter((td) => td.text().toLowerCase() === expectedText.toLowerCase()).length > 0
        );
    };

    describe('basic component rendering', () => {
        it('converts things to camel case', () => {
            expect(wrapper.vm.toCamelCase('FooBar')).toEqual('fooBar');
        });

        it('displays the name and data type', () => {
            expect(wrapper.find('.entity-title').text()).toEqual(
                `${propsData.entity.data.name} (threatmodel.shapes.actor)`
            );
        });

        it('displays the entity description', () => {
            expect(wrapper.find('.entity-description').text()).toContain(
                propsData.entity.data.description
            );
        });
    });

    describe('threat table rendering', () => {
        it('shows threat numbers', () => {
            expect(tableHasCellWithText('1')).toBe(true);
            expect(tableHasCellWithText('2')).toBe(true);
        });

        it('shows threat titles', () => {
            expect(tableHasCellWithText('t1')).toBe(true);
            expect(tableHasCellWithText('t2')).toBe(true);
        });

        it('shows threat severities', () => {
            expect(tableHasCellWithText('High')).toBe(true);
            expect(tableHasCellWithText('Medium')).toBe(true);
        });

        it('shows threat scores', () => {
            expect(tableHasCellWithText('10')).toBe(true);
            expect(tableHasCellWithText('20')).toBe(true);
        });

        it('shows threat statuses', () => {
            expect(tableHasCellWithText('Open')).toBe(true);
            expect(tableHasCellWithText('Mitigated')).toBe(true);
        });

        it('shows threat types', () => {
            expect(tableHasCellWithText('type1')).toBe(true);
            expect(tableHasCellWithText('type2')).toBe(true);
        });

        it('shows threat descriptions', () => {
            expect(tableHasCellWithText('Threat 1')).toBe(true);
            expect(tableHasCellWithText('Threat 2')).toBe(true);
        });

        it('shows threat mitigations', () => {
            expect(tableHasCellWithText('We did things')).toBe(true);
            expect(tableHasCellWithText('We did other things')).toBe(true);
        });
    });

    describe('when out of scope', () => {
        beforeEach(() => {
            propsData = getData();
            propsData.outOfScope = true;
            propsData.entity.data.reasonOutOfScope = 'Not applicable for this model';
            setup(propsData);
        });

        it('shows the out of scope indicator in the title', () => {
            expect(wrapper.find('.entity-title').text()).toContain(
                'threatmodel.properties.outOfScope'
            );
        });

        it('shows the reason out of scope', () => {
            const text = wrapper.findAll('.entity-description')[0].text();
            expect(text).toContain('threatmodel.properties.reasonOutOfScope');
            expect(text).toContain(propsData.entity.data.reasonOutOfScope);
        });
    });

    describe('when properties should be shown', () => {
        beforeEach(() => {
            propsData = getData();
            propsData.entity.data.bidirection = true;
            propsData.entity.data.isEncrypted = true;
            wrapper = shallowMount(TdReportEntity, {
                global: {
                    mocks: {
                        $t: (t) => t,
                    },
                },
                props: {
                    outOfScope: propsData.outOfScope,
                    entity: propsData.entity,
                    showProperties: true,
                },
            });
        });

        it('shows the properties section', () => {
            // Check properties are correctly computed
            expect(wrapper.vm.properties).toContain('threatmodel.properties.title');
            expect(wrapper.vm.properties).toContain('threatmodel.properties.bidirection');
            expect(wrapper.vm.properties).toContain('threatmodel.properties.isEncrypted');
        });
    });
});

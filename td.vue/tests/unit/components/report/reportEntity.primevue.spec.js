import { shallowMount } from '@vue/test-utils';
import { describe, it, expect, beforeEach, vi } from 'vitest';

import TdReportEntity from '@/components/report/ReportEntity.primevue.vue';

// Mock the threat service
vi.mock('@/service/threats/index.js', () => ({
    default: {
        filterForDiagram: vi.fn((entity, options) => entity.threats || []),
    },
}));

describe('components/report/ReportEntity.primevue.vue', () => {
    let propsData, wrapper;

    // PrimeVue stubs
    const DataTableStub = {
        name: 'DataTable',
        template: `
            <table :data-test-id="$attrs['data-test-id']" class="p-datatable">
                <tbody>
                    <tr v-for="(item, index) in value" :key="index">
                        <td v-for="(field, key) in item" :key="key">{{ item[key] }}</td>
                    </tr>
                </tbody>
            </table>
        `,
        props: {
            value: Array,
            stripedRows: Boolean,
            responsiveLayout: String,
        },
        inheritAttrs: false,
    };

    const ColumnStub = {
        name: 'Column',
        template: '<div></div>',
        props: ['field', 'header'],
    };

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
                stubs: {
                    DataTable: DataTableStub,
                    Column: ColumnStub,
                },
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

    describe('in scope', () => {
        beforeEach(() => {
            propsData = getData();
            setup(propsData);
        });

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

        it('has the correct columns setup', () => {
            expect(wrapper.vm.columns).toHaveLength(8);
            expect(wrapper.vm.columns[0].field).toBe('number');
            expect(wrapper.vm.columns[0].header).toBe('threats.properties.number');
        });

        it('properly formats the tableData', () => {
            expect(wrapper.vm.tableData).toHaveLength(2);
            expect(wrapper.vm.tableData[0].number).toBe('1');
            expect(wrapper.vm.tableData[0].title).toBe('t1');
        });
    });

    describe('out of scope', () => {
        beforeEach(() => {
            propsData = getData();
            propsData.outOfScope = true;
            propsData.entity.data.reasonOutOfScope = 'Not applicable for this model';
            setup(propsData);
        });

        it('displays the out of scope reason', () => {
            const text = wrapper.findAll('.entity-description')[0].text();
            expect(text).toContain('threatmodel.properties.reasonOutOfScope');
            expect(text).toContain(propsData.entity.data.reasonOutOfScope);
        });

        it('shows the out of scope label in the title', () => {
            expect(wrapper.find('.entity-title').text()).toContain(
                'threatmodel.properties.outOfScope'
            );
        });
    });

    describe('properties display', () => {
        beforeEach(() => {
            propsData = getData();
            propsData.entity.data.bidirection = true;
            propsData.entity.data.isEncrypted = true;
            setup({
                ...propsData,
                showProperties: true,
            });
        });

        it('displays the properties when showProperties is true', () => {
            wrapper = shallowMount(TdReportEntity, {
                global: {
                    stubs: {
                        DataTable: DataTableStub,
                        Column: ColumnStub,
                    },
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

            // Should have at least two entity-description elements
            expect(wrapper.findAll('.entity-description').length).toBeGreaterThan(1);

            // Check properties are correctly computed
            expect(wrapper.vm.properties).toContain('threatmodel.properties.title');
            expect(wrapper.vm.properties).toContain('threatmodel.properties.bidirection');
            expect(wrapper.vm.properties).toContain('threatmodel.properties.isEncrypted');
        });
    });
});

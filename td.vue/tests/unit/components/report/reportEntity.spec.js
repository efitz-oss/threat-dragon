import { mount } from '@vue/test-utils';
import { 
    BRow, BCol, BTableSimple, BThead, BTbody, BTr, BTh, BTd 
} from 'bootstrap-vue-next';
import TdReportEntity from '@/components/report/ReportEntity.vue';

describe('components/report/ReportEntity.vue', () => {
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
                        mitigation: 'We did things'
                    },
                    {
                        number: '2',
                        title: 't2',
                        severity: 'Medium',
                        score: '20',
                        status: 'Mitigated',
                        type: 'type2',
                        description: 'Threat 2',
                        mitigation: 'We did other things'
                    },
                ]
            }
        }
    });

    /**
     * Vue 3 Migration: Updated to use proper component stubs with templates
     * for bootstrap-vue-next components
     */
    const setup = (data) => {
        wrapper = mount(TdReportEntity, {
            global: {
                components: {
                    BRow, BCol, BTableSimple, BThead, BTbody, BTr, BTh, BTd
                },
                stubs: {
                    BRow: {
                        template: '<div class="b-row-stub"><slot /></div>'
                    },
                    BCol: {
                        template: '<div class="b-col-stub"><slot /></div>'
                    },
                    BTableSimple: {
                        template: '<table class="b-table-simple-stub"><slot /></table>'
                    },
                    BThead: {
                        template: '<thead class="b-thead-stub"><slot /></thead>'
                    },
                    BTbody: {
                        template: '<tbody class="b-tbody-stub"><slot /></tbody>'
                    },
                    BTr: {
                        template: '<tr class="b-tr-stub"><slot /></tr>'
                    },
                    BTh: {
                        template: '<th class="b-th-stub"><slot /></th>'
                    },
                    BTd: {
                        template: '<td class="b-td-stub"><slot /></td>'
                    }
                },
                mocks: {
                    $t: t => t
                }
            },
            props: {
                outOfScope: data.outOfScope,
                entity: data.entity
            }
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
            expect(wrapper.find('.entity-title').text())
                .toEqual(`${propsData.entity.data.name} (threatmodel.shapes.actor)`);
        });
    
        it('displays the entity description', () => {
            expect(wrapper.find('.entity-description').text())
                .toContain(propsData.entity.data.description);
        });
        
        it('has a table with the threats', () => {
            expect(wrapper.find('.b-table-simple-stub').exists())
                .toBe(true);
        });
    });

    describe('out of scope', () => {
        beforeEach(() => {
            propsData = getData();
            propsData.outOfScope = true;
            setup(propsData);
        });
        
        it('has a table with the threats', () => {
            expect(wrapper.find('.b-table-simple-stub').exists())
                .toBe(true);
        });
    });
});

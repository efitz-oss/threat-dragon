import { describe, it, expect, beforeEach, vi } from 'vitest';
import { shallowMount } from '@vue/test-utils';

import TdGraphThreats from '@/components/GraphThreats.vue';

describe('components/GraphThreats.vue', () => {
    let wrapper;

    const getDefaultPropsData = () => ({
        status: 'Open',
        severity: 'High',
        description: 'Some description',
        title: 'My terrifying threat',
        type: 'Information Disclosure',
        mitigation: 'we will mitigate it eventually',
        modelType: 'CIA',
        number: 42,
        id: 'asdf-asdf-asdf-asdf',
    });

    const getWrapper = (propsData) =>
        shallowMount(TdGraphThreats, {
            props: propsData,
            global: {
                stubs: {
                    'b-card': {
                        template: '<div class="card"><slot /></div>',
                    },
                    'b-card-text': {
                        template: '<div><slot /></div>',
                    },
                    'b-row': {
                        template: '<div class="row"><slot /></div>',
                    },
                    'b-col': {
                        template: '<div class="col"><slot /></div>',
                    },
                    'b-badge': {
                        template: '<span class="badge"><slot /></span>',
                    },
                    'font-awesome-icon': {
                        template:
                            '<i :class="getIconClasses()" :data-icon="icon" :data-title="title"></i>',
                        props: ['icon', 'title', 'class'],
                        methods: {
                            getIconClasses() {
                                return [this.class, 'icon-stub'];
                            },
                        },
                    },
                },
                mocks: {
                    $t: (key) => key,
                },
            },
        });

    describe('props', () => {
        it('has the status prop', () => {
            expect(TdGraphThreats.props.status).toBeDefined();
        });

        it('has the severity prop', () => {
            expect(TdGraphThreats.props.severity).toBeDefined();
        });

        it('has the description prop', () => {
            expect(TdGraphThreats.props.description).toBeDefined();
        });

        it('has the title prop', () => {
            expect(TdGraphThreats.props.title).toBeDefined();
        });

        it('has the type prop', () => {
            expect(TdGraphThreats.props.type).toBeDefined();
        });

        it('has the mitigation prop', () => {
            expect(TdGraphThreats.props.mitigation).toBeDefined();
        });

        it('has the model type', () => {
            expect(TdGraphThreats.props.modelType).toBeDefined();
        });
    });

    describe('icons', () => {
        it('displays a red exclamation triangle for open', () => {
            const propsData = getDefaultPropsData();
            wrapper = getWrapper(propsData);
            const icon = wrapper.find('i[data-icon="exclamation-triangle"][class*="red-icon"]');
            expect(icon.exists()).toBe(true);
        });

        it('displays a green check for mitigated', () => {
            const propsData = getDefaultPropsData();
            propsData.status = 'Mitigated';
            wrapper = getWrapper(propsData);
            const icon = wrapper.find('i[data-icon="check"][class*="green-icon"]');
            expect(icon.exists()).toBe(true);
        });

        it('displays a green check for not applicable', () => {
            const propsData = getDefaultPropsData();
            propsData.status = 'NotApplicable';
            wrapper = getWrapper(propsData);
            const icon = wrapper.find('i[data-icon="check"][class*="green-icon"]');
            expect(icon.exists()).toBe(true);
        });

        it('displays a red circle for high severity', () => {
            const propsData = getDefaultPropsData();
            propsData.severity = 'High';
            wrapper = getWrapper(propsData);
            const icon = wrapper.find('i[data-icon="circle"][class*="red-icon"]');
            expect(icon.exists()).toBe(true);
        });

        it('displays a yellow circle for medium severity', () => {
            const propsData = getDefaultPropsData();
            propsData.severity = 'Medium';
            wrapper = getWrapper(propsData);
            const icon = wrapper.find('i[data-icon="circle"][class*="yellow-icon"]');
            expect(icon.exists()).toBe(true);
        });

        it('displays a green circle for low severity', () => {
            const propsData = getDefaultPropsData();
            propsData.severity = 'Low';
            wrapper = getWrapper(propsData);
            const icon = wrapper.find('i[data-icon="circle"][class*="green-icon"]');
            expect(icon.exists()).toBe(true);
        });
    });

    describe('threat info', () => {
        let propsData;
        beforeEach(() => {
            propsData = getDefaultPropsData();
            wrapper = getWrapper(propsData);
        });

        it('has a link for the threat title', () => {
            expect(wrapper.find('a').text()).toEqual('#42 My terrifying threat');
        });

        it('displays the type', () => {
            expect(wrapper.find('.card').text()).toContain(propsData.type);
        });

        it('displays the model type', () => {
            expect(wrapper.find('.badge').text()).toEqual('CIA');
        });
    });

    describe('threat selected', () => {
        let propsData;
        beforeEach(async () => {
            propsData = getDefaultPropsData();
            wrapper = getWrapper(propsData);
            await wrapper.find('a').trigger('click');
        });

        it('emits the threatSelected event with the threat id', () => {
            expect(wrapper.emitted('threatSelected')).toBeTruthy();
            expect(wrapper.emitted('threatSelected')[0]).toEqual([propsData.id, 'old']);
        });
    });
});

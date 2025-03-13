import { describe, it, expect, beforeEach, vi } from 'vitest';
import { shallowMount } from '@vue/test-utils';

// Mock cell store
vi.mock('@/stores/cell', () => ({
    useCellStore: vi.fn(),
}));

import { useCellStore } from '@/stores/cell';
import dataChanged from '@/service/x6/graph/data-changed.js';
import TdGraphProperties from '@/components/GraphProperties.vue';

vi.mock('@/service/x6/graph/data-changed.js', () => ({
    default: {
        updateName: vi.fn(),
        updateProperties: vi.fn(),
        updateStyleAttrs: vi.fn(),
    },
}));

describe('components/GraphProperties.vue', () => {
    let wrapper;

    describe('emptyState', () => {
        beforeEach(() => {
            // Mock the store to return null for cellRef
            useCellStore.mockReturnValue({
                cellRef: null,
            });

            wrapper = shallowMount(TdGraphProperties, {
                global: {
                    stubs: {
                        'b-row': {
                            template: '<div class="row"><slot /></div>',
                        },
                        'b-col': {
                            template: '<div class="col"><slot /></div>',
                        },
                        'b-form': {
                            template: '<div class="form"><slot /></div>',
                        },
                        'b-form-row': {
                            template: '<div class="form-row"><slot /></div>',
                        },
                        'b-form-group': {
                            template:
                                '<div :id="id" class="form-group"><label v-if="label">{{ label }}</label><slot /></div>',
                            props: ['id', 'label', 'labelFor', 'labelCols'],
                        },
                        'b-form-textarea': {
                            template:
                                '<textarea :id="id" class="form-textarea" v-model="internalValue" @input="$emit(\'update\')"></textarea>',
                            props: ['id', 'modelValue', 'rows', 'disabled'],
                            data() {
                                return {
                                    internalValue: this.modelValue,
                                };
                            },
                            emits: ['update'],
                        },
                        'b-form-checkbox': {
                            template:
                                '<div class="form-check"><input type="checkbox" :id="id" :checked="modelValue" @change="$emit(\'change\')" /></div>',
                            props: ['id', 'modelValue'],
                            emits: ['change'],
                        },
                        'b-form-input': {
                            template:
                                '<input :id="id" class="form-input" :type="type" v-model="internalValue" @change="$emit(\'change\')" />',
                            props: ['id', 'modelValue', 'type'],
                            data() {
                                return {
                                    internalValue: this.modelValue,
                                };
                            },
                            emits: ['change'],
                        },
                    },
                    mocks: {
                        $t: (key) => key,
                    },
                },
            });
        });

        it('displays the empty state message', () => {
            expect(wrapper.find('p').text()).toContain('threatmodel.properties.emptyState');
        });
    });

    describe('with flow data', () => {
        let entityData;

        beforeEach(() => {
            entityData = {
                type: 'tm.Flow',
                name: 'some flow',
                description: 'describing the thing',
                outOfScope: true,
                isBidirectional: true,
                reasonOutOfScope: 'someone thought so',
            };

            // Mock the store to return data for cellRef
            useCellStore.mockReturnValue({
                cellRef: {
                    data: entityData,
                },
            });

            wrapper = shallowMount(TdGraphProperties, {
                global: {
                    stubs: {
                        'b-row': {
                            template: '<div class="row"><slot /></div>',
                        },
                        'b-col': {
                            template: '<div class="col"><slot /></div>',
                        },
                        'b-form': {
                            template: '<div class="form"><slot /></div>',
                        },
                        'b-form-row': {
                            template: '<div class="form-row"><slot /></div>',
                        },
                        'b-form-group': {
                            template:
                                '<div :id="id" class="form-group"><label v-if="label">{{ label }}</label><slot /></div>',
                            props: ['id', 'label', 'labelFor', 'labelCols'],
                        },
                        'b-form-textarea': {
                            template:
                                '<textarea :id="id" class="form-textarea" v-model="internalValue" @input="$emit(\'update\')"></textarea>',
                            props: ['id', 'modelValue', 'rows', 'disabled'],
                            data() {
                                return {
                                    internalValue: this.modelValue,
                                };
                            },
                            emits: ['update', 'change'],
                        },
                        'b-form-checkbox': {
                            template:
                                '<div class="form-check"><input type="checkbox" :id="id" :checked="modelValue" @change="$emit(\'change\')" /></div>',
                            props: ['id', 'modelValue'],
                            emits: ['change'],
                        },
                        'b-form-input': {
                            template:
                                '<input :id="id" class="form-input" :type="type" v-model="internalValue" @change="$emit(\'change\')" />',
                            props: ['id', 'modelValue', 'type'],
                            data() {
                                return {
                                    internalValue: this.modelValue,
                                };
                            },
                            emits: ['change'],
                        },
                    },
                    mocks: {
                        $t: (key) => key,
                    },
                },
            });
        });

        it('shows name form group', () => {
            const formGroup = wrapper.find('#name-group');
            expect(formGroup.exists()).toBe(true);
        });

        it('shows description form group', () => {
            const formGroup = wrapper.find('#description-group');
            expect(formGroup.exists()).toBe(true);
        });

        it('shows outOfScope checkbox group', () => {
            const formGroup = wrapper.find('#flowoutofscope-group');
            expect(formGroup.exists()).toBe(true);
        });

        it('shows the bidirectional checkbox', () => {
            const bidirectionalGroup = wrapper.find('#flowoutofscope-group');
            expect(bidirectionalGroup.exists()).toBe(true);
        });

        it('shows reasonOutOfScope textarea', () => {
            const reasonGroup = wrapper.find('#reasonoutofscope-group');
            expect(reasonGroup.exists()).toBe(true);
        });
    });

    describe('event handlers', () => {
        let cellRef;

        beforeEach(() => {
            cellRef = {
                data: {
                    type: 'tm.Flow',
                    name: 'some flow',
                    description: 'describing the thing',
                    outOfScope: true,
                    isBidirectional: true,
                    reasonOutOfScope: 'someone thought so',
                },
            };

            // Mock the store to return data for cellRef
            useCellStore.mockReturnValue({
                cellRef,
            });

            // Mock document.getElementById
            global.document.getElementById = vi.fn().mockReturnValue({
                disabled: false,
            });

            wrapper = shallowMount(TdGraphProperties, {
                global: {
                    stubs: {
                        'b-row': {
                            template: '<div class="row"><slot /></div>',
                        },
                        'b-col': {
                            template: '<div class="col"><slot /></div>',
                        },
                        'b-form': {
                            template: '<div class="form"><slot /></div>',
                        },
                        'b-form-row': {
                            template: '<div class="form-row"><slot /></div>',
                        },
                        'b-form-group': {
                            template:
                                '<div :id="id" class="form-group"><label v-if="label">{{ label }}</label><slot /></div>',
                            props: ['id', 'label', 'labelFor', 'labelCols'],
                        },
                        'b-form-textarea': {
                            template:
                                '<textarea :id="id" class="form-textarea" v-model="internalValue" @update="$emit(\'update\')" @change="$emit(\'change\')"></textarea>',
                            props: ['id', 'modelValue', 'rows', 'disabled'],
                            data() {
                                return {
                                    internalValue: this.modelValue,
                                };
                            },
                            emits: ['update', 'change'],
                        },
                        'b-form-checkbox': {
                            template:
                                '<div class="form-check"><input type="checkbox" :id="id" :checked="modelValue" @change="$emit(\'change\')" /></div>',
                            props: ['id', 'modelValue'],
                            emits: ['change'],
                        },
                        'b-form-input': {
                            template:
                                '<input :id="id" class="form-input" :type="type" v-model="internalValue" @change="$emit(\'change\')" />',
                            props: ['id', 'modelValue', 'type'],
                            data() {
                                return {
                                    internalValue: this.modelValue,
                                };
                            },
                            emits: ['change'],
                        },
                    },
                    mocks: {
                        $t: (key) => key,
                    },
                },
            });
        });

        it('calls updateName for name change', async () => {
            await wrapper.vm.onChangeName();
            expect(dataChanged.updateName).toHaveBeenCalledWith(cellRef);
        });

        it('calls updateProperties and updateStyleAttrs for bidirection change', async () => {
            await wrapper.vm.onChangeBidirection();
            expect(dataChanged.updateProperties).toHaveBeenCalledWith(cellRef);
            expect(dataChanged.updateStyleAttrs).toHaveBeenCalledWith(cellRef);
        });

        it('calls updateProperties for property changes', async () => {
            await wrapper.vm.onChangeProperties();
            expect(dataChanged.updateProperties).toHaveBeenCalledWith(cellRef);
        });

        it('calls updateProperties and updateStyleAttrs for scope changes', async () => {
            await wrapper.vm.onChangeScope();
            expect(dataChanged.updateProperties).toHaveBeenCalledWith(cellRef);
            expect(dataChanged.updateStyleAttrs).toHaveBeenCalledWith(cellRef);
        });
    });
});

import { mount } from '@vue/test-utils';
import { createStore } from 'vuex';
import { nextTick } from 'vue';

import NewThreatModel from '@/views/NewThreatModel.vue';
import { THREATMODEL_CLEAR, THREATMODEL_SELECTED, THREATMODEL_UPDATE, THREATMODEL_NOT_MODIFIED } from '@/store/actions/threatmodel.js';

describe('NewThreatModel.vue', () => {
    let wrapper, mockStore, router;

    describe('local provider', () => {
        beforeEach(async () => {
            router = { push: jest.fn() };
            
            // We need to explicitly mock the dispatch method to verify calls
            const dispatchMock = jest.fn();
            
            // Create store 
            mockStore = createStore({
                state: {
                    provider: { selected: 'local' }
                },
                actions: {
                    [THREATMODEL_CLEAR]: jest.fn(),
                    [THREATMODEL_SELECTED]: jest.fn(),
                    [THREATMODEL_UPDATE]: jest.fn(),
                    [THREATMODEL_NOT_MODIFIED]: jest.fn()
                }
            });
            
            // Replace the dispatch with our mock
            mockStore.dispatch = dispatchMock;
            
            // Create wrapper using direct mount for simplicity
            // This might be cleaner until we solve potential issues with createWrapper
            wrapper = mount(NewThreatModel, {
                global: {
                    plugins: [mockStore],
                    mocks: {
                        $router: router,
                        $route: {
                            params: { foo: 'bar' }
                        }
                    },
                    stubs: {
                        transition: false,
                        'router-view': true
                    }
                }
            });
            
            // Wait for component to initialize
            await nextTick();
        });

        it('clears the current threat model', () => {
            expect(mockStore.dispatch).toHaveBeenCalledWith(THREATMODEL_CLEAR);
        });

        it('selects the new threatModel', () => {
            expect(mockStore.dispatch).toHaveBeenCalledWith(THREATMODEL_SELECTED, expect.anything());
        });

        it('navigates to the edit page', () => {
            expect(router.push).toHaveBeenCalledWith({
                name: 'localThreatModelEdit',
                params: {
                    foo: 'bar',
                    threatmodel: 'New Threat Model'
                }
            });
        });
    });

    describe('git provider', () => {
        beforeEach(async () => {
            router = { push: jest.fn() };
            
            // We need to explicitly mock the dispatch method to verify calls
            const dispatchMock = jest.fn();
            
            // Create store 
            mockStore = createStore({
                state: {
                    provider: { selected: 'github' }
                },
                actions: {
                    [THREATMODEL_CLEAR]: jest.fn(),
                    [THREATMODEL_SELECTED]: jest.fn(),
                    [THREATMODEL_UPDATE]: jest.fn(),
                    [THREATMODEL_NOT_MODIFIED]: jest.fn()
                }
            });
            
            // Replace the dispatch with our mock
            mockStore.dispatch = dispatchMock;
            
            // Create wrapper using direct mount for simplicity
            wrapper = mount(NewThreatModel, {
                global: {
                    plugins: [mockStore],
                    mocks: {
                        $router: router,
                        $route: {
                            params: { foo: 'bar' }
                        }
                    },
                    stubs: {
                        transition: false,
                        'router-view': true
                    }
                }
            });
            
            // Wait for component to initialize
            await nextTick();
        });

        it('clears the current threat model', () => {
            expect(mockStore.dispatch).toHaveBeenCalledWith(THREATMODEL_CLEAR);
        });

        it('selects the new threatModel', () => {
            expect(mockStore.dispatch).toHaveBeenCalledWith(THREATMODEL_SELECTED, expect.anything());
        });

        it('navigates to the edit page for creation', () => {
            expect(router.push).toHaveBeenCalledWith({
                name: 'gitThreatModelCreate',
                params: {
                    foo: 'bar',
                    threatmodel: 'New Threat Model'
                }
            });
        });
    });
});

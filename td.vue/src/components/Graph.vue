<template>
    <div class="diagram-editor">
        <b-row class="main-content-row">
            <b-col
                md="3"
                lg="2"
                xl="2"
                class="stencil-column">
                <div ref="stencil_container" class="stencil-container td-stencil-theme" />
            </b-col>
            <b-col
                md="9"
                lg="10"
                xl="10"
                class="content-column">
                <b-row class="header-row">
                    <b-col>
                        <h3 class="td-graph-title">
                            {{ diagram.title }}
                        </h3>
                    </b-col>
                    <b-col align="right">
                        <td-graph-buttons :graph="graph" @saved="saved" @closed="closed" />
                    </b-col>
                </b-row>
                <b-row class="graph-row">
                    <b-col>
                        <div
                            id="graph-container"
                            ref="graph_container"
                            class="graph-container"
                        />
                    </b-col>
                </b-row>
            </b-col>
        </b-row>
        <td-graph-meta @threat-selected="threatSelected" @threat-suggest="threatSuggest" />

        <div>
            <td-keyboard-shortcuts />
            <td-threat-edit-dialog ref="threatEditDialog" />
            <td-threat-suggest-dialog ref="threatSuggestDialog" />
        </div>
    </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useStore } from 'vuex';
import { useI18n } from '@/i18n';

import TdGraphButtons from '@/components/GraphButtons.vue';
import TdGraphMeta from '@/components/GraphMeta.vue';
import TdKeyboardShortcuts from '@/components/KeyboardShortcuts.vue';
import TdThreatEditDialog from '@/components/ThreatEditDialog.vue';
import TdThreatSuggestDialog from './ThreatSuggestDialog.vue';

import { getProviderType } from '@/service/provider/providers.js';
import diagramService from '@/service/migration/diagram.js';
import stencil from '@/service/x6/stencil.js';
import tmActions from '@/store/actions/threatmodel.js';

// Stencil theme is loaded via link tag in public/index.html

export default {
    name: 'TdGraph',
    components: {
        TdGraphButtons,
        TdGraphMeta,
        TdKeyboardShortcuts,
        TdThreatEditDialog,
        TdThreatSuggestDialog
    },
    setup() {
        const store = useStore();
        // Fix for test compatibility
        let t = () => '';
        try {
            const i18n = useI18n(); // Initialize i18n in setup function
            if (i18n && i18n.t) {
                t = i18n.t;
            }
        } catch (error) {
            console.warn('i18n not available in setup, using default:', error);
        }
        const graph = ref(null);
        const stencilInstance = ref(null);
        const graphContainer = ref(null);
        const stencilContainer = ref(null);
        const threatEditDialog = ref(null);
        const threatSuggestDialog = ref(null);
        
        // Computed state
        const diagram = computed(() => store.state.threatmodel.selectedDiagram);
        const providerType = computed(() => getProviderType(store.state.provider.selected));
        
        // Initialize the graph
        const init = () => {
            graph.value = diagramService.edit(graphContainer.value, diagram.value);
            stencilInstance.value = stencil.get(graph.value, stencilContainer.value);
            store.dispatch(tmActions.notModified);
            
            // Listen for graph changes
            graph.value.getPlugin('history').on('change', () => {
                const updated = Object.assign({}, diagram.value);
                updated.cells = graph.value.toJSON().cells;
                store.dispatch(tmActions.diagramModified, updated);
            });
        };
        
        // Event handlers
        const threatSelected = (threatId, state) => {
            if (threatEditDialog.value) {
                // Use the new public showDialog method
                threatEditDialog.value.showDialog(threatId, state);
            }
        };
        
        const threatSuggest = (type) => {
            if (threatSuggestDialog.value) {
                threatSuggestDialog.value.showModal(type);
            }
        };
        
        const saved = () => {
            console.debug('Save diagram');
            const updated = Object.assign({}, diagram.value);
            updated.cells = graph.value.toJSON().cells;
            store.dispatch(tmActions.diagramSaved, updated);
            store.dispatch(tmActions.saveModel);
        };
        
        const getConfirmModal = async () => {
            try {
                // Use the modal helper with t function from setup scope
                const { showConfirmDialog } = await import('@/utils/modal-helper.js');
                
                return await showConfirmDialog(null, {
                    title: t('forms.discardTitle'),
                    message: t('forms.discardMessage'),
                    okTitle: t('forms.ok'),
                    cancelTitle: t('forms.cancel'),
                    okVariant: 'danger',
                    hideHeaderClose: true,
                    centered: true
                });
            } catch (error) {
                console.error('Error showing confirm modal:', error);
                return false;
            }
        };
        
        const closed = async () => {
            // Check if the model was modified
            if (!store.getters.modelChanged || (await getConfirmModal())) {
                await store.dispatch(tmActions.diagramClosed);
                
                // Use setTimeout to ensure state is updated before navigation
                setTimeout(() => {
                    // Get router and route from the global app instance
                    const router = window._vueApp?.$router;
                    const route = window._vueApp?.$route;
                    
                    if (router && route) {
                        console.debug(`Closing diagram with provider: ${providerType.value}`);
                        const routeParams = { ...route.params };
                        
                        // Remove diagram param as we're going back to the model view
                        if ('diagram' in routeParams) {
                            delete routeParams.diagram;
                        }
                        
                        // Special handling for local provider
                        if (providerType.value === 'local') {
                            console.debug('Using local route structure for diagram close');
                            router.push({
                                name: 'localThreatModel',
                                params: {
                                    threatmodel: routeParams.threatmodel
                                },
                                replace: true
                            });
                            return;
                        }
                        
                        // Provider-specific validation
                        if (providerType.value === 'google' && !routeParams.folder) {
                            console.error('Missing folder parameter for Google Drive route');
                            if (store.state.folder && store.state.folder.selected) {
                                routeParams.folder = store.state.folder.selected;
                            } else {
                                router.push({ name: 'googleFolder' });
                                return;
                            }
                        } else if (providerType.value === 'git' && 
                                  (!routeParams.repository || !routeParams.branch)) {
                            console.error('Missing required Git parameters');
                            router.push({ name: 'MainDashboard' });
                            return;
                        }
                        
                        console.debug(`Navigating to ${providerType.value}ThreatModel with params:`, routeParams);
                        router.push({
                            name: `${providerType.value}ThreatModel`,
                            params: routeParams,
                            replace: true
                        });
                    } else {
                        console.error('Unable to access router in Composition API context');
                    }
                }, 0);
            }
        };
        
        // Lifecycle hooks
        onMounted(() => {
            init();
            
            // Force stencil redraw after initialization
            setTimeout(() => {
                if (graph.value && stencilContainer.value) {
                    console.debug('Forcing stencil redraw');
                    const container = stencilContainer.value;
                    const width = container.offsetWidth;
                    // Trigger a resize event to force redraw
                    window.dispatchEvent(new Event('resize'));
                    // Also force a redraw of the stencil
                    if (stencilInstance.value && typeof stencilInstance.value.resize === 'function') {
                        stencilInstance.value.resize(width);
                    }
                }
            }, 100); // Short delay to ensure component is fully mounted
        });
        
        onUnmounted(() => {
            // Dispose stencil instance if it exists
            if (stencilInstance.value && typeof stencilInstance.value.dispose === 'function') {
                stencilInstance.value.dispose();
            }
            diagramService.dispose(graph.value);
        });
        
        return {
            // Refs
            graph,
            graph_container: graphContainer,
            stencil_container: stencilContainer,
            threatEditDialog,
            threatSuggestDialog,
            
            // Computed state
            diagram,
            providerType,
            
            // Methods
            threatSelected,
            threatSuggest,
            saved,
            closed,
            
            // i18n
            t
        };
    }
};
</script>

<style lang="scss" scoped>
    .diagram-editor {
        display: flex;
        flex-direction: column;
        height: calc(100vh - 120px);
    }
    
    .td-graph-title {
        margin-right: 15px;
    }
    
    .main-content-row {
        flex: 1;
        height: 100%;
        overflow: hidden;
    }
    
    .stencil-column {
        height: 100%;
        padding: 0;
        border-right: 1px solid #eee;
    }
    
    .stencil-container {
        height: 100%;
        width: 100%;
        overflow-y: auto;
        position: relative;
    }
    
    .content-column {
        height: 100%;
        display: flex;
        flex-direction: column;
        min-width: 800px; /* Ensure minimum width for the graph area */
    }
    
    .header-row {
        padding: 8px;
    }
    
    .graph-row {
        flex: 1;
        overflow: hidden;
    }
    
    .graph-container {
        height: 100%;
        width: 100%;
    }
    
    /* Make the SVG viewport take up more space */
    :deep(.x6-graph-svg-viewport) {
        width: 100% !important;
        height: 100% !important;
    }
    
    /* Style the X6 graph container to fit within its parent */
    :deep(.x6-graph-svg-viewport) {
        width: 100%;
        height: 100%;
    }
</style>
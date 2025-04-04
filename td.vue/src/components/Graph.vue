<template>
    <div class="diagram-editor">
        <b-row class="main-content-row">
            <b-col md="2" lg="2" class="stencil-column">
                <div ref="stencil_container" class="stencil-container" />
            </b-col>
            <b-col md="10" lg="10" class="content-column">
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
import { mapState } from 'vuex';

import TdGraphButtons from '@/components/GraphButtons.vue';
import TdGraphMeta from '@/components/GraphMeta.vue';
import TdKeyboardShortcuts from '@/components/KeyboardShortcuts.vue';
import TdThreatEditDialog from '@/components/ThreatEditDialog.vue';
import TdThreatSuggestDialog from './ThreatSuggestDialog.vue';

import { getProviderType } from '@/service/provider/providers.js';
import diagramService from '@/service/migration/diagram.js';
import stencil from '@/service/x6/stencil.js';
import tmActions from '@/store/actions/threatmodel.js';
import '@/service/x6/stencil.scss'; // Import dedicated stencil stylesheet

export default {
    name: 'TdGraph',
    components: {
        TdGraphButtons,
        TdGraphMeta,
        TdKeyboardShortcuts,
        TdThreatEditDialog,
        TdThreatSuggestDialog
    },
    data() {
        return {
            graph: null,
            stencilInstance: null
        };
    },
    computed: mapState({
        diagram: (state) => state.threatmodel.selectedDiagram,
        providerType: (state) => getProviderType(state.provider.selected)
    }),
    async mounted() {
        this.init();
    },
    unmounted() {
        // Dispose of the stencil instance if it exists
        if (this.stencilInstance && this.stencilInstance.dispose) {
            this.stencilInstance.dispose();
        }
        
        // Dispose of the graph
        diagramService.dispose(this.graph);
    },
    methods: {
        init() {
            this.graph = diagramService.edit(this.$refs.graph_container, this.diagram);
            this.stencilInstance = stencil.get(this.graph, this.$refs.stencil_container);
            this.$store.dispatch(tmActions.notModified);
            this.graph.getPlugin('history').on('change', () => {
                const updated = Object.assign({}, this.diagram);
                updated.cells = this.graph.toJSON().cells;
                this.$store.dispatch(tmActions.diagramModified, updated);
            });
        },
        threatSelected(threatId, state) {
            this.$refs.threatEditDialog.editThreat(threatId, state);
        },
        threatSuggest(type) {
            this.$refs.threatSuggestDialog.showModal(type);
        },
        saved() {
            console.debug('Save diagram');
            const updated = Object.assign({}, this.diagram);
            updated.cells = this.graph.toJSON().cells;
            this.$store.dispatch(tmActions.diagramSaved, updated);
            this.$store.dispatch(tmActions.saveModel);
        },
        async closed() {
            if (!this.$store.getters.modelChanged || (await this.getConfirmModal())) {
                await this.$store.dispatch(tmActions.diagramClosed);
                
                // Create a clean copy of params without any diagram parameter
                const cleanParams = { ...this.$route.params };
                if ('diagram' in cleanParams) {
                    delete cleanParams.diagram;
                }
                
                this.$router.push({
                    name: `${this.providerType}ThreatModel`,
                    params: cleanParams
                });
            }
        },
        getConfirmModal() {
            // Import the showConfirmDialog function directly here to avoid circular dependencies
            return import('@/utils/modal-helper.js').then(({ showConfirmDialog }) => {
                return showConfirmDialog(this, {
                    title: this.$t('forms.discardTitle'),
                    message: this.$t('forms.discardMessage'),
                    okTitle: this.$t('forms.ok'),
                    cancelTitle: this.$t('forms.cancel'),
                    okVariant: 'danger',
                    hideHeaderClose: true,
                    centered: true
                });
            });
        }
    }
};
</script>

<style lang="scss" scoped>
    /* Stencil dimension variables for easier configuration */
    :root {
        --stencil-container-min-width: 200px;
        --stencil-graph-width-percentage: 95%;
        --stencil-item-width-percentage: 95%;
        --stencil-item-margin: 5px;
        --stencil-item-padding: 5px 0;
    }
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
        min-width: var(--stencil-container-min-width); /* Using CSS variable */
    }
    
    .stencil-container {
        height: 100%;
        width: 100%;
        overflow-y: auto;
        position: relative;
    }
    
    /* Ensure stencil elements are visible */
    .stencil-container :deep(.x6-widget-stencil) {
        width: 100% !important;
        max-width: 100% !important;
        min-width: 180px !important; /* Minimum width to prevent text wrapping */
        visibility: visible !important;
        display: block !important;
        overflow: visible !important;
    }
    
    .stencil-container :deep(.x6-widget-stencil-group) {
        visibility: visible !important;
        display: block !important;
        height: auto !important;
        min-height: 100px !important;
        width: 100% !important;
    }
    
    .stencil-container :deep(.x6-widget-stencil-group-content) {
        visibility: visible !important;
        display: block !important;
        opacity: 1 !important;
        min-height: 100px !important;
        height: auto !important;
        overflow: visible !important;
        width: 100% !important;
    }
    
    /* Apply correct width to the stencil content container */
    .stencil-container :deep(.x6-widget-stencil-content) {
        width: 100% !important;
        overflow: visible !important;
    }
    
    /* Scale stencil items to fit container */
    .stencil-container :deep(.x6-widget-stencil-item) {
        width: 100% !important;
        display: flex !important;
        justify-content: center !important;
        align-items: center !important;
        padding: var(--stencil-item-padding) !important;
        margin: var(--stencil-item-margin) auto !important;
    }
    
    /* Scale SVG containers in stencil items */
    .stencil-container :deep(.x6-graph) {
        width: var(--stencil-graph-width-percentage) !important;
        margin: 0 auto !important;
        max-width: none !important; /* Remove max-width constraint */
    }
    
    .stencil-container :deep(.x6-widget-stencil-group-title) {
        visibility: visible !important;
        display: block !important;
        font-weight: bold;
        padding: 8px;
        background-color: #f8f9fa;
        border-bottom: 1px solid #eee;
        white-space: nowrap !important; /* Prevent text wrapping */
        overflow: hidden !important;
        text-overflow: ellipsis !important;
        width: 100% !important;
    }
    
    /* Force node visibility and set width */
    .stencil-container :deep(.x6-node) {
        visibility: visible !important;
        display: block !important;
        opacity: 1 !important;
        /* Scale shapes to fit container width */
        transform-origin: center center !important;
        transform: scale(1) !important;
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
    
    /* Style the X6 stencil container to fit within its parent */
    :deep(.x6-widget-stencil) {
        width: 100% !important;
    }
    
    /* Fix for stencil search width */
    :deep(.x6-widget-stencil-search) {
        width: 90% !important;
        margin: 8px auto !important;
        visibility: visible !important;
        display: block !important;
    }
    
    /* Make stencil search input full width */
    :deep(.x6-widget-stencil-search input) {
        width: 100% !important;
    }
    
    /* Ensure stencil items are visible in all browsers */
    :deep(.x6-widget-stencil-item) {
        visibility: visible !important;
        display: block !important;
        opacity: 1 !important;
    }
</style>
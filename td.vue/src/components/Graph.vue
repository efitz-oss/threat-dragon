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
        
        // Force stencil redraw after initialization
        setTimeout(() => {
            if (this.graph && this.$refs.stencil_container) {
                console.debug('Forcing stencil redraw');
                const container = this.$refs.stencil_container;
                const width = container.offsetWidth;
                // Trigger a resize event to force redraw
                window.dispatchEvent(new Event('resize'));
                // Also force a redraw of the stencil
                if (this.stencilInstance && typeof this.stencilInstance.resize === 'function') {
                    this.stencilInstance.resize(width);
                }
            }
        }, 100); // Short delay to ensure component is fully mounted
    },
    unmounted() {
        // Dispose stencil instance if it exists
        if (this.stencilInstance && typeof this.stencilInstance.dispose === 'function') {
            this.stencilInstance.dispose();
        }
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
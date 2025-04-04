<template>
    <div class="diagram-editor">
        <!-- Top row for title and controls -->
        <b-row class="header-row mb-3">
            <b-col md="6">
                <h3 class="td-graph-title">
                    {{ diagram.title }}
                </h3>
            </b-col>
            <b-col md="6" class="text-right">
                <td-graph-buttons :graph="graph" @saved="saved" @closed="closed" />
            </b-col>
        </b-row>
        
        <!-- Main content row with stencil and graph -->
        <b-row class="main-content-row">
            <b-col md="2" class="stencil-column">
                <div ref="stencil_container" class="stencil-container" />
            </b-col>
            <b-col md="10" class="graph-column">
                <div
                    id="graph-container"
                    ref="graph_container"
                    class="graph-container"
                />
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
            graph: null
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
        diagramService.dispose(this.graph);
    },
    methods: {
        init() {
            this.graph = diagramService.edit(this.$refs.graph_container, this.diagram);
            stencil.get(this.graph, this.$refs.stencil_container);
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
    
    .header-row {
        padding: 8px 16px;
        border-bottom: 1px solid #eee;
        align-items: center;
        min-height: 60px;
    }
    
    .td-graph-title {
        margin: 0;
        font-size: 1.5rem;
    }
    
    .main-content-row {
        flex: 1;
        overflow: hidden;
    }
    
    .stencil-column {
        padding-top: 10px;
        border-right: 1px solid #eee;
        height: 100%;
    }
    
    .stencil-container {
        height: 100%;
        width: 100%;
        overflow-y: auto;
        
        /* Fix for stencil search width */
        :deep(.x6-widget-stencil-search) {
            width: 90% !important;
            max-width: 180px !important;
            margin: 8px auto !important;
        }
    }
    
    .graph-column {
        padding: 0;
        height: 100%;
    }
    
    .graph-container {
        height: 100%;
        width: 100%;
    }
</style>
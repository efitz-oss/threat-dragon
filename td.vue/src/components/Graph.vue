<template>
    <div class="diagram-editor">
        <b-row>
            <b-col cols="12">
                <b-row class="header-row">
                    <b-col md="6">
                        <h3 class="td-graph-title">
                            {{ diagram.title }}
                        </h3>
                    </b-col>
                    <b-col md="6" class="text-right">
                        <td-graph-buttons :graph="graph" @saved="saved" @closed="closed" />
                    </b-col>
                </b-row>
            </b-col>
        </b-row>
        
        <b-row class="main-content-row">
            <b-col md="2" class="stencil-col">
                <div ref="stencil_container" class="stencil-container" />
            </b-col>
            <b-col md="10">
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
        width: 100%;
        overflow: hidden;
    }
    
    .header-row {
        padding: 10px;
        border-bottom: 1px solid #eee;
        align-items: center;
    }
    
    .main-content-row {
        flex: 1;
        overflow: hidden;
        height: calc(100% - 80px);
    }
    
    .stencil-col {
        border-right: 1px solid #eee;
        height: 100%;
        padding: 0;
    }
    
    .stencil-container {
        height: 100%;
        overflow-y: auto;
    }
    
    .graph-container {
        height: 100%;
        width: 100%;
    }
    
    .td-graph-title {
        margin-right: 15px;
        margin-bottom: 0;
    }
    
    /* Fix for stencil layout */
    :deep(.x6-widget-stencil) {
        width: 100% !important;
        max-width: 100% !important;
        
        .x6-widget-stencil-search {
            width: 80% !important;
            margin: 8px auto !important;
        }
        
        .x6-widget-stencil-content {
            padding: 5px;
        }
    }
</style>

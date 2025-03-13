<template>
    <div>
        <div class="p-grid">
            <div class="p-col-12 p-md-2">
                <div ref="stencil_container" />
            </div>
            <div class="p-col-12 p-md-10">
                <div class="p-grid p-mb-2">
                    <div class="p-col-6">
                        <h3 class="td-graph-title">
                            {{ diagram.title }}
                        </h3>
                    </div>
                    <div class="p-col-6 p-d-flex p-jc-end">
                        <td-graph-buttons :graph="graph" @saved="saved" @closed="closed" />
                    </div>
                </div>
                <div class="p-grid">
                    <div class="p-col-12 graph-container-wrapper">
                        <div id="graph-container" ref="graph_container" class="graph-container" />
                    </div>
                </div>
            </div>
        </div>
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

import TdGraphButtons from '@/components/GraphButtons.primevue.vue';
import TdGraphMeta from '@/components/GraphMeta.primevue.vue';
import TdKeyboardShortcuts from '@/components/KeyboardShortcuts.vue';
import TdThreatEditDialog from '@/components/ThreatEditDialog.primevue.vue';
import TdThreatSuggestDialog from '@/components/ThreatSuggestDialog.primevue.vue';

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
        TdThreatSuggestDialog,
    },
    computed: mapState({
        diagram: (state) => state.threatmodel.selectedDiagram,
        providerType: (state) => getProviderType(state.provider.selected),
    }),
    data() {
        return {
            graph: null,
        };
    },
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
                this.$router.push({
                    name: `${this.providerType}ThreatModel`,
                    params: this.$route.params,
                });
            }
        },
        async getConfirmModal() {
            // Using PrimeVue confirmation service
            return new Promise((resolve) => {
                this.$confirm.require({
                    message: this.$t('forms.discardMessage'),
                    header: this.$t('forms.discardTitle'),
                    icon: 'pi pi-exclamation-triangle',
                    acceptClass: 'p-button-danger',
                    accept: () => {
                        resolve(true);
                    },
                    reject: () => {
                        resolve(false);
                    },
                });
            });
        },
    },
};
</script>

<style lang="scss" scoped>
    .td-graph-title {
        margin-right: 15px;
        font-size: 1.5rem;
        font-weight: 500;
    }

    .graph-container-wrapper {
        display: flex;
        width: 100%;
    }

    .graph-container {
        height: 65vh;
        width: 100%;
        flex: 1;
        border: 1px solid var(--surface-border);
        border-radius: 4px;
        background-color: var(--surface-ground);
    }
</style>

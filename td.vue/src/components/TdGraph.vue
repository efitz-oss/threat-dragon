<template>
    <div>
        <b-row>
            <b-col md="2">
                <div ref="stencil_container" />
            </b-col>
            <b-col md="10">
                <b-row>
                    <b-col>
                        <h3 class="td-graph-title">
                            {{ diagram.title }}
                        </h3>
                    </b-col>
                    <b-col align="right">
                        <td-graph-buttons :graph="graph" @saved="saved" @closed="closed" />
                    </b-col>
                </b-row>
                <b-row>
                    <b-col class="graph-col">
                        <div id="graph-container" ref="graph_container" class="graph-container" />
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

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useConfirm } from 'primevue/useconfirm';
import { useI18n } from 'vue-i18n';
import { loadDiagramIcons } from '@/icons';

import TdGraphButtons from '@/components/GraphButtons.vue';
import TdGraphMeta from '@/components/GraphMeta.vue';
import TdKeyboardShortcuts from '@/components/KeyboardShortcuts.vue';
import TdThreatEditDialog from '@/components/ThreatEditDialog.vue';
import TdThreatSuggestDialog from './ThreatSuggestDialog.vue';

import { getProviderType } from '@/service/provider/providers.js';
import diagramService from '@/service/migration/diagram.js';
import stencil from '@/service/x6/stencil.js';
import { useThreatmodelStore } from '@/stores/threatmodel';
import { useProviderStore } from '@/stores/provider';

// Composables
const router = useRouter();
const route = useRoute();
const confirm = useConfirm();
const { t } = useI18n();
const threatmodelStore = useThreatmodelStore();
const providerStore = useProviderStore();

// Template refs
const stencil_container = ref(null);
const graph_container = ref(null);
const threatEditDialog = ref(null);
const threatSuggestDialog = ref(null);

// State
const graph = ref(null);

// Computed properties
const diagram = computed(() => threatmodelStore.selectedDiagram);
const providerType = computed(() => getProviderType(providerStore.selected));
const modelChanged = computed(() => threatmodelStore.modelChanged);

// Methods
const init = () => {
    graph.value = diagramService.edit(graph_container.value, diagram.value);
    stencil.get(graph.value, stencil_container.value);
    threatmodelStore.setNotModified();

    graph.value.getPlugin('history').on('change', () => {
        const updated = Object.assign({}, diagram.value);
        updated.cells = graph.value.toJSON().cells;
        threatmodelStore.modifyDiagram(updated);
    });
};

const threatSelected = (threatId, state) => {
    threatEditDialog.value.editThreat(threatId, state);
};

const threatSuggest = (type) => {
    threatSuggestDialog.value.showModal(type);
};

const saved = () => {
    console.debug('Save diagram');
    const updated = Object.assign({}, diagram.value);
    updated.cells = graph.value.toJSON().cells;
    threatmodelStore.saveDiagram(updated);
    threatmodelStore.saveModel();
};

const getConfirmModal = () => {
    return new Promise((resolve) => {
        confirm.require({
            message: t('forms.discardMessage'),
            header: t('forms.discardTitle'),
            icon: 'pi pi-exclamation-triangle',
            acceptClass: 'p-button-danger',
            accept: () => resolve(true),
            reject: () => resolve(false),
        });
    });
};

const closed = async () => {
    if (!modelChanged.value || (await getConfirmModal())) {
        await threatmodelStore.closeDiagram();
        router.push({
            name: `${providerType.value}ThreatModel`,
            params: route.params,
        });
    }
};

// Lifecycle hooks
onMounted(async () => {
    // Load diagram-specific icons before initializing the graph
    await loadDiagramIcons();
    init();
});

onBeforeUnmount(() => {
    diagramService.dispose(graph.value);
});
</script>

<style lang="scss" scoped>
    .td-graph-title {
        margin-right: 15px;
    }

    .graph-col {
        display: flex;
        width: 100vw;
    }

    .graph-container {
        height: 65vh;
        width: 100%;
        flex: 1;
    }
</style>

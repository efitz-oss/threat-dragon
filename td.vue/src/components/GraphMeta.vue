<template>
    <div class="row">
        <!-- Properties Column -->
        <div class="col-md-6">
            <Card>
                <template #header>
                    <div class="card-header">{{ t('threatmodel.properties.title') }}</div>
                </template>
                <template #content>
                    <td-graph-properties />
                </template>
            </Card>
        </div>

        <!-- Threats Column -->
        <div class="col-md-6">
            <Card>
                <template #header>
                    <div class="flex justify-content-between align-items-center">
                        <span>{{ t('threatmodel.threats') }}</span>
                        <Button
                            v-if="!!cellRef"
                            :disabled="disableNewThreat"
                            severity="primary"
                            size="small"
                            @click="newThreat()"
                        >
                            <font-awesome-icon icon="plus" class="mr-1" />
                            <span>{{ t('threats.newThreat') }}</span>
                        </Button>
                    </div>
                </template>
                <template #content>
                    <div v-if="!!cellRef" class="card-content">
                        <div class="row">
                            <div v-for="(threat, idx) in threats || []" :key="idx" class="col-md-4">
                                <td-graph-threats
                                    :id="threat.id"
                                    :status="threat.status"
                                    :severity="threat.severity"
                                    :description="threat.description"
                                    :title="threat.title"
                                    :type="threat.type"
                                    :mitigation="threat.mitigation"
                                    :model-type="threat.modelType"
                                    :number="threat.number"
                                    @threat-selected="threatSelected"
                                />
                            </div>
                        </div>
                    </div>
                    <div v-if="!cellRef || !cellRef.data" class="p-3">
                        {{ t('threats.emptyThreat') }}
                    </div>
                </template>
            </Card>

            <!-- Action Links -->
            <div class="threat-action-links mt-2">
                <a
                    v-if="!disableNewThreat"
                    href="#"
                    class="new-threat-by-type m-2"
                    @click.prevent="AddThreatByType()"
                >
                    <font-awesome-icon icon="plus" />
                    <span class="ml-1">{{ t('threats.newThreatByType') }}</span>
                </a>
                <a
                    v-if="!disableNewThreat"
                    href="#"
                    class="new-threat-by-type m-2"
                    @click.prevent="AddThreatByContext()"
                >
                    <font-awesome-icon icon="plus" />
                    <span class="ml-1">{{ t('threats.newThreatByContext') }}</span>
                </a>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';

// PrimeVue components
import Card from 'primevue/card';
import Button from 'primevue/button';

// App imports
import { createNewTypedThreat } from '@/service/threats/index.js';
import dataChanged from '@/service/x6/graph/data-changed.js';
import TdGraphProperties from '@/components/GraphProperties.vue';
import TdGraphThreats from '@/components/GraphThreats.vue';
import { useThreatmodelStore } from '@/stores/threatmodel';
import { useCellStore } from '@/stores/cell';

// Emits
const emit = defineEmits(['threatSelected', 'threatSuggest']);

// i18n
const { t } = useI18n();

// Stores
const threatmodelStore = useThreatmodelStore();
const cellStore = useCellStore();

// Computed properties
const cellRef = computed(() => cellStore.cellRef);
const threats = computed(() => cellStore.threats);
const diagram = computed(() => threatmodelStore.selectedDiagram);
const threatTop = computed(() => threatmodelStore.data.detail.threatTop);
const disableNewThreat = computed(() => {
    if (!cellRef.value?.data) {
        return true;
    }
    return (
        cellRef.value.data.outOfScope ||
            cellRef.value.data.isTrustBoundary ||
            cellRef.value.data.type === 'tm.Text'
    );
});

// Methods
const init = () => {
    cellStore.unselectCell();
};

const threatSelected = (threatId, state) => {
    console.debug(`selected threat ID: ${threatId}`);
    emit('threatSelected', threatId, state);
};

const newThreat = () => {
    const threat = createNewTypedThreat(
        diagram.value.diagramType,
        cellRef.value.data.type,
        threatTop.value + 1
    );
    console.debug(`new threat ID: ${threat.id}`);
    cellRef.value.data.threats.push(threat);
    cellRef.value.data.hasOpenThreats = cellRef.value.data.threats.length > 0;

    threatmodelStore.updateModel({ threatTop: threatTop.value + 1 });
    threatmodelStore.setModified();
    cellStore.updateCellData(cellRef.value.data);

    dataChanged.updateStyleAttrs(cellRef.value);
    threatSelected(threat.id, 'new');
};

const AddThreatByType = () => {
    emit('threatSuggest', 'type');
};

const AddThreatByContext = () => {
    emit('threatSuggest', 'context');
};

// Lifecycle hooks
onMounted(() => {
    init();
});
</script>

<style lang="scss" scoped>
    @import '@/styles/primevue-variables.scss';

    .new-threat-by-type {
        color: $orange;
        font-size: 16px;
        padding: 8px;
        display: inline-block;
        text-decoration: none;

        &:hover {
            color: darken($orange, 10%);
            text-decoration: underline;
        }

        .ml-1 {
            margin-left: 0.25rem;
        }
    }

    .card-header {
        font-weight: 600;
        font-size: 1.1rem;
    }

    .flex {
        display: flex;
    }

    .justify-content-between {
        justify-content: space-between;
    }

    .align-items-center {
        align-items: center;
    }

    .mr-1 {
        margin-right: 0.25rem;
    }

    .threat-action-links {
        padding: 0.5rem;
    }

    .mt-2 {
        margin-top: 0.5rem;
    }

    :deep(.p-card) {
        border-radius: 0.375rem;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

        .p-card-header {
            background-color: var(--surface-200);
            padding: 0.75rem 1rem;
            border-bottom: 1px solid var(--surface-300);
        }

        .p-card-content {
            padding: 1rem;
        }
    }

    // Responsive adjustments
    @media (max-width: 768px) {
        .row {
            flex-direction: column;
        }

        .col-md-6 {
            width: 100%;
            margin-bottom: 1rem;
        }
    }
</style>

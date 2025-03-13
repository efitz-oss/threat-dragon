<template>
    <div class="p-grid">
        <div class="p-col-12 p-md-6">
            <Card>
                <template #header>
                    <div class="p-card-title">
                        {{ $t('threatmodel.properties.title') }}
                    </div>
                </template>
                <template #content>
                    <td-graph-properties />
                </template>
            </Card>
        </div>
        <div class="p-col-12 p-md-6">
            <Card>
                <template #header>
                    <div class="p-card-header p-d-flex p-jc-between p-ai-center">
                        <div class="p-card-title">
                            {{ $t('threatmodel.threats') }}
                        </div>
                        <Button
                            v-if="!!cellRef"
                            :disabled="disableNewThreat"
                            icon="pi pi-plus"
                            :label="$t('threats.newThreat')"
                            size="small"
                            class="p-mr-2"
                            @click="newThreat()"
                        />
                    </div>
                </template>
                <template #content>
                    <div v-if="!!cellRef">
                        <div class="p-grid">
                            <div
                                v-for="(threat, idx) in threats || []"
                                :key="idx"
                                class="p-col-12 p-md-4"
                            >
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
                    <div v-if="!cellRef || !cellRef.data">
                        {{ $t('threats.emptyThreat') }}
                    </div>
                </template>
            </Card>
            <div v-if="!disableNewThreat" class="p-mt-2 threat-actions">
                <a
                    href="javascript:void(0)"
                    class="threat-action-link p-mr-3"
                    @click="AddThreatByType()"
                >
                    <i class="pi pi-plus p-mr-1" />
                    {{ $t('threats.newThreatByType') }}
                </a>
                <a
                    href="javascript:void(0)"
                    class="threat-action-link"
                    @click="AddThreatByContext()"
                >
                    <i class="pi pi-plus p-mr-1" />
                    {{ $t('threats.newThreatByContext') }}
                </a>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex';

import { createNewTypedThreat } from '@/service/threats/index.js';
import { CELL_DATA_UPDATED, CELL_UNSELECTED } from '@/store/actions/cell.js';
import dataChanged from '@/service/x6/graph/data-changed.js';
import tmActions from '@/store/actions/threatmodel.js';
import TdGraphProperties from '@/components/GraphProperties.primevue.vue';
import TdGraphThreats from '@/components/GraphThreats.primevue.vue';

export default {
    name: 'TdGraphMeta',
    computed: mapState({
        cellRef: (state) => state.cell.ref,
        threats: (state) => state.cell.threats,
        diagram: (state) => state.threatmodel.selectedDiagram,
        threatTop: (state) => state.threatmodel.data.detail.threatTop,
        disableNewThreat: function (state) {
            if (!state.cell?.ref?.data) {
                return true;
            }
            return (
                state.cell.ref.data.outOfScope ||
                    state.cell.ref.data.isTrustBoundary ||
                    state.cell.ref.data.type === 'tm.Text'
            );
        },
    }),
    components: {
        TdGraphProperties,
        TdGraphThreats,
    },
    async mounted() {
        this.init();
    },
    methods: {
        init() {
            this.$store.dispatch(CELL_UNSELECTED);
        },
        threatSelected(threatId, state) {
            console.debug('selected threat ID: ' + threatId);
            this.$emit('threatSelected', threatId, state);
        },
        newThreat() {
            const threat = createNewTypedThreat(
                this.diagram.diagramType,
                this.cellRef.data.type,
                this.threatTop + 1
            );
            console.debug('new threat ID: ' + threat.id);
            this.cellRef.data.threats.push(threat);
            this.cellRef.data.hasOpenThreats = this.cellRef.data.threats.length > 0;
            this.$store.dispatch(tmActions.update, { threatTop: this.threatTop + 1 });
            this.$store.dispatch(tmActions.modified);
            this.$store.dispatch(CELL_DATA_UPDATED, this.cellRef.data);
            dataChanged.updateStyleAttrs(this.cellRef);
            this.threatSelected(threat.id, 'new');
        },
        AddThreatByType() {
            this.$emit('threatSuggest', 'type');
        },
        AddThreatByContext() {
            this.$emit('threatSuggest', 'context');
        },
    },
};
</script>

<style lang="scss" scoped>
    .p-card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
    }

    .p-card-title {
        font-size: 1.25rem;
        font-weight: 500;
        margin: 0;
    }

    .threat-actions {
        margin-top: 1rem;
        padding: 0 0.5rem;
    }

    .threat-action-link {
        color: var(--orange-500);
        font-size: 0.9rem;
        text-decoration: none;
        display: inline-flex;
        align-items: center;

        &:hover {
            text-decoration: underline;
        }

        i {
            font-size: 0.9rem;
        }
    }
</style>

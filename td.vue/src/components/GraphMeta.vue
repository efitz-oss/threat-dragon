<template>
    <div class="graph-meta">
        <b-row class="meta-row">
            <b-col lg="6" md="12" class="meta-column">
                <b-card :header="`${$t('threatmodel.properties.title')}`" class="properties-card">
                    <b-card-body class="scrollable-card-body">
                        <td-graph-properties />
                    </b-card-body>
                </b-card>
            </b-col>
            <b-col lg="6" md="12" class="meta-column">
                <b-card header-tag="header" class="threats-card">
                    <template #header>
                        <div class="d-flex justify-content-between align-items-center">
                            <span>{{ $t('threatmodel.threats') }}</span>
                            <BButton
                                v-if="!!cellRef"
                                :disabled="disableNewThreat"
                                variant="primary"
                                size="sm"
                                @click="newThreat()"
                            >
                                <font-awesome-icon icon="plus" class="mr-1" />
                                {{ $t('threats.newThreat') }}
                            </BButton>
                        </div>
                    </template>
                    <b-card-body class="scrollable-card-body">
                        <b-card-text v-if="!!cellRef">
                            <b-row class="threat-cards-row">
                                <b-col
                                    v-for="(threat, idx) in threats || []"
                                    :key="idx" 
                                    lg="4"
                                    md="6"
                                    sm="12"
                                    class="threat-card-col mb-3">
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
                                </b-col>
                            </b-row>
                        </b-card-text>
                        <b-card-text v-if="!cellRef || !cellRef.data">
                            {{ $t('threats.emptyThreat') }}
                        </b-card-text>
                    </b-card-body>
                </b-card>
                <div class="threat-links">
                    <a
                        v-if="!disableNewThreat"
                        href="javascript:void(0)"
                        class="new-threat-by-type m-2"
                        @click="AddThreatByType()"
                    >
                        <font-awesome-icon icon="plus" />
                        {{ $t('threats.newThreatByType') }}
                    </a>
                    <a
                        v-if="!disableNewThreat"
                        href="javascript:void(0)"
                        class="new-threat-by-type m-2"
                        @click="AddThreatByContext()"
                    >
                        <font-awesome-icon icon="plus" />
                        {{ $t('threats.newThreatByContext') }}
                    </a>
                </div>
            </b-col>
        </b-row>
    </div>
</template>

<script>
import { mapState } from 'vuex';

import { createNewTypedThreat } from '@/service/threats/index.js';
import { CELL_DATA_UPDATED, CELL_UNSELECTED } from '@/store/actions/cell.js';
import dataChanged from '@/service/x6/graph/data-changed.js';
import tmActions from '@/store/actions/threatmodel.js';
import TdGraphProperties from '@/components/GraphProperties.vue';
import TdGraphThreats from '@/components/GraphThreats.vue';

export default {
    name: 'TdGraphMeta',
    components: {
        TdGraphProperties,
        TdGraphThreats
    },
    emits: ['threatSelected', 'threatSuggest'],
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
        }
    }),
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
        }
    }
};
</script>

<style lang="scss" scoped>
    @use '@/styles/colors.scss' as colors;
    
    .graph-meta {
        overflow: hidden;
        max-height: 400px;
    }
    
    .meta-row {
        margin-top: 1rem;
    }
    
    .meta-column {
        margin-bottom: 1rem;
    }
    
    .scrollable-card-body {
        max-height: 300px;
        overflow-y: auto;
    }
    
    .threat-cards-row {
        margin: 0 -0.5rem;
    }
    
    .threat-card-col {
        padding: 0 0.5rem;
    }
    
    .new-threat-by-type {
        color: colors.$orange;
        font-size: 16px;
        padding: 15px;
    }
    
    .threat-links {
        display: flex;
        flex-wrap: wrap;
    }
    
    .properties-card, .threats-card {
        height: 100%;
        display: flex;
        flex-direction: column;
    }
    
    /* Responsive adjustments */
    @media (max-width: 991.98px) {
        .graph-meta {
            max-height: 800px;
        }
    }
    
    .props-header {
        a {
            font-size: 12px;
            font-weight: bolder;
            text-decoration: none;
            margin-left: 5px;
        }
    }
    .down-icon {
        margin-left: 3px;
    }
    .collapsed > .when-open,
    .not-collapsed > .when-closed {
        display: none;
    }
</style>
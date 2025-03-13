<template>
    <div>
        <div class="page">
            <div class="p-grid p-mt-3">
                <div class="p-col">
                    <h2 class="td-diagram-title">
                        {{ diagram.title }}
                    </h2>
                </div>
            </div>
            <div class="p-grid p-mt-3">
                <div class="p-col">
                    <p class="td-diagram-description">
                        {{ diagram.description }}
                    </p>
                </div>
            </div>
            <div v-if="showDiagram" class="p-grid p-mt-3 page diagram-drawing">
                <div class="p-col">
                    <td-read-only-diagram :diagram="diagram" />
                </div>
            </div>
            <div
                v-for="(entity, idx) in entitiesWithThreats"
                :key="idx"
                class="p-grid p-mt-3 no-print"
            >
                <div class="p-col">
                    <td-report-entity
                        :entity="entity"
                        :out-of-scope="entity.data.outOfScope"
                        :show-mitigated="showMitigated"
                        :show-out-of-scope="showOutOfScope"
                        :show-properties="showProperties"
                        :show-empty="showEmpty"
                    />
                </div>
            </div>

            <div class="page-title print-only td-threats-title">
                {{ diagram.title }}
            </div>
            <div v-for="(entity, idx) in entitiesWithThreats" :key="`print-${idx}`">
                <td-print-report-entity
                    :entity="entity"
                    :out-of-scope="entity.data.outOfScope"
                    :show-mitigated="showMitigated"
                    :show-out-of-scope="showOutOfScope"
                    :show-properties="showProperties"
                    :show-empty="showEmpty"
                />
            </div>
        </div>
    </div>
</template>

<script>
import TdPrintReportEntity from '@/components/printed-report/ReportEntity.primevue.vue';
import TdReadOnlyDiagram from '@/components/ReadOnlyDiagram.primevue.vue';
import TdReportEntity from '@/components/report/ReportEntity.primevue.vue';

export default {
    name: 'TdDiagramDetail',
    components: {
        TdPrintReportEntity,
        TdReadOnlyDiagram,
        TdReportEntity,
    },
    props: {
        diagram: Object,
        showDiagram: {
            type: Boolean,
            default: true,
        },
        showMitigated: {
            type: Boolean,
            default: true,
        },
        showOutOfScope: {
            type: Boolean,
            default: true,
        },
        showProperties: {
            type: Boolean,
            default: false,
        },
        showEmpty: {
            type: Boolean,
            default: false,
        },
    },
    computed: {
        entitiesWithThreats: function () {
            return this.diagram.cells.filter(
                (x) =>
                    !!x.data &&
                        !!x.data.threats &&
                        (this.showOutOfScope || !x.data.outOfScope) &&
                        (this.showEmpty ||
                            x.data.threats.some(
                                (y) => this.showMitigated || y.status.toLowerCase() !== 'mitigated'
                            ))
            );
        },
    },
};
</script>

<style lang="scss" scoped>
    .diagram-drawing {
        min-height: 600px;
        display: flex !important;
    }

    .td-diagram-title {
        font-size: 1.75rem;
        font-weight: 600;
        color: var(--text-color);
        margin-bottom: 0.5rem;
    }

    .td-diagram-description {
        font-size: 1rem;
        color: var(--text-color-secondary);
        white-space: pre-wrap;
    }
</style>

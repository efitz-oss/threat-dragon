<template>
    <div class="td-executive-summary no-print">
        <div class="p-grid">
            <div class="p-col">
                <Card>
                    <template #header>
                        <div class="p-card-title">
                            {{ $t('report.executiveSummary') }}
                        </div>
                    </template>
                    <template #content>
                        <h3 class="td-description-title">
                            {{ $t('threatmodel.description') }}
                        </h3>
                        <p class="td-summary">
                            {{ summary || $t('report.notProvided') }}
                        </p>

                        <h3 class="td-report-summary">
                            {{ $t('report.summary') }}
                        </h3>
                        <DataTable
                            class="td-executive-summary-data"
                            :value="tableRows"
                            striped-rows
                            responsive-layout="scroll"
                        >
                            <Column field="name" header="Metric" />
                            <Column field="value" header="Value" />
                        </DataTable>
                    </template>
                </Card>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'TdExecutiveSummary',
    props: {
        summary: {
            type: String,
            required: false,
        },
        threats: {
            type: Array,
            required: true,
        },
    },
    computed: {
        tableRows: function () {
            return [
                { name: this.$t('report.threatStats.total'), value: this.total },
                { name: this.$t('report.threatStats.mitigated'), value: this.mitigated },
                { name: this.$t('report.threatStats.notMitigated'), value: this.notMitigated },
                { name: this.$t('report.threatStats.openCritical'), value: this.openCritical },
                { name: this.$t('report.threatStats.openHigh'), value: this.openHigh },
                { name: this.$t('report.threatStats.openMedium'), value: this.openMedium },
                { name: this.$t('report.threatStats.openLow'), value: this.openLow },
                { name: this.$t('report.threatStats.openTbd'), value: this.openTbd },
                { name: this.$t('report.threatStats.openUnknown'), value: this.openUnknown },
            ];
        },
        total: function () {
            return this.threats.length;
        },
        mitigated: function () {
            return this.threats.filter((threat) => threat.status.toLowerCase() === 'mitigated')
                .length;
        },
        notMitigated: function () {
            return this.threats.filter((threat) => threat.status.toLowerCase() !== 'mitigated')
                .length;
        },
        openCritical: function () {
            return this.getOpenThreats().filter(
                (threat) => threat.severity.toLowerCase() === 'critical'
            ).length;
        },
        openHigh: function () {
            return this.getOpenThreats().filter(
                (threat) => threat.severity.toLowerCase() === 'high'
            ).length;
        },
        openMedium: function () {
            return this.getOpenThreats().filter(
                (threat) => threat.severity.toLowerCase() === 'medium'
            ).length;
        },
        openLow: function () {
            return this.getOpenThreats().filter(
                (threat) => threat.severity.toLowerCase() === 'low'
            ).length;
        },
        openTbd: function () {
            return this.getOpenThreats().filter(
                (threat) => threat.severity.toLowerCase() === 'tbd'
            ).length;
        },
        openUnknown: function () {
            return this.getOpenThreats().filter((threat) => !threat.severity).length;
        },
    },
    methods: {
        getOpenThreats() {
            return this.threats.filter(
                (threat) => threat.status && threat.status.toLowerCase() === 'open'
            );
        },
    },
};
</script>

<style lang="scss" scoped>
    .td-summary {
        white-space: pre-wrap;
        margin-bottom: 1.5rem;
        font-size: 1rem;
        color: var(--text-color-secondary);
    }

    .td-description-title,
    .td-report-summary {
        font-size: 1.25rem;
        font-weight: 600;
        color: var(--text-color);
        margin-bottom: 1rem;
    }

    .td-report-summary {
        margin-top: 2rem;
    }

    :deep(.p-card-title) {
        font-size: 1.5rem;
        font-weight: 600;
    }

    :deep(.p-datatable) {
        .p-datatable-tbody > tr > td {
            white-space: pre-wrap;
        }
    }
</style>

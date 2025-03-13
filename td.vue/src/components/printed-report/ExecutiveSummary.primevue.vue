<template>
    <div class="page print-only">
        <div class="page-title">
            {{ $t('report.executiveSummary') }}
        </div>
        <div class="page-subtitle td-description">
            {{ $t('threatmodel.description') }}
        </div>
        <div class="mt-2 td-summary">
            {{ summary || $t('report.notProvided') }}
        </div>
        <div class="page-subtitle td-report-summary">
            {{ $t('report.summary') }}
        </div>
        <div class="mt-2">
            <table class="p-table td-summary-table">
                <tr>
                    <th>{{ $t('report.threatStats.total') }}</th>
                    <td class="td-summary-total">
                        {{ total }}
                    </td>
                </tr>
                <tr>
                    <th>{{ $t('report.threatStats.mitigated') }}</th>
                    <td class="td-summary-mitigated">
                        {{ mitigated }}
                    </td>
                </tr>
                <tr>
                    <th>{{ $t('report.threatStats.notMitigated') }}</th>
                    <td class="td-summary-not-mitigated">
                        {{ notMitigated }}
                    </td>
                </tr>
                <tr>
                    <th>{{ $t('report.threatStats.openHigh') }}</th>
                    <td class="td-summary-open-high">
                        {{ openHigh }}
                    </td>
                </tr>
                <tr>
                    <th>{{ $t('report.threatStats.openMedium') }}</th>
                    <td class="td-summary-open-medium">
                        {{ openMedium }}
                    </td>
                </tr>
                <tr>
                    <th>{{ $t('report.threatStats.openLow') }}</th>
                    <td class="td-summary-open-low">
                        {{ openLow }}
                    </td>
                </tr>
                <tr>
                    <th>{{ $t('report.threatStats.openUnknown') }}</th>
                    <td class="td-summary-open-unknown">
                        {{ openUnknown }}
                    </td>
                </tr>
            </table>
        </div>
    </div>
</template>

<script>
export default {
    name: 'TdPrintExecutiveSummary',
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
    .page {
        display: flex;
        flex-direction: column;
        white-space: pre-wrap;
        margin-bottom: 2rem;
    }

    .page-title {
        font-size: 2rem;
        font-weight: 700;
        margin-bottom: 2rem;
        color: #2c3e50;
    }

    .page-subtitle {
        font-size: 1.5rem;
        font-weight: 600;
        margin-bottom: 1rem;
        color: #2c3e50;
    }

    .td-summary {
        margin-bottom: 2rem;
        white-space: pre-wrap;
        line-height: 1.5;
    }

    .td-report-summary {
        margin-top: 2rem;
    }

    .p-table {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 1rem;

        th,
        td {
            padding: 0.75rem;
            text-align: left;
            border-bottom: 1px solid #e9ecef;
        }

        th {
            font-weight: 600;
            width: 40%;
        }

        tr:nth-child(even) {
            background-color: #f8f9fa;
        }
    }
</style>

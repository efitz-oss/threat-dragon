<template>
    <div class="td-threat-data no-print">
        <div class="p-grid">
            <div class="p-col">
                <h3 class="entity-title">
                    {{ `${entity.data.name.replaceAll('\n', ' ')} (${dataType})` }}
                    <em v-if="outOfScope">- {{ $t('threatmodel.properties.outOfScope') }}</em>
                </h3>
            </div>
        </div>
        <div v-if="outOfScope" class="p-grid">
            <div class="p-col">
                <p class="entity-description">
                    <b>{{ $t('threatmodel.properties.reasonOutOfScope') }}:</b>
                    {{ entity.data.reasonOutOfScope }}
                </p>
            </div>
        </div>
        <div class="p-grid">
            <div class="p-col">
                <p class="entity-description">
                    {{ $t('threatmodel.properties.description') }}: {{ entity.data.description }}
                </p>
                <p v-if="showProperties" class="entity-description">
                    {{ properties }}
                </p>
            </div>
        </div>
        <div class="p-grid">
            <div class="p-col-12">
                <DataTable
                    :data-test-id="entity.data.name.replace(' ', '_')"
                    :value="tableData"
                    striped-rows
                    responsive-layout="scroll"
                    class="p-datatable-sm"
                >
                    <Column
                        v-for="col in columns"
                        :key="col.field"
                        :field="col.field"
                        :header="col.header"
                    />
                </DataTable>
            </div>
        </div>
    </div>
</template>

<script>
import threatService from '@/service/threats/index.js';

export default {
    name: 'TdReportEntity',
    props: {
        entity: Object,
        outOfScope: {
            type: Boolean,
            default: false,
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
    },
    computed: {
        dataType: function () {
            const entityType = this.entity.data.type.replace('tm.', '').replace('td.', '');
            return this.$t(`threatmodel.shapes.${this.toCamelCase(entityType)}`);
        },
        tableData: function () {
            return threatService
                .filterForDiagram(this.entity.data, {
                    showMitigated: this.showMitigated,
                    showOutOfScope: this.showOutOfScope,
                })
                .map((threat) => {
                    return {
                        number: threat.number,
                        title: threat.title,
                        type: threat.type,
                        priority: threat.severity,
                        status: threat.status,
                        score: threat.score,
                        description: threat.description,
                        mitigation: threat.mitigation,
                    };
                });
        },
        columns: function () {
            return [
                { field: 'number', header: this.$t('threats.properties.number') },
                { field: 'title', header: this.$t('threats.properties.title') },
                { field: 'type', header: this.$t('threats.properties.type') },
                { field: 'priority', header: this.$t('threats.properties.priority') },
                { field: 'status', header: this.$t('threats.properties.status') },
                { field: 'score', header: this.$t('threats.properties.score') },
                { field: 'description', header: this.$t('threats.properties.description') },
                { field: 'mitigation', header: this.$t('threats.properties.mitigation') },
            ];
        },
        properties: function () {
            let properties = '';
            if (this.entity.data.bidirection) {
                properties += this.$t('threatmodel.properties.bidirection') + ', ';
            }
            if (this.entity.data.handlesCardPayment) {
                properties += this.$t('threatmodel.properties.handlesCardPayment') + ', ';
            }
            if (this.entity.data.handlesGoodsOrServices) {
                properties += this.$t('threatmodel.properties.handlesGoodsOrServices') + ', ';
            }
            if (this.entity.data.isALog) {
                properties += this.$t('threatmodel.properties.isALog') + ', ';
            }
            if (this.entity.data.isEncrypted) {
                properties += this.$t('threatmodel.properties.isEncrypted') + ', ';
            }
            if (this.entity.data.isSigned) {
                properties += this.$t('threatmodel.properties.isSigned') + ', ';
            }
            if (this.entity.data.isWebApplication) {
                properties += this.$t('threatmodel.properties.isWebApplication') + ', ';
            }
            if (this.entity.data.privilegeLevel) {
                properties +=
                        this.$t('threatmodel.properties.privilegeLevel') +
                        ': ' +
                        this.entity.data.privilegeLevel +
                        ', ';
            }
            if (this.entity.data.providesAuthentication) {
                properties += this.$t('threatmodel.properties.providesAuthentication') + ', ';
            }
            if (this.entity.data.protocol) {
                properties +=
                        this.$t('threatmodel.properties.protocol') +
                        ' (' +
                        this.entity.data.protocol +
                        '), ';
            }
            if (this.entity.data.publicNetwork) {
                properties += this.$t('threatmodel.properties.publicNetwork') + ', ';
            }
            if (this.entity.data.storesCredentials) {
                properties += this.$t('threatmodel.properties.storesCredentials') + ', ';
            }
            if (this.entity.data.storesInventory) {
                properties += this.$t('threatmodel.properties.storesInventory') + ', ';
            }
            if (properties.length > 2) {
                properties = properties.slice(0, -2);
            }
            return this.$t('threatmodel.properties.title') + ': ' + properties;
        },
    },
    methods: {
        toCamelCase(str) {
            // https://stackoverflow.com/questions/2970525/converting-any-string-into-camel-case
            return str
                .replace(/(?:^\w|[A-Z]|\b\w)/g, (ltr, idx) =>
                    idx === 0 ? ltr.toLowerCase() : ltr.toUpperCase()
                )
                .replace(/\s+/g, '');
        },
    },
};
</script>

<style lang="scss" scoped>
    .td-threat-data {
        width: 99%;
        white-space: pre-wrap;
    }

    .entity-title {
        font-size: 1.5rem;
        margin-top: 3rem;
        margin-bottom: 1rem;
        font-weight: 600;
        color: var(--text-color);
    }

    .entity-description {
        padding: 1rem;
        white-space: pre-wrap;
        color: var(--text-color-secondary);
    }

    :deep(.p-datatable) {
        .p-datatable-tbody > tr > td {
            white-space: pre-wrap;
            word-break: break-word;
        }
    }
</style>

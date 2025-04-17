<template>
    <div id="props-card">
        <!--
            All entities have the following properties:
                - Name (text input)
                - Description (text area)
                - type (not shown in properties)

            Process, Store, Actor, Flow share the following (not boundaries):
                - outOfScope
                - reasonOutOfScope
                - hasOpenThreats
                - threats

            Process:
                - handlesCardPayment
                - handlesGoodsOrServices
                - isWebApplication
                - privilegeLevel

            Store:
                - isALog
                - storesCredentials
                - isEncrypted
                - isSigned
                - storesInventory

            Actor:
                - providesAuthentication

            Flow:
                - isBidirectional
                - protocol
                - isEncrypted
                - isPublicNetwork
        -->

        <b-row v-show="!cellRef">
            <b-col>
                <p>{{ t('threatmodel.properties.emptyState') }}</p>
            </b-col>
        </b-row>

        <b-form v-if="cellRef && cellRef.data">
            <b-form-row>
                <b-col md="6">
                    <b-form-group
                        id="name-group"
                        label-cols="auto"
                        :label="cellRef.data && cellRef.data.type === 'tm.Text'
                            ? t('threatmodel.properties.text')
                            : t('threatmodel.properties.name')
                        "
                        label-for="name">
                        <b-form-textarea
                            id="name"
                            v-model="safeName"
                            :rows="cellRef.data.type === 'tm.Text' ? 7 : 2"
                            style="min-height: 60px" />
                    </b-form-group>
                </b-col>

                <b-col v-if="cellRef.data.type !== 'tm.Text'" md="6">
                    <b-form-group
                        id="description-group"
                        label-cols="auto"
                        :label="t('threatmodel.properties.description')"
                        label-for="description">
                        <b-form-textarea
                            id="description"
                            v-model="safeDescription"
                            :rows="3"
                            style="min-height: 80px" />
                    </b-form-group>
                </b-col>

                <b-col
                    v-if="
                        !cellRef.data.isTrustBoundary &&
                            cellRef.data.type !== 'tm.Text' &&
                            cellRef.data.type !== 'tm.Flow'
                    "
                    md="6">
                    <b-form-group id="outofscope-group" label-cols="auto">
                        <b-form-checkbox id="outofscope" v-model="cellRef.data.outOfScope" @change="onChangeScope()">
                            {{ t('threatmodel.properties.outOfScope') }}
                        </b-form-checkbox>
                    </b-form-group>
                </b-col>

                <b-col v-if="cellRef.data.type === 'tm.Flow'" md="6">
                    <b-form-group id="flowoutofscope-group" label-cols="auto">
                        <b-form-checkbox
                            id="flowoutofscope"
                            v-model="cellRef.data.outOfScope"
                            @change="onChangeScope()">
                            {{ t('threatmodel.properties.outOfScope') }}
                        </b-form-checkbox>
                        <b-form-checkbox
                            id="bidirection"
                            v-model="cellRef.data.isBidirectional"
                            @change="onChangeBidirection()">
                            {{ t('threatmodel.properties.bidirection') }}
                        </b-form-checkbox>
                    </b-form-group>
                </b-col>

                <b-col v-if="!cellRef.data.isTrustBoundary && cellRef.data.type !== 'tm.Text'" md="6" class="mt-3">
                    <b-form-group
                        id="reasonoutofscope-group"
                        label-cols="auto"
                        :label="t('threatmodel.properties.reasonOutOfScope')"
                        label-for="reasonoutofscope">
                        <b-form-textarea
                            id="reasonoutofscope"
                            v-model="safeReasonOutOfScope"
                            :rows="3"
                            style="min-height: 80px"
                            :disabled="!cellRef.data.outOfScope" />
                    </b-form-group>
                </b-col>

                <b-col v-if="cellRef.data.type === 'tm.Process'">
                    <b-form-group
                        id="privilegelevel-group"
                        label-cols="auto"
                        :label="t('threatmodel.properties.privilegeLevel')"
                        label-for="privilegelevel">
                        <b-form-input
                            id="privilegelevel"
                            v-model="cellRef.data.privilegeLevel"
                            type="text"
                            @change="onChangeProperties()" />
                    </b-form-group>
                </b-col>

                <b-col v-if="cellRef.data.type === 'tm.Process'">
                    <b-form-group id="process-handles-group" label-cols="auto">
                        <b-form-checkbox
                            id="handlesCardPayment"
                            v-model="cellRef.data.handlesCardPayment"
                            @change="onChangeProperties()">
                            {{ t('threatmodel.properties.handlesCardPayment') }}
                        </b-form-checkbox>
                        <b-form-checkbox
                            id="handlesGoodsOrServices"
                            v-model="cellRef.data.handlesGoodsOrServices"
                            @change="onChangeProperties()">
                            {{ t('threatmodel.properties.handlesGoodsOrServices') }}
                        </b-form-checkbox>
                    </b-form-group>
                </b-col>

                <b-col v-if="cellRef.data.type === 'tm.Process'">
                    <b-form-group id="web-app-group" label-cols="auto">
                        <b-form-checkbox
                            id="isWebApplication"
                            v-model="cellRef.data.isWebApplication"
                            @change="onChangeProperties()">
                            {{ t('threatmodel.properties.isWebApplication') }}
                        </b-form-checkbox>
                    </b-form-group>
                </b-col>

                <b-col v-if="cellRef.data.type === 'tm.Store'">
                    <b-form-group id="isalog-group" label-cols="auto">
                        <b-form-checkbox id="isalog" v-model="cellRef.data.isALog" @change="onChangeProperties()">
                            {{ t('threatmodel.properties.isALog') }}
                        </b-form-checkbox>
                        <b-form-checkbox
                            id="storesCredentials"
                            v-model="cellRef.data.storesCredentials"
                            @change="onChangeProperties()">
                            {{ t('threatmodel.properties.storesCredentials') }}
                        </b-form-checkbox>
                    </b-form-group>
                </b-col>

                <b-col v-if="cellRef.data.type === 'tm.Store'">
                    <b-form-group id="isEncrypted-group" label-cols="auto">
                        <b-form-checkbox
                            id="isEncrypted"
                            v-model="cellRef.data.isEncrypted"
                            @change="onChangeProperties()">
                            {{ t('threatmodel.properties.isEncrypted') }}
                        </b-form-checkbox>
                        <b-form-checkbox id="isSigned" v-model="cellRef.data.isSigned" @change="onChangeProperties()">
                            {{ t('threatmodel.properties.isSigned') }}
                        </b-form-checkbox>
                    </b-form-group>
                </b-col>

                <b-col v-if="cellRef.data.type === 'tm.Store'">
                    <b-form-group id="storesInventory-group" label-cols="auto">
                        <b-form-checkbox
                            id="storesInventory"
                            v-model="cellRef.data.storesInventory"
                            @change="onChangeProperties()">
                            {{ t('threatmodel.properties.storesInventory') }}
                        </b-form-checkbox>
                    </b-form-group>
                </b-col>

                <b-col v-if="cellRef.data.type === 'tm.Actor'">
                    <b-form-group id="providesAuthentication-group" label-cols="auto">
                        <b-form-checkbox
                            id="providesAuthentication"
                            v-model="cellRef.data.providesAuthentication"
                            @change="onChangeProperties()">
                            {{ t('threatmodel.properties.providesAuthentication') }}
                        </b-form-checkbox>
                    </b-form-group>
                </b-col>

                <b-col v-if="cellRef.data.type === 'tm.Flow'">
                    <b-form-group
                        id="protocol-group"
                        label-cols="auto"
                        :label="t('threatmodel.properties.protocol')"
                        label-for="protocol">
                        <b-form-input
                            id="protocol"
                            v-model="cellRef.data.protocol"
                            type="text"
                            @change="onChangeProperties()" />
                    </b-form-group>
                </b-col>

                <b-col v-if="cellRef.data.type === 'tm.Flow'">
                    <b-form-group id="isEncrypted-group" label-cols="auto">
                        <b-form-checkbox
                            id="isEncrypted"
                            v-model="cellRef.data.isEncrypted"
                            @change="onChangeProperties()">
                            {{ t('threatmodel.properties.isEncrypted') }}
                        </b-form-checkbox>
                    </b-form-group>
                </b-col>

                <b-col v-if="cellRef.data.type === 'tm.Flow'">
                    <b-form-group id="isPublicNetwork-group" label-cols="auto">
                        <b-form-checkbox
                            id="isPublicNetwork"
                            v-model="cellRef.data.isPublicNetwork"
                            @change="onChangeProperties()">
                            {{ t('threatmodel.properties.publicNetwork') }}
                        </b-form-checkbox>
                    </b-form-group>
                </b-col>
            </b-form-row>
        </b-form>
    </div>
</template>

<script>
import { computed, watch } from 'vue';
import { useStore } from 'vuex';
import { useI18n } from '@/i18n';
import dataChanged from '@/service/x6/graph/data-changed.js';

export default {
    name: 'TdGraphProperties',
    components: {
    },
    setup() {
        const store = useStore();
        const { t } = useI18n();

        // Get cellRef from store
        const cellRef = computed(() => store.state.cell.ref);

        // Computed property for name with two-way binding and null check
        const safeName = computed({
            get: () => {
                if (cellRef.value && cellRef.value.data) {
                    return cellRef.value.data.name || '';
                }
                return '';
            },
            set: (value) => {
                if (cellRef.value && cellRef.value.data) {
                    cellRef.value.data.name = value;
                    dataChanged.updateName(cellRef.value);
                }
            }
        });

        // Computed property for description with two-way binding and null check
        const safeDescription = computed({
            get: () => {
                if (cellRef.value && cellRef.value.data) {
                    return cellRef.value.data.description || '';
                }
                return '';
            },
            set: (value) => {
                if (cellRef.value && cellRef.value.data) {
                    cellRef.value.data.description = value;
                    dataChanged.updateProperties(cellRef.value);
                }
            }
        });

        // Computed property for reasonOutOfScope with two-way binding and null check
        const safeReasonOutOfScope = computed({
            get: () => {
                if (cellRef.value && cellRef.value.data) {
                    return cellRef.value.data.reasonOutOfScope || '';
                }
                return '';
            },
            set: (value) => {
                if (cellRef.value && cellRef.value.data) {
                    cellRef.value.data.reasonOutOfScope = value;
                    dataChanged.updateProperties(cellRef.value);
                }
            }
        });

        // Computed property to determine if reasonOutOfScope field should be disabled
        const isReasonDisabled = computed(() => {
            if (cellRef.value && cellRef.value.data) {
                return !cellRef.value.data.outOfScope;
            }
            return true;
        });

        // Define component methods
        const updateComponent = () => {
            // For Vue 3, forcing update is generally not needed
            // This function is kept for compatibility
        };

        const onChangeName = () => {
            dataChanged.updateName(cellRef.value);
            updateComponent();
        };

        const onChangeBidirection = () => {
            dataChanged.updateProperties(cellRef.value);
            dataChanged.updateStyleAttrs(cellRef.value);
            updateComponent();
        };

        const onChangeProperties = () => {
            dataChanged.updateProperties(cellRef.value);
            updateComponent();
        };

        const updateDescription = (value) => {
            if (cellRef.value && cellRef.value.data) {
                cellRef.value.data.description = value;
                onChangeProperties();
            }
        };

        const updateReasonOutOfScope = (value) => {
            if (cellRef.value && cellRef.value.data) {
                cellRef.value.data.reasonOutOfScope = value;
                onChangeProperties();
            }
        };

        // Watch for changes to the outOfScope property
        watch(() => cellRef.value?.data?.outOfScope, (newValue) => {
            if (cellRef.value && cellRef.value.data) {
                // If outOfScope is true but reasonOutOfScope is empty, initialize it
                if (newValue && !cellRef.value.data.reasonOutOfScope) {
                    cellRef.value.data.reasonOutOfScope = '';
                }

                // Force update
                updateComponent();
            }
        });

        const onChangeScope = () => {
            // We need to ensure the outOfScope property change is properly detected
            if (cellRef.value && cellRef.value.data) {
                // Force reactivity by explicitly setting the property
                cellRef.value.data.outOfScope = !!cellRef.value.data.outOfScope;

                // Update the cell properties and style
                dataChanged.updateProperties(cellRef.value);
                dataChanged.updateStyleAttrs(cellRef.value);
                updateComponent();
            }
        };

        // Define the getReasonDisabled method
        const getReasonDisabled = () => {
            if (cellRef.value && cellRef.value.data) {
                return !cellRef.value.data.outOfScope;
            }
            return true;
        };

        return {
            cellRef,
            safeName,
            safeDescription,
            safeReasonOutOfScope,
            isReasonDisabled,
            updateComponent,
            onChangeBidirection,
            onChangeProperties,
            onChangeScope,
            getReasonDisabled,
            t
        };
    }
};
</script>

<style lang="scss" scoped>
#props-card {
    max-height: 100%;
    overflow-y: auto;
}

/* Make form layout more responsive */
:deep(.form-group) {
    margin-bottom: 1rem;
}

/* Ensure textareas have appropriate fixed height - min-height moved to inline styles */
:deep(textarea.form-control) {
    height: auto !important;
    resize: none !important;
}

/* Improve form elements spacing */
:deep(.form-check) {
    margin-bottom: 0.5rem;
}

/* Style form labels */
:deep(label) {
    font-size: 12px !important;
}

/* Improve responsive behavior for columns */
@media (max-width: 767.98px) {
    :deep(.col-md-6) {
        margin-bottom: 1rem;
    }
}
</style>

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
                <p>{{ $t('threatmodel.properties.emptyState') }}</p>
            </b-col>
        </b-row>

        <b-form v-if="!!cellRef && cellRef.data">
            <b-form-row>
                <b-col md="6">
                    <b-form-group
                        id="name-group"
                        label-cols="auto"
                        :label="
                            cellRef.data && cellRef.data.type === 'tm.Text'
                                ? $t('threatmodel.properties.text')
                                : $t('threatmodel.properties.name')
                        "
                        label-for="name"
                    >
                        <b-form-textarea
                            id="name"
                            v-model="cellRef.data.name"
                            :rows="cellRef.data.type === 'tm.Text' ? 7 : 2"
                            :no-auto-shrink="true"
                            no-resize
                            graph-pro
                            @update="onChangeName()"
                        />
                    </b-form-group>
                </b-col>

                <b-col v-if="cellRef.data.type !== 'tm.Text'" md="6">
                    <b-form-group
                        id="description-group"
                        label-cols="auto"
                        :label="$t('threatmodel.properties.description')"
                        label-for="description"
                    >
                        <b-form-textarea
                            id="description"
                            v-model="cellRef.data.description"
                            :rows="3"
                            :no-auto-shrink="true"
                            no-resize
                            @change="onChangeProperties()"
                        />
                    </b-form-group>
                </b-col>

                <b-col
                    v-if="
                        !cellRef.data.isTrustBoundary &&
                            cellRef.data.type !== 'tm.Text' &&
                            cellRef.data.type !== 'tm.Flow'
                    "
                    md="6"
                >
                    <b-form-group id="outofscope-group" label-cols="auto">
                        <b-form-checkbox
                            id="outofscope"
                            v-model="cellRef.data.outOfScope"
                            @change="onChangeScope()"
                        >
                            {{ $t('threatmodel.properties.outOfScope') }}
                        </b-form-checkbox>
                    </b-form-group>
                </b-col>

                <b-col v-if="cellRef.data.type === 'tm.Flow'" md="6">
                    <b-form-group id="flowoutofscope-group" label-cols="auto">
                        <b-form-checkbox
                            id="flowoutofscope"
                            v-model="cellRef.data.outOfScope"
                            @change="onChangeScope()"
                        >
                            {{ $t('threatmodel.properties.outOfScope') }}
                        </b-form-checkbox>
                        <b-form-checkbox
                            id="bidirection"
                            v-model="cellRef.data.isBidirectional"
                            @change="onChangeBidirection()"
                        >
                            {{ $t('threatmodel.properties.bidirection') }}
                        </b-form-checkbox>
                    </b-form-group>
                </b-col>

                <b-col
                    v-if="!cellRef.data.isTrustBoundary && cellRef.data.type !== 'tm.Text'"
                    md="6"
                >
                    <b-form-group
                        id="reasonoutofscope-group"
                        label-cols="auto"
                        :label="$t('threatmodel.properties.reasonOutOfScope')"
                        label-for="reasonoutofscope"
                    >
                        <b-form-textarea
                            id="reasonoutofscope"
                            v-model="cellRef.data.reasonOutOfScope"
                            :rows="3"
                            :no-auto-shrink="true"
                            no-resize
                            :disabled="!cellRef.data.outOfScope"
                            @change="onChangeProperties()"
                        />
                    </b-form-group>
                </b-col>

                <b-col v-if="cellRef.data.type === 'tm.Process'">
                    <b-form-group
                        id="privilegelevel-group"
                        label-cols="auto"
                        :label="$t('threatmodel.properties.privilegeLevel')"
                        label-for="privilegelevel"
                    >
                        <b-form-input
                            id="privilegelevel"
                            v-model="cellRef.data.privilegeLevel"
                            type="text"
                            @change="onChangeProperties()"
                        />
                    </b-form-group>
                </b-col>

                <b-col v-if="cellRef.data.type === 'tm.Process'">
                    <b-form-group id="process-handles-group" label-cols="auto">
                        <b-form-checkbox
                            id="handlesCardPayment"
                            v-model="cellRef.data.handlesCardPayment"
                            @change="onChangeProperties()"
                        >
                            {{ $t('threatmodel.properties.handlesCardPayment') }}
                        </b-form-checkbox>
                        <b-form-checkbox
                            id="handlesGoodsOrServices"
                            v-model="cellRef.data.handlesGoodsOrServices"
                            @change="onChangeProperties()"
                        >
                            {{ $t('threatmodel.properties.handlesGoodsOrServices') }}
                        </b-form-checkbox>
                    </b-form-group>
                </b-col>

                <b-col v-if="cellRef.data.type === 'tm.Process'">
                    <b-form-group id="web-app-group" label-cols="auto">
                        <b-form-checkbox
                            id="isWebApplication"
                            v-model="cellRef.data.isWebApplication"
                            @change="onChangeProperties()"
                        >
                            {{ $t('threatmodel.properties.isWebApplication') }}
                        </b-form-checkbox>
                    </b-form-group>
                </b-col>

                <b-col v-if="cellRef.data.type === 'tm.Store'">
                    <b-form-group id="isalog-group" label-cols="auto">
                        <b-form-checkbox
                            id="isalog"
                            v-model="cellRef.data.isALog"
                            @change="onChangeProperties()"
                        >
                            {{ $t('threatmodel.properties.isALog') }}
                        </b-form-checkbox>
                        <b-form-checkbox
                            id="storesCredentials"
                            v-model="cellRef.data.storesCredentials"
                            @change="onChangeProperties()"
                        >
                            {{ $t('threatmodel.properties.storesCredentials') }}
                        </b-form-checkbox>
                    </b-form-group>
                </b-col>

                <b-col v-if="cellRef.data.type === 'tm.Store'">
                    <b-form-group id="isEncrypted-group" label-cols="auto">
                        <b-form-checkbox
                            id="isEncrypted"
                            v-model="cellRef.data.isEncrypted"
                            @change="onChangeProperties()"
                        >
                            {{ $t('threatmodel.properties.isEncrypted') }}
                        </b-form-checkbox>
                        <b-form-checkbox
                            id="isSigned"
                            v-model="cellRef.data.isSigned"
                            @change="onChangeProperties()"
                        >
                            {{ $t('threatmodel.properties.isSigned') }}
                        </b-form-checkbox>
                    </b-form-group>
                </b-col>

                <b-col v-if="cellRef.data.type === 'tm.Store'">
                    <b-form-group id="storesInventory-group" label-cols="auto">
                        <b-form-checkbox
                            id="storesInventory"
                            v-model="cellRef.data.storesInventory"
                            @change="onChangeProperties()"
                        >
                            {{ $t('threatmodel.properties.storesInventory') }}
                        </b-form-checkbox>
                    </b-form-group>
                </b-col>

                <b-col v-if="cellRef.data.type === 'tm.Actor'">
                    <b-form-group id="providesAuthentication-group" label-cols="auto">
                        <b-form-checkbox
                            id="providesAuthentication"
                            v-model="cellRef.data.providesAuthentication"
                            @change="onChangeProperties()"
                        >
                            {{ $t('threatmodel.properties.providesAuthentication') }}
                        </b-form-checkbox>
                    </b-form-group>
                </b-col>

                <b-col v-if="cellRef.data.type === 'tm.Flow'">
                    <b-form-group
                        id="protocol-group"
                        label-cols="auto"
                        :label="$t('threatmodel.properties.protocol')"
                        label-for="protocol"
                    >
                        <b-form-input
                            id="protocol"
                            v-model="cellRef.data.protocol"
                            type="text"
                            @change="onChangeProperties()"
                        />
                    </b-form-group>
                </b-col>

                <b-col v-if="cellRef.data.type === 'tm.Flow'">
                    <b-form-group id="isEncrypted-group" label-cols="auto">
                        <b-form-checkbox
                            id="isEncrypted"
                            v-model="cellRef.data.isEncrypted"
                            @change="onChangeProperties()"
                        >
                            {{ $t('threatmodel.properties.isEncrypted') }}
                        </b-form-checkbox>
                    </b-form-group>
                </b-col>

                <b-col v-if="cellRef.data.type === 'tm.Flow'">
                    <b-form-group id="isPublicNetwork-group" label-cols="auto">
                        <b-form-checkbox
                            id="isPublicNetwork"
                            v-model="cellRef.data.isPublicNetwork"
                            @change="onChangeProperties()"
                        >
                            {{ $t('threatmodel.properties.publicNetwork') }}
                        </b-form-checkbox>
                    </b-form-group>
                </b-col>
            </b-form-row>
        </b-form>
    </div>
</template>

<script>
import { mapState } from 'vuex';
import dataChanged from '@/service/x6/graph/data-changed.js';

export default {
    name: 'TdGraphProperties',
    computed: mapState({
        cellRef: (state) => state.cell.ref
    }),
    methods: {
        updateComponent() {
            // should not need to need to force an update
            this.$forceUpdate();
        },
        onChangeName() {
            dataChanged.updateName(this.cellRef);
            this.updateComponent();
        },
        onChangeBidirection() {
            dataChanged.updateProperties(this.cellRef);
            dataChanged.updateStyleAttrs(this.cellRef);
            this.updateComponent();
        },
        onChangeProperties() {
            dataChanged.updateProperties(this.cellRef);
            this.updateComponent();
        },
        onChangeScope() {
            document.getElementById('reasonoutofscope').disabled =
                    !this.cellRef.data.outOfScope;
            dataChanged.updateProperties(this.cellRef);
            dataChanged.updateStyleAttrs(this.cellRef);
            this.updateComponent();
        }
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
    
    /* Ensure textareas have appropriate fixed height */
    :deep(textarea.form-control) {
        min-height: 60px;
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

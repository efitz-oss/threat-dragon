<template>
    <div id="props-card" class="p-3">
        <div v-show="!cellRef" class="p-grid">
            <div class="p-col">
                <p>{{ $t('threatmodel.properties.emptyState') }}</p>
            </div>
        </div>

        <div v-if="!!cellRef && cellRef.data" class="p-fluid">
            <div class="p-grid">
                <div class="p-col-12 p-md-6">
                    <div class="p-field">
                        <label for="name">
                            {{
                                cellRef.data && cellRef.data.type === 'tm.Text'
                                    ? $t('threatmodel.properties.text')
                                    : $t('threatmodel.properties.name')
                            }}
                        </label>
                        <Textarea
                            id="name"
                            v-model="cellRef.data.name"
                            :rows="cellRef.data.type === 'tm.Text' ? 7 : 2"
                            @update:model-value="onChangeName()"
                        />
                    </div>
                </div>

                <div v-if="cellRef.data.type !== 'tm.Text'" class="p-col-12 p-md-6">
                    <div class="p-field">
                        <label for="description">{{
                            $t('threatmodel.properties.description')
                        }}</label>
                        <Textarea
                            id="description"
                            v-model="cellRef.data.description"
                            @change="onChangeProperties()"
                        />
                    </div>
                </div>

                <div
                    v-if="
                        !cellRef.data.isTrustBoundary &&
                        cellRef.data.type !== 'tm.Text' &&
                        cellRef.data.type !== 'tm.Flow'
                    "
                    class="p-col-12 p-md-6"
                >
                    <div class="p-field-checkbox">
                        <Checkbox
                            id="outofscope"
                            v-model="cellRef.data.outOfScope"
                            @change="onChangeScope()"
                        />
                        <label for="outofscope">{{
                            $t('threatmodel.properties.outOfScope')
                        }}</label>
                    </div>
                </div>

                <div v-if="cellRef.data.type === 'tm.Flow'" class="p-col-12 p-md-6">
                    <div class="p-field-checkbox">
                        <Checkbox
                            id="flowoutofscope"
                            v-model="cellRef.data.outOfScope"
                            @change="onChangeScope()"
                        />
                        <label for="flowoutofscope">{{
                            $t('threatmodel.properties.outOfScope')
                        }}</label>
                    </div>
                    <div class="p-field-checkbox">
                        <Checkbox
                            id="bidirection"
                            v-model="cellRef.data.isBidirectional"
                            @change="onChangeBidirection()"
                        />
                        <label for="bidirection">{{
                            $t('threatmodel.properties.bidirection')
                        }}</label>
                    </div>
                </div>

                <div
                    v-if="!cellRef.data.isTrustBoundary && cellRef.data.type !== 'tm.Text'"
                    class="p-col-12 p-md-6"
                >
                    <div class="p-field">
                        <label for="reasonoutofscope">{{
                            $t('threatmodel.properties.reasonOutOfScope')
                        }}</label>
                        <Textarea
                            id="reasonoutofscope"
                            v-model="cellRef.data.reasonOutOfScope"
                            :disabled="!cellRef.data.outOfScope"
                            @change="onChangeProperties()"
                        />
                    </div>
                </div>

                <div v-if="cellRef.data.type === 'tm.Process'" class="p-col-12 p-md-6">
                    <div class="p-field">
                        <label for="privilegelevel">{{
                            $t('threatmodel.properties.privilegeLevel')
                        }}</label>
                        <InputText
                            id="privilegelevel"
                            v-model="cellRef.data.privilegeLevel"
                            type="text"
                            @change="onChangeProperties()"
                        />
                    </div>
                </div>

                <div v-if="cellRef.data.type === 'tm.Process'" class="p-col-12 p-md-6">
                    <div class="p-field-checkbox">
                        <Checkbox
                            id="handlesCardPayment"
                            v-model="cellRef.data.handlesCardPayment"
                            @change="onChangeProperties()"
                        />
                        <label for="handlesCardPayment">{{
                            $t('threatmodel.properties.handlesCardPayment')
                        }}</label>
                    </div>
                    <div class="p-field-checkbox">
                        <Checkbox
                            id="handlesGoodsOrServices"
                            v-model="cellRef.data.handlesGoodsOrServices"
                            @change="onChangeProperties()"
                        />
                        <label for="handlesGoodsOrServices">{{
                            $t('threatmodel.properties.handlesGoodsOrServices')
                        }}</label>
                    </div>
                </div>

                <div v-if="cellRef.data.type === 'tm.Process'" class="p-col-12 p-md-6">
                    <div class="p-field-checkbox">
                        <Checkbox
                            id="isWebApplication"
                            v-model="cellRef.data.isWebApplication"
                            @change="onChangeProperties()"
                        />
                        <label for="isWebApplication">{{
                            $t('threatmodel.properties.isWebApplication')
                        }}</label>
                    </div>
                </div>

                <div v-if="cellRef.data.type === 'tm.Store'" class="p-col-12 p-md-6">
                    <div class="p-field-checkbox">
                        <Checkbox
                            id="isalog"
                            v-model="cellRef.data.isALog"
                            @change="onChangeProperties()"
                        />
                        <label for="isalog">{{ $t('threatmodel.properties.isALog') }}</label>
                    </div>
                    <div class="p-field-checkbox">
                        <Checkbox
                            id="storesCredentials"
                            v-model="cellRef.data.storesCredentials"
                            @change="onChangeProperties()"
                        />
                        <label for="storesCredentials">{{
                            $t('threatmodel.properties.storesCredentials')
                        }}</label>
                    </div>
                </div>

                <div v-if="cellRef.data.type === 'tm.Store'" class="p-col-12 p-md-6">
                    <div class="p-field-checkbox">
                        <Checkbox
                            id="isEncrypted"
                            v-model="cellRef.data.isEncrypted"
                            @change="onChangeProperties()"
                        />
                        <label for="isEncrypted">{{
                            $t('threatmodel.properties.isEncrypted')
                        }}</label>
                    </div>
                    <div class="p-field-checkbox">
                        <Checkbox
                            id="isSigned"
                            v-model="cellRef.data.isSigned"
                            @change="onChangeProperties()"
                        />
                        <label for="isSigned">{{ $t('threatmodel.properties.isSigned') }}</label>
                    </div>
                </div>

                <div v-if="cellRef.data.type === 'tm.Store'" class="p-col-12 p-md-6">
                    <div class="p-field-checkbox">
                        <Checkbox
                            id="storesInventory"
                            v-model="cellRef.data.storesInventory"
                            @change="onChangeProperties()"
                        />
                        <label for="storesInventory">{{
                            $t('threatmodel.properties.storesInventory')
                        }}</label>
                    </div>
                </div>

                <div v-if="cellRef.data.type === 'tm.Actor'" class="p-col-12 p-md-6">
                    <div class="p-field-checkbox">
                        <Checkbox
                            id="providesAuthentication"
                            v-model="cellRef.data.providesAuthentication"
                            @change="onChangeProperties()"
                        />
                        <label for="providesAuthentication">{{
                            $t('threatmodel.properties.providesAuthentication')
                        }}</label>
                    </div>
                </div>

                <div v-if="cellRef.data.type === 'tm.Flow'" class="p-col-12 p-md-6">
                    <div class="p-field">
                        <label for="protocol">{{ $t('threatmodel.properties.protocol') }}</label>
                        <InputText
                            id="protocol"
                            v-model="cellRef.data.protocol"
                            type="text"
                            @change="onChangeProperties()"
                        />
                    </div>
                </div>

                <div v-if="cellRef.data.type === 'tm.Flow'" class="p-col-12 p-md-6">
                    <div class="p-field-checkbox">
                        <Checkbox
                            id="isEncrypted"
                            v-model="cellRef.data.isEncrypted"
                            @change="onChangeProperties()"
                        />
                        <label for="isEncrypted">{{
                            $t('threatmodel.properties.isEncrypted')
                        }}</label>
                    </div>
                </div>

                <div v-if="cellRef.data.type === 'tm.Flow'" class="p-col-12 p-md-6">
                    <div class="p-field-checkbox">
                        <Checkbox
                            id="isPublicNetwork"
                            v-model="cellRef.data.isPublicNetwork"
                            @change="onChangeProperties()"
                        />
                        <label for="isPublicNetwork">{{
                            $t('threatmodel.properties.publicNetwork')
                        }}</label>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex';
import dataChanged from '@/service/x6/graph/data-changed.js';

export default {
    name: 'TdGraphProperties',
    computed: mapState({
        cellRef: (state) => state.cell.ref,
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
        },
    },
};
</script>

<style lang="scss" scoped>
    :deep(label) {
        font-size: 0.875rem;
        font-weight: 500;
        display: block;
        margin-bottom: 0.5rem;
    }

    .p-field {
        margin-bottom: 1rem;
    }

    .p-field-checkbox {
        margin-bottom: 0.5rem;
        display: flex;
        align-items: center;

        label {
            margin-left: 0.5rem;
            margin-bottom: 0;
        }
    }
</style>

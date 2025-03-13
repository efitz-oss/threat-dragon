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

        <div v-show="!cellRef" class="grid">
            <div class="col-12">
                <p>{{ $t('threatmodel.properties.emptyState') }}</p>
            </div>
        </div>

        <form v-if="!!cellRef && cellRef.data" class="p-fluid">
            <div class="grid">
                <div class="col-12 md:col-6">
                    <div class="field">
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

                <div v-if="cellRef.data.type !== 'tm.Text'" class="col-12 md:col-6">
                    <div class="field">
                        <label for="description">{{
                            $t('threatmodel.properties.description')
                        }}</label>
                        <Textarea
                            id="description"
                            v-model="cellRef.data.description"
                            @update:model-value="onChangeProperties()"
                        />
                    </div>
                </div>

                <div
                    v-if="
                        !cellRef.data.isTrustBoundary &&
                        cellRef.data.type !== 'tm.Text' &&
                        cellRef.data.type !== 'tm.Flow'
                    "
                    class="col-12 md:col-6"
                >
                    <div class="field">
                        <div class="field-checkbox">
                            <Checkbox
                                id="outofscope"
                                v-model="cellRef.data.outOfScope"
                                :binary="true"
                                @update:model-value="onChangeScope()"
                            />
                            <label for="outofscope">{{
                                $t('threatmodel.properties.outOfScope')
                            }}</label>
                        </div>
                    </div>
                </div>

                <div v-if="cellRef.data.type === 'tm.Flow'" class="col-12 md:col-6">
                    <div class="field">
                        <div class="field-checkbox">
                            <Checkbox
                                id="flowoutofscope"
                                v-model="cellRef.data.outOfScope"
                                :binary="true"
                                @update:model-value="onChangeScope()"
                            />
                            <label for="flowoutofscope">{{
                                $t('threatmodel.properties.outOfScope')
                            }}</label>
                        </div>
                        <div class="field-checkbox mt-2">
                            <Checkbox
                                id="bidirection"
                                v-model="cellRef.data.isBidirectional"
                                :binary="true"
                                @update:model-value="onChangeBidirection()"
                            />
                            <label for="bidirection">{{
                                $t('threatmodel.properties.bidirection')
                            }}</label>
                        </div>
                    </div>
                </div>

                <div
                    v-if="!cellRef.data.isTrustBoundary && cellRef.data.type !== 'tm.Text'"
                    class="col-12 md:col-6"
                >
                    <div class="field">
                        <label for="reasonoutofscope">{{
                            $t('threatmodel.properties.reasonOutOfScope')
                        }}</label>
                        <Textarea
                            id="reasonoutofscope"
                            v-model="cellRef.data.reasonOutOfScope"
                            :disabled="!cellRef.data.outOfScope"
                            @update:model-value="onChangeProperties()"
                        />
                    </div>
                </div>

                <div v-if="cellRef.data.type === 'tm.Process'" class="col-12 md:col-6">
                    <div class="field">
                        <label for="privilegelevel">{{
                            $t('threatmodel.properties.privilegeLevel')
                        }}</label>
                        <InputText
                            id="privilegelevel"
                            v-model="cellRef.data.privilegeLevel"
                            type="text"
                            @update:model-value="onChangeProperties()"
                        />
                    </div>
                </div>

                <div v-if="cellRef.data.type === 'tm.Process'" class="col-12 md:col-6">
                    <div class="field">
                        <div class="field-checkbox">
                            <Checkbox
                                id="handlesCardPayment"
                                v-model="cellRef.data.handlesCardPayment"
                                :binary="true"
                                @update:model-value="onChangeProperties()"
                            />
                            <label for="handlesCardPayment">{{
                                $t('threatmodel.properties.handlesCardPayment')
                            }}</label>
                        </div>
                        <div class="field-checkbox mt-2">
                            <Checkbox
                                id="handlesGoodsOrServices"
                                v-model="cellRef.data.handlesGoodsOrServices"
                                :binary="true"
                                @update:model-value="onChangeProperties()"
                            />
                            <label for="handlesGoodsOrServices">{{
                                $t('threatmodel.properties.handlesGoodsOrServices')
                            }}</label>
                        </div>
                    </div>
                </div>

                <div v-if="cellRef.data.type === 'tm.Process'" class="col-12 md:col-6">
                    <div class="field">
                        <div class="field-checkbox">
                            <Checkbox
                                id="isWebApplication"
                                v-model="cellRef.data.isWebApplication"
                                :binary="true"
                                @update:model-value="onChangeProperties()"
                            />
                            <label for="isWebApplication">{{
                                $t('threatmodel.properties.isWebApplication')
                            }}</label>
                        </div>
                    </div>
                </div>

                <div v-if="cellRef.data.type === 'tm.Store'" class="col-12 md:col-6">
                    <div class="field">
                        <div class="field-checkbox">
                            <Checkbox
                                id="isalog"
                                v-model="cellRef.data.isALog"
                                :binary="true"
                                @update:model-value="onChangeProperties()"
                            />
                            <label for="isalog">{{ $t('threatmodel.properties.isALog') }}</label>
                        </div>
                        <div class="field-checkbox mt-2">
                            <Checkbox
                                id="storesCredentials"
                                v-model="cellRef.data.storesCredentials"
                                :binary="true"
                                @update:model-value="onChangeProperties()"
                            />
                            <label for="storesCredentials">{{
                                $t('threatmodel.properties.storesCredentials')
                            }}</label>
                        </div>
                    </div>
                </div>

                <div v-if="cellRef.data.type === 'tm.Store'" class="col-12 md:col-6">
                    <div class="field">
                        <div class="field-checkbox">
                            <Checkbox
                                id="isEncrypted"
                                v-model="cellRef.data.isEncrypted"
                                :binary="true"
                                @update:model-value="onChangeProperties()"
                            />
                            <label for="isEncrypted">{{
                                $t('threatmodel.properties.isEncrypted')
                            }}</label>
                        </div>
                        <div class="field-checkbox mt-2">
                            <Checkbox
                                id="isSigned"
                                v-model="cellRef.data.isSigned"
                                :binary="true"
                                @update:model-value="onChangeProperties()"
                            />
                            <label for="isSigned">{{
                                $t('threatmodel.properties.isSigned')
                            }}</label>
                        </div>
                    </div>
                </div>

                <div v-if="cellRef.data.type === 'tm.Store'" class="col-12 md:col-6">
                    <div class="field">
                        <div class="field-checkbox">
                            <Checkbox
                                id="storesInventory"
                                v-model="cellRef.data.storesInventory"
                                :binary="true"
                                @update:model-value="onChangeProperties()"
                            />
                            <label for="storesInventory">{{
                                $t('threatmodel.properties.storesInventory')
                            }}</label>
                        </div>
                    </div>
                </div>

                <div v-if="cellRef.data.type === 'tm.Actor'" class="col-12 md:col-6">
                    <div class="field">
                        <div class="field-checkbox">
                            <Checkbox
                                id="providesAuthentication"
                                v-model="cellRef.data.providesAuthentication"
                                :binary="true"
                                @update:model-value="onChangeProperties()"
                            />
                            <label for="providesAuthentication">{{
                                $t('threatmodel.properties.providesAuthentication')
                            }}</label>
                        </div>
                    </div>
                </div>

                <div v-if="cellRef.data.type === 'tm.Flow'" class="col-12 md:col-6">
                    <div class="field">
                        <label for="protocol">{{ $t('threatmodel.properties.protocol') }}</label>
                        <InputText
                            id="protocol"
                            v-model="cellRef.data.protocol"
                            type="text"
                            @update:model-value="onChangeProperties()"
                        />
                    </div>
                </div>

                <div v-if="cellRef.data.type === 'tm.Flow'" class="col-12 md:col-6">
                    <div class="field">
                        <div class="field-checkbox">
                            <Checkbox
                                id="isEncrypted"
                                v-model="cellRef.data.isEncrypted"
                                :binary="true"
                                @update:model-value="onChangeProperties()"
                            />
                            <label for="isEncrypted">{{
                                $t('threatmodel.properties.isEncrypted')
                            }}</label>
                        </div>
                    </div>
                </div>

                <div v-if="cellRef.data.type === 'tm.Flow'" class="col-12 md:col-6">
                    <div class="field">
                        <div class="field-checkbox">
                            <Checkbox
                                id="isPublicNetwork"
                                v-model="cellRef.data.isPublicNetwork"
                                :binary="true"
                                @update:model-value="onChangeProperties()"
                            />
                            <label for="isPublicNetwork">{{
                                $t('threatmodel.properties.publicNetwork')
                            }}</label>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    </div>
</template>

<script setup>
    import { computed, nextTick } from 'vue';
    import dataChanged from '@/service/x6/graph/data-changed.js';
    import { useCellStore } from '@/stores/cell';

    // PrimeVue components
    import Checkbox from 'primevue/checkbox';
    import InputText from 'primevue/inputtext';
    import Textarea from 'primevue/textarea';

    // Store
    const cellStore = useCellStore();

    // Computed properties
    const cellRef = computed(() => cellStore.cellRef);

    // Methods
    const updateComponent = async () => {
        // Force a re-render by using nextTick
        await nextTick();
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

    const onChangeScope = () => {
        if (document.getElementById('reasonoutofscope')) {
            document.getElementById('reasonoutofscope').disabled = !cellRef.value.data.outOfScope;
        }
        dataChanged.updateProperties(cellRef.value);
        dataChanged.updateStyleAttrs(cellRef.value);
        updateComponent();
    };
</script>

<style lang="scss" scoped>
    @import '@/styles/primevue-variables.scss';

    label {
        font-size: 0.75rem !important;
        font-weight: 500;
        margin-bottom: 0.5rem;
    }

    .field {
        margin-bottom: 1rem;
    }

    .field-checkbox {
        display: flex;
        align-items: center;

        label {
            margin-left: 0.5rem;
            margin-bottom: 0;
        }
    }

    .mt-2 {
        margin-top: 0.5rem;
    }

    :deep(.p-inputtext) {
        width: 100%;
        padding: 0.5rem;
        border: 1px solid var(--surface-300);
        border-radius: 4px;

        &:focus {
            box-shadow: 0 0 0 2px var(--primary-color-transparent, rgba(55, 136, 216, 0.2));
            border-color: var(--primary-color, #3788d8);
        }

        &:disabled {
            background-color: var(--surface-200);
            opacity: 0.7;
        }
    }

    :deep(.p-checkbox) {
        width: 1.25rem;
        height: 1.25rem;

        .p-checkbox-box {
            border-radius: 4px;
        }
    }
</style>

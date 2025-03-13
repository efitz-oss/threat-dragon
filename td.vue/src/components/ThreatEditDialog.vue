<template>
    <div>
        <Dialog
            v-if="!!threat"
            v-model:visible="dialogVisible"
            :modal="true"
            :header="modalTitle"
            :style="{ width: '75vw' }"
            :closable="true"
            :close-on-escape="true"
        >
            <div class="p-fluid">
                <div class="grid">
                    <div class="col-12">
                        <div class="field">
                            <label for="title">{{ $t('threats.properties.title') }}</label>
                            <InputText id="title" v-model="threat.title" required />
                        </div>
                    </div>
                </div>

                <div class="grid">
                    <div class="col-12">
                        <div class="field">
                            <label for="threat-type">{{ $t('threats.properties.type') }}</label>
                            <Dropdown
                                id="threat-type"
                                v-model="threat.type"
                                :options="threatTypes"
                                placeholder="Select a threat type"
                            />
                        </div>
                    </div>
                </div>

                <div class="grid">
                    <div class="col-5">
                        <div class="field">
                            <label for="status">{{ $t('threats.properties.status') }}</label>
                            <div class="p-selectbutton-group">
                                <SelectButton
                                    id="status"
                                    v-model="threat.status"
                                    :options="statuses"
                                    option-label="text"
                                    option-value="value"
                                />
                            </div>
                        </div>
                    </div>

                    <div class="col-2">
                        <div class="field">
                            <label for="score">{{ $t('threats.properties.score') }}</label>
                            <InputText id="score" v-model="threat.score" />
                        </div>
                    </div>

                    <div class="col-5">
                        <div class="field">
                            <label for="priority">{{ $t('threats.properties.priority') }}</label>
                            <div class="p-selectbutton-group">
                                <SelectButton
                                    id="priority"
                                    v-model="threat.severity"
                                    :options="priorities"
                                    option-label="text"
                                    option-value="value"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div class="grid">
                    <div class="col-12">
                        <div class="field">
                            <label for="description">{{
                                $t('threats.properties.description')
                            }}</label>
                            <Textarea
                                id="description"
                                v-model="threat.description"
                                rows="5"
                                auto-resize
                            />
                        </div>
                    </div>
                </div>

                <div class="grid">
                    <div class="col-12">
                        <div class="field">
                            <label for="mitigation">{{
                                $t('threats.properties.mitigation')
                            }}</label>
                            <Textarea
                                id="mitigation"
                                v-model="threat.mitigation"
                                rows="5"
                                auto-resize
                            />
                        </div>
                    </div>
                </div>
            </div>

            <template #footer>
                <div class="dialog-footer">
                    <div class="left-buttons">
                        <Button
                            v-if="!newThreat"
                            severity="danger"
                            :label="$t('forms.delete')"
                            @click="confirmDelete()"
                        />
                        <Button
                            v-if="newThreat"
                            severity="danger"
                            :label="$t('forms.remove')"
                            @click="immediateDelete()"
                        />
                    </div>
                    <div class="right-buttons">
                        <Button
                            v-if="!newThreat"
                            severity="secondary"
                            :label="$t('forms.cancel')"
                            class="p-button-outlined mr-2"
                            @click="hideModal()"
                        />
                        <Button
                            severity="secondary"
                            :label="$t('forms.apply')"
                            @click="updateThreat()"
                        />
                    </div>
                </div>
            </template>
        </Dialog>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useConfirm } from 'primevue/useconfirm';

// PrimeVue components
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Dropdown from 'primevue/dropdown';
import SelectButton from 'primevue/selectbutton';
import Textarea from 'primevue/textarea';

// App imports
import dataChanged from '@/service/x6/graph/data-changed.js';
import threatModels from '@/service/threats/models/index.js';
import { useCellStore } from '@/stores/cell';
import { useThreatmodelStore } from '@/stores/threatmodel';

// Composables
const { t } = useI18n();
const confirm = useConfirm();
const cellStore = useCellStore();
const threatmodelStore = useThreatmodelStore();

// State
const dialogVisible = ref(false);
const threat = ref({});
const modelTypes = ['CIA', 'DIE', 'LINDDUN', 'PLOT4ai', 'STRIDE'];
const number = ref(0);
const newThreat = ref(false);

// Computed properties
const cellRef = computed(() => cellStore.cellRef);
const threatTop = computed(() => threatmodelStore.data.detail.threatTop);

const threatTypes = computed(() => {
    if (!cellRef.value || !threat.value || !threat.value.modelType) {
        return [];
    }

    const res = [];
    const types = threatModels.getThreatTypesByElement(
        threat.value.modelType,
        cellRef.value.data.type
    );
    Object.keys(types).forEach((type) => {
        res.push(t(type));
    });

    if (!res.includes(threat.value.type)) {
        res.push(threat.value.type);
    }

    return res;
});

const statuses = computed(() => [
    { value: 'NotApplicable', text: t('threats.status.notApplicable') },
    { value: 'Open', text: t('threats.status.open') },
    { value: 'Mitigated', text: t('threats.status.mitigated') },
]);

const priorities = computed(() => [
    { value: 'TBD', text: t('threats.priority.tbd') },
    { value: 'Low', text: t('threats.priority.low') },
    { value: 'Medium', text: t('threats.priority.medium') },
    { value: 'High', text: t('threats.priority.high') },
    { value: 'Critical', text: t('threats.priority.critical') },
]);

const modalTitle = computed(() => t('threats.edit') + ' #' + number.value);

// Methods
const editThreat = (threatId, state) => {
    const crnthreat = cellRef.value.data.threats.find((x) => x.id === threatId);
    threat.value = { ...crnthreat };

    if (!threat.value) {
        // this should never happen with a valid threatId
        console.warn('Trying to access a non-existent threatId: ' + threatId);
    } else {
        number.value = threat.value.number;
        newThreat.value = state === 'new';
        dialogVisible.value = true;
    }
};

const updateThreat = () => {
    const threatRef = cellRef.value.data.threats.find((x) => x.id === threat.value.id);

    if (threatRef) {
        const objRef = cellRef.value.data;

        if (!objRef.threatFrequency) {
            const tmpfreq = threatModels.getFrequencyMapByElement(
                threat.value.modelType,
                cellRef.value.data.type
            );

            if (tmpfreq !== null) {
                objRef.threatFrequency = tmpfreq;
            }
        }

        if (objRef.threatFrequency) {
            Object.keys(objRef.threatFrequency).forEach((k) => {
                if (
                    t(`threats.model.${threat.value.modelType.toLowerCase()}.${k}`) ===
                        threat.value.type
                ) {
                    objRef.threatFrequency[k]++;
                }
            });
        }

        threatRef.status = threat.value.status;
        threatRef.severity = threat.value.severity;
        threatRef.title = threat.value.title;
        threatRef.type = threat.value.type;
        threatRef.description = threat.value.description;
        threatRef.mitigation = threat.value.mitigation;
        threatRef.modelType = threat.value.modelType;
        threatRef.new = false;
        threatRef.number = number.value;
        threatRef.score = threat.value.score;

        cellStore.updateCellData(cellRef.value.data);
        threatmodelStore.setModified();
        dataChanged.updateStyleAttrs(cellRef.value);
    }

    hideModal();
};

const deleteThreat = () => {
    if (!threat.value.new) {
        const threatMap = cellRef.value.data.threatFrequency;
        Object.keys(threatMap).forEach((k) => {
            if (
                t(`threats.model.${threat.value.modelType.toLowerCase()}.${k}`) ===
                    threat.value.type
            ) {
                threatMap[k]--;
            }
        });
    }

    cellRef.value.data.threats = cellRef.value.data.threats.filter(
        (x) => x.id !== threat.value.id
    );
    cellRef.value.data.hasOpenThreats = cellRef.value.data.threats.length > 0;

    cellStore.updateCellData(cellRef.value.data);
    threatmodelStore.setModified();
    dataChanged.updateStyleAttrs(cellRef.value);
};

const hideModal = () => {
    dialogVisible.value = false;
};

const confirmDelete = async () => {
    return new Promise((resolve) => {
        confirm.require({
            message: t('threats.confirmDeleteMessage'),
            header: t('threats.confirmDeleteTitle'),
            icon: 'pi pi-exclamation-triangle',
            acceptClass: 'p-button-danger',
            acceptLabel: t('forms.delete'),
            rejectLabel: t('forms.cancel'),
            accept: () => {
                deleteThreat();
                hideModal();
                resolve(true);
            },
            reject: () => {
                resolve(false);
            },
        });
    });
};

const immediateDelete = () => {
    deleteThreat();
    hideModal();
};

// Expose methods to the template
defineExpose({
    editThreat,
});
</script>

<style lang="scss" scoped>
    @import '@/styles/primevue-variables.scss';

    :deep(.p-dialog-header) {
        background-color: var(--primary-color);
        color: white;
    }

    :deep(.p-dialog-content) {
        padding: 1.5rem;
    }

    .dialog-footer {
        display: flex;
        justify-content: space-between;
        width: 100%;
    }

    .left-buttons {
        display: flex;
        gap: 0.5rem;
    }

    .right-buttons {
        display: flex;
        gap: 0.5rem;
    }

    .mr-2 {
        margin-right: 0.5rem;
    }

    .field {
        margin-bottom: 1.5rem;
    }

    label {
        display: block;
        margin-bottom: 0.5rem;
        font-weight: 500;
    }

    .p-selectbutton-group {
        display: flex;
        flex-wrap: wrap;

        :deep(.p-selectbutton) {
            display: flex;

            .p-button {
                flex: 1;
            }
        }
    }

    @media (max-width: 768px) {
        :deep(.p-dialog) {
            width: 95vw !important;
            margin: 0 auto;
        }

        .grid {
            flex-direction: column;
        }

        .col-5,
        .col-2 {
            width: 100%;
            margin-bottom: 1rem;
        }
    }
</style>

<template>
    <div>
        <b-modal
            v-if="editingThreat"
            id="threat-edit"
            ref="editModal"
            size="lg"
            ok-variant="primary"
            header-bg-variant="primary"
            header-text-variant="light"
            :title="modalTitle"
            @hidden="onModalHidden"
        >
            <b-form>
                <b-form-row>
                    <b-col>
                        <b-form-group
                            id="title-group"
                            :label="$t('threats.properties.title')"
                            label-for="title"
                        >
                            <b-form-input
                                id="title"
                                v-model="editingThreat.title"
                                type="text"
                                required />
                        </b-form-group>
                    </b-col>
                </b-form-row>

                <b-form-row>
                    <b-col>
                        <b-form-group
                            id="threat-type-group"
                            :label="$t('threats.properties.type')"
                            label-for="threat-type"
                        >
                            <b-form-select
                                id="threat-type"
                                v-model="editingThreat.type"
                                :options="threatTypes"
                            />
                        </b-form-group>
                    </b-col>
                </b-form-row>

                <b-form-row class="threat-controls-row">
                    <b-col md="4" class="status-col">
                        <b-form-group
                            id="status-group"
                            :label="$t('threats.properties.status')"
                            label-for="status"
                            class="text-left"
                        >
                            <b-form-radio-group
                                id="status"
                                v-model="editingThreat.status"
                                :options="statuses"
                                buttons
                                size="sm"
                                button-variant="outline-secondary"
                                class="status-radio-group"
                            />
                        </b-form-group>
                    </b-col>

                    <b-col md="2" class="score-col">
                        <b-form-group
                            id="score-group"
                            :label="$t('threats.properties.score')"
                            label-for="score"
                            class="text-center"
                        >
                            <b-form-input 
                                id="score" 
                                v-model="editingThreat.score" 
                                type="text" 
                                class="text-center" 
                            />
                        </b-form-group>
                    </b-col>

                    <b-col md="6" class="priority-col">
                        <b-form-group
                            id="priority-group"
                            :label="$t('threats.properties.priority')"
                            label-for="priority"
                            class="text-right"
                        >
                            <b-form-radio-group
                                id="priority"
                                v-model="editingThreat.severity"
                                :options="priorities"
                                buttons
                                size="sm"
                                button-variant="outline-secondary"
                                class="priority-radio-group"
                            />
                        </b-form-group>
                    </b-col>
                </b-form-row>

                <b-form-row>
                    <b-col>
                        <b-form-group
                            id="description-group"
                            :label="$t('threats.properties.description')"
                            label-for="description"
                        >
                            <td-safe-form-textarea
                                id="description"
                                v-model="editingThreat.description"
                                rows="5"
                            />
                        </b-form-group>
                    </b-col>
                </b-form-row>

                <b-form-row>
                    <b-col>
                        <b-form-group
                            id="mitigation-group"
                            :label="$t('threats.properties.mitigation')"
                            label-for="mitigation"
                        >
                            <td-safe-form-textarea 
                                id="mitigation" 
                                v-model="editingThreat.mitigation" 
                                rows="5"
                            />
                        </b-form-group>
                    </b-col>
                </b-form-row>
            </b-form>

            <template #modal-footer>
                <div class="w-100 d-flex justify-content-between">
                    <div class="left-buttons">
                        <!-- Only show Delete button for existing threats -->
                        <b-button
                            v-if="!isNewThreat"
                            variant="danger"
                            @click="onDelete"
                        >
                            {{ $t('forms.delete') }}
                        </b-button>
                    </div>
                    <div class="right-buttons">
                        <b-button
                            variant="secondary"
                            class="mr-2"
                            @click="onCancel"
                        >
                            {{ $t('forms.cancel') }}
                        </b-button>
                        <b-button 
                            variant="primary" 
                            @click="onSave"
                        >
                            {{ isNewThreat ? $t('forms.create') : $t('forms.apply') }}
                        </b-button>
                    </div>
                </div>
            </template>
        </b-modal>
    </div>
</template>

<script>
import { ref, computed, watch } from 'vue';
import { useStore } from 'vuex';
import TdSafeFormTextarea from '@/components/TdFormTextareaWrapper.vue';
import threatModels from '@/service/threats/models/index.js';
import { useThreatEditor } from '@/composables/useThreatEditor';

/**
 * ThreatEditDialog Component
 * Responsible for editing individual threats within the threat model
 */
export default {
    name: 'TdThreatEditDialog',
    components: {
        TdSafeFormTextarea
    },
    setup() {
        const { 
            editingThreat,
            isEditing,
            isNewThreat,
            saveThreat,
            cancelEdit,
            deleteThreat,
            editExistingThreat
            // createNewThreat - Not used in this component
        } = useThreatEditor();
        
        const editModal = ref(null);
        
        // Get i18n function from component instance
        const $t = (key) => {
            return this.$t(key);
        };
        
        // Computed properties for form data
        const modalTitle = computed(() => {
            if (!editingThreat.value) return '';
            return isNewThreat.value 
                ? `${$t('threats.new')} #${editingThreat.value.number}` 
                : `${$t('threats.edit')} #${editingThreat.value.number}`;
        });
        
        const threatTypes = computed(() => {
            if (!editingThreat.value?.modelType) {
                return [];
            }
            
            const store = useStore();
            const cell = store.state.cell.ref;
            if (!cell || !cell.data) {
                return [];
            }

            const res = [];
            const threatTypesMap = threatModels.getThreatTypesByElement(
                editingThreat.value.modelType,
                cell.data.type
            );
            Object.keys(threatTypesMap).forEach((type) => {
                res.push($t(type));
            });
            if (!res.includes(editingThreat.value.type)) {
                res.push(editingThreat.value.type);
            }
            return res;
        });
        
        const statuses = computed(() => [
            { value: 'NotApplicable', text: $t('threats.status.notApplicable') },
            { value: 'Open', text: $t('threats.status.open') },
            { value: 'Mitigated', text: $t('threats.status.mitigated') }
        ]);
        
        const priorities = computed(() => [
            { value: 'TBD', text: $t('threats.priority.tbd') },
            { value: 'Low', text: $t('threats.priority.low') },
            { value: 'Medium', text: $t('threats.priority.medium') },
            { value: 'High', text: $t('threats.priority.high') },
            { value: 'Critical', text: $t('threats.priority.critical') }
        ]);
        
        // Methods
        const showDialog = (threatId, mode) => {
            if (mode === 'new') {
                // For new threats, the threatId is already for the in-memory threat
                // The threat has already been created by createNewThreat in GraphMeta
                // So we don't need to do anything here
            } else {
                // For existing threats, load from store
                editExistingThreat(threatId);
            }
            
            if (editModal.value) {
                editModal.value.show();
            }
        };
        
        // Event handlers
        const onSave = () => {
            saveThreat();
        };
        
        const onCancel = () => {
            cancelEdit();
            hideDialog();
        };
        
        const onDelete = async () => {
            // Due to how BV Modal works in the Composition API, we'll use the component instance
            // to access msgBoxConfirm
            const confirmed = await this.$bvModal.msgBoxConfirm(
                $t('threats.confirmDeleteMessage'),
                {
                    title: $t('threats.confirmDeleteTitle'),
                    okTitle: $t('forms.delete'),
                    cancelTitle: $t('forms.cancel'),
                    okVariant: 'danger'
                }
            );
            
            if (confirmed) {
                deleteThreat();
                hideDialog();
            }
        };
        
        const hideDialog = () => {
            if (editModal.value) {
                editModal.value.hide();
            }
        };
        
        const onModalHidden = () => {
            // If modal is closed via escape key or clicking outside
            if (isEditing.value) {
                cancelEdit();
            }
        };
        
        // Watch for isEditing changes
        watch(isEditing, (newValue) => {
            if (!newValue && editModal.value) {
                hideDialog();
            }
        });
        
        return {
            editModal,
            editingThreat,
            isNewThreat,
            modalTitle,
            threatTypes,
            statuses,
            priorities,
            showDialog,
            onSave,
            onCancel,
            onDelete,
            onModalHidden
        };
    }
};
</script>

<style lang="scss" scoped>
    /* --- Modal Form Styling --- */
    
    /* Consistent spacing between form rows */
    :deep(.form-row) {
        margin-bottom: 1.25rem;
    }
    
    /* Form group styling */
    :deep(.form-group) {
        margin-bottom: 0.75rem;
    }
    
    /* Label styling */
    :deep(label) {
        font-size: 0.9rem;
        font-weight: 500;
        margin-bottom: 0.5rem;
    }
    
    /* Input controls */
    :deep(.form-control) {
        padding: 0.5rem 0.75rem;
        line-height: 1.5;
    }
    
    /* Textarea styling - consistent with the GraphProperties component */
    :deep(textarea.form-control) {
        height: auto !important;
        resize: none !important;
        min-height: 100px;
    }
    
    /* Status, Score, Priority row styling */
    .threat-controls-row {
        display: flex;
        flex-wrap: nowrap;
        align-items: flex-start;
        
        .status-col {
            display: flex;
            justify-content: flex-start;
            
            :deep(.form-group) {
                width: 100%;
            }
            
            :deep(.status-radio-group) {
                display: flex;
                justify-content: flex-start;
                max-width: 100%;
                
                .btn {
                    padding: 0.375rem 0.5rem;
                    font-size: 0.8rem;
                }
            }
        }
        
        .score-col {
            display: flex;
            justify-content: center;
            
            :deep(.form-group) {
                width: 100%;
                text-align: center;
            }
        }
        
        .priority-col {
            display: flex;
            justify-content: flex-end;
            
            :deep(.form-group) {
                width: 100%;
                text-align: right;
            }
            
            :deep(.priority-radio-group) {
                display: flex;
                justify-content: flex-end;
                max-width: 100%;
                
                .btn {
                    padding: 0.375rem 0.5rem;
                    font-size: 0.8rem;
                }
            }
        }
    }
    
    /* Radio/button group styling */
    :deep(.btn-group) {
        margin-top: 0.25rem;
        display: flex;
        flex-wrap: nowrap;
    }
    
    /* Style the radio buttons to fit within width */
    :deep(.btn-group .btn) {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        font-size: 0.8rem;
        padding: 0.375rem 0.4rem;
        flex: 0 1 auto;
        min-width: auto;
    }
    
    /* Make buttons in priority and status group more compact */
    :deep(.status-radio-group .btn),
    :deep(.priority-radio-group .btn) {
        max-width: 90px; /* Prevent buttons from growing too wide */
    }
    
    /* Make small screens stack properly */
    @media (max-width: 767.98px) {
        .threat-controls-row {
            flex-direction: column;
            
            .status-col,
            .score-col,
            .priority-col {
                margin-bottom: 1rem;
                width: 100%;
                max-width: 100%;
                flex: 0 0 100%;
                
                :deep(.form-group) {
                    text-align: left;
                }
                
                :deep(.status-radio-group),
                :deep(.priority-radio-group) {
                    justify-content: flex-start;
                }
            }
        }
    }
    
    /* --- Modal Footer Styling --- */
    
    /* Footer button layout */
    :deep(.modal-footer) {
        padding: 1rem;
    }
    
    /* Button groups */
    .left-buttons,
    .right-buttons {
        display: flex;
        align-items: center;
    }
    
    /* Button styling */
    :deep(.btn) {
        padding: 0.5rem 1rem;
        min-width: 90px;
    }
    
    /* Responsive button layout for small screens */
    @media (max-width: 575.98px) {
        .w-100.d-flex {
            flex-direction: column;
            gap: 1rem;
        }
        
        .left-buttons,
        .right-buttons {
            width: 100%;
            justify-content: center;
        }
    }
</style>
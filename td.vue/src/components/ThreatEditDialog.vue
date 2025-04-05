<template>
    <div>
        <b-modal
            v-if="!!threat"
            id="threat-edit"
            ref="editModal"
            size="lg"
            ok-variant="primary"
            header-bg-variant="primary"
            header-text-variant="light"
            :title="modalTitle"
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
                                v-model="threat.title"
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
                                v-model="threat.type"
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
                                v-model="threat.status"
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
                            <b-form-input id="score" v-model="threat.score" type="text" class="text-center" />
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
                                v-model="threat.severity"
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
                                v-model="threat.description"
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
                                v-model="threat.mitigation" 
                                rows="5"
                            />
                        </b-form-group>
                    </b-col>
                </b-form-row>
            </b-form>

            <template #modal-footer>
                <div class="w-100 d-flex justify-content-between">
                    <div class="left-buttons">
                        <b-button
                            v-if="!newThreat"
                            variant="danger"
                            @click="confirmDelete()"
                        >
                            {{ $t('forms.delete') }}
                        </b-button>
                        <b-button
                            v-if="newThreat"
                            variant="danger"
                            @click="immediateDelete()"
                        >
                            {{ $t('forms.remove') }}
                        </b-button>
                    </div>
                    <div class="right-buttons">
                        <b-button
                            variant="secondary"
                            class="mr-2"
                            @click="hideModal()"
                        >
                            {{ $t('forms.cancel') }}
                        </b-button>
                        <b-button 
                            variant="secondary" 
                            @click="updateThreat()"
                        >
                            {{ $t('forms.apply') }}
                        </b-button>
                    </div>
                </div>
            </template>
        </b-modal>
    </div>
</template>

<script>
import { mapState } from 'vuex';

import { CELL_DATA_UPDATED } from '@/store/actions/cell.js';
import TdSafeFormTextarea from '@/components/TdFormTextareaWrapper.vue';
import tmActions from '@/store/actions/threatmodel.js';
import dataChanged from '@/service/x6/graph/data-changed.js';
import threatModels from '@/service/threats/models/index.js';

/**
 * ThreatEditDialog Component
 * Responsible for editing individual threats within the threat model
 */
export default {
    name: 'TdThreatEditDialog',
    components: {
        TdSafeFormTextarea
    },
    data() {
        return {
            threat: {},
            modelTypes: ['CIA', 'DIE', 'LINDDUN', 'PLOT4ai', 'STRIDE'],
            number: 0,
            newThreat: false
        };
    },
    computed: {
        ...mapState({
            cellRef: (state) => state.cell.ref,
            threatTop: (state) => state.threatmodel.data.detail.threatTop
        }),
        threatTypes() {
            if (!this.cellRef || !this.threat || !this.threat.modelType) {
                return [];
            }

            const res = [];
            const threatTypes = threatModels.getThreatTypesByElement(
                this.threat.modelType,
                this.cellRef.data.type
            );
            Object.keys(threatTypes).forEach((type) => {
                res.push(this.$t(type));
            }, this);
            if (!res.includes(this.threat.type)) res.push(this.threat.type);
            return res;
        },
        statuses() {
            return [
                { value: 'NotApplicable', text: this.$t('threats.status.notApplicable') },
                { value: 'Open', text: this.$t('threats.status.open') },
                { value: 'Mitigated', text: this.$t('threats.status.mitigated') }
            ];
        },
        priorities() {
            return [
                { value: 'TBD', text: this.$t('threats.priority.tbd') },
                { value: 'Low', text: this.$t('threats.priority.low') },
                { value: 'Medium', text: this.$t('threats.priority.medium') },
                { value: 'High', text: this.$t('threats.priority.high') },
                { value: 'Critical', text: this.$t('threats.priority.critical') }
            ];
        },
        modalTitle() {
            return this.$t('threats.edit') + ' #' + this.number;
        }
    },
    methods: {
        editThreat(threatId, state) {
            const crnthreat = this.cellRef.data.threats.find((x) => x.id === threatId);
            this.threat = { ...crnthreat };
            if (!this.threat) {
                // this should never happen with a valid threatId
                console.warn('Trying to access a non-existent threatId: ' + threatId);
            } else {
                this.number = this.threat.number;
                // Set newThreat flag based on state parameter or threat.new property
                this.newThreat = state === 'new' || (this.threat && this.threat.new === true);
                console.debug('Setting newThreat flag to:', this.newThreat, 'for threat:', threatId);
                this.$refs.editModal.show();
            }
        },
        updateThreat() {
            console.debug('Updating threat, newThreat flag:', this.newThreat);
            
            const threatRef = this.cellRef.data.threats.find((x) => x.id === this.threat.id);
            if (threatRef) {
                const objRef = this.cellRef.data;
                if (!objRef.threatFrequency) {
                    const tmpfreq = threatModels.getFrequencyMapByElement(
                        this.threat.modelType,
                        this.cellRef.data.type
                    );
                    if (tmpfreq !== null) objRef.threatFrequency = tmpfreq;
                }
                if (objRef.threatFrequency) {
                    Object.keys(objRef.threatFrequency).forEach((k) => {
                        if (
                            this.$t(
                                `threats.model.${this.threat.modelType.toLowerCase()}.${k}`
                            ) === this.threat.type
                        )
                            objRef.threatFrequency[k]++;
                    });
                }
                
                // Update the threat properties
                threatRef.status = this.threat.status;
                threatRef.severity = this.threat.severity;
                threatRef.title = this.threat.title;
                threatRef.type = this.threat.type;
                threatRef.description = this.threat.description;
                threatRef.mitigation = this.threat.mitigation;
                threatRef.modelType = this.threat.modelType;
                threatRef.number = this.number;
                threatRef.score = this.threat.score;
                
                // Mark as no longer new once saved
                threatRef.new = false;
                console.debug('Threat saved, new flag set to false for ID:', threatRef.id);
                
                // Update the store and UI
                this.$store.dispatch(CELL_DATA_UPDATED, this.cellRef.data);
                this.$store.dispatch(tmActions.modified);
                dataChanged.updateStyleAttrs(this.cellRef);
            } else {
                console.warn('Could not find threat with ID:', this.threat.id);
            }
            
            // Close the modal
            this.hideModal();
        },
        deleteThreat() {
            if (!this.threat.new) {
                const threatMap = this.cellRef.data.threatFrequency;
                Object.keys(threatMap).forEach((k) => {
                    if (
                        this.$t(`threats.model.${this.threat.modelType.toLowerCase()}.${k}`) ===
                            this.threat.type
                    )
                        threatMap[k]--;
                });
            }
            this.cellRef.data.threats = this.cellRef.data.threats.filter(
                (x) => x.id !== this.threat.id
            );
            this.cellRef.data.hasOpenThreats = this.cellRef.data.threats.length > 0;
            this.$store.dispatch(CELL_DATA_UPDATED, this.cellRef.data);
            this.$store.dispatch(tmActions.modified);
            dataChanged.updateStyleAttrs(this.cellRef);
        },
        hideModal() {
            console.debug('Hide modal called. newThreat:', this.newThreat, 'threat ID:', this.threat?.id);
            
            // If this is a new threat and hasn't been saved yet (i.e., Cancel button clicked),
            // we need to remove it completely
            if (this.newThreat && this.threat && this.threat.id) {
                console.debug('Removing new threat with ID:', this.threat.id);
                
                // Remove from the cell's threats
                const originalLength = this.cellRef.data.threats.length;
                this.cellRef.data.threats = this.cellRef.data.threats.filter(
                    (x) => x.id !== this.threat.id
                );
                const removedCount = originalLength - this.cellRef.data.threats.length;
                console.debug('Removed threats:', removedCount);
                
                if (removedCount > 0) {
                    // Update open threats status
                    this.cellRef.data.hasOpenThreats = this.cellRef.data.threats.some(
                        (t) => t.status === 'Open'
                    );
                    
                    // Update the store and UI
                    this.$store.dispatch(CELL_DATA_UPDATED, this.cellRef.data);
                    this.$store.dispatch(tmActions.modified);
                    dataChanged.updateStyleAttrs(this.cellRef);
                    console.debug('Updated cell data after threat removal');
                } else {
                    console.warn('Failed to remove new threat, it may have already been removed');
                }
            }
            
            // Hide the modal
            this.$refs.editModal.hide();
        },
        async confirmDelete() {
            const confirmed = await this.$bvModal.msgBoxConfirm(
                this.$t('threats.confirmDeleteMessage'),
                {
                    title: this.$t('threats.confirmDeleteTitle'),
                    okTitle: this.$t('forms.delete'),
                    cancelTitle: this.$t('forms.cancel'),
                    okVariant: 'danger'
                }
            );

            if (!confirmed) {
                return;
            }

            this.deleteThreat();
            this.hideModal();
        },
        async immediateDelete() {
            this.deleteThreat();
            this.hideModal();
        }
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

<template>
    <b-modal
        id="add-new-branch"
        size="md"
        ok-variant="primary"
        header-bg-variant="primary"
        header-text-variant="light"
        :title="modalTitle"
        visible
        centered
        hide-footer
        @hide="closeDialog"
    >
        <form @submit.prevent="addBranch">
            <b-row>
                <b-col lg="12" class="pb-2">
                    <b-form-group
                        id="input-group-1"
                        :label="t('branch.name')"
                        label-for="branchName"
                    >
                        <b-form-input
                            id="branchName"
                            v-model="newBranchName"
                            type="text"
                            :state="isError"
                            lazy-formatter
                            trim
                            required
                            @input="validate"
                        />
                        <b-form-invalid-feedback :state="isError">
                            {{ branchNameError }}
                        </b-form-invalid-feedback>
                    </b-form-group>
                </b-col>
            </b-row>
            <b-row>
                <b-col lg="12" class="pb-2">
                    <b-form-group
                        id="input-group-2"
                        :label="t('branch.refBranch')"
                        label-for="refBranch"
                    >
                        <b-form-select
                            id="refBranch"
                            v-model="refBranch"
                            :options="branchNames"
                            size="md"
                            required
                        />
                    </b-form-group>
                </b-col>
            </b-row>
        </form>
        <hr />
        <div class="d-flex justify-content-end">
            <b-overlay
                :show="wait"
                variant="light"
                blur="true"
                opacity="0.8"
                spinner-small>
                <b-button
                    variant="primary"
                    type="submit"
                    class="m-1"
                    @click="addBranch">
                    {{ t('branch.add') }}
                </b-button>
            </b-overlay>
            <b-button variant="secondary" class="m-1" @click="closeDialog">
                {{ t('branch.cancel') }}
            </b-button>
        </div>
    </b-modal>
</template>
<script>
import { ref, computed, watch, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useI18n } from '@/i18n';
import branchActions from '@/store/actions/branch.js';

export default {
    name: 'AddBranchModal',
    props: {
        branches: {
            type: Array,
            validator: (value) => {
                return value.every((branch) => {
                    return (
                        typeof branch === 'string' ||
                            (branch.value && typeof branch.value === 'string')
                    );
                });
            },
            required: true
        }
    },
    emits: ['close-dialog'],
    setup(props, { emit }) {
        const { t } = useI18n();
        const store = useStore();
        
        // Reactive state
        const newBranchName = ref('');
        const refBranch = ref('');
        const modalTitle = t('branch.addNew');
        const branchNameError = ref('');
        const isError = ref(null);
        const wait = ref(false);
        
        // Computed properties
        const branchNames = computed(() => {
            return props.branches.map((branch) => branch.value || branch);
        });
        
        // Watchers
        watch(() => props.branches, (newBranches) => {
            if (newBranches.length > 0) {
                refBranch.value = branchNames.value.slice(-1)[0];
            }
        });
        
        // Lifecycle hooks
        onMounted(() => {
            refBranch.value = branchNames.value.slice(-1)[0];
        });
        
        // Methods
        const closeDialog = () => {
            emit('close-dialog');
        };
        
        const validate = () => {
            if (newBranchName.value === '') {
                branchNameError.value = t('branch.nameRequired');
                isError.value = false;
            } else if (branchNames.value.includes(newBranchName.value)) {
                branchNameError.value = t('branch.nameExists');
                isError.value = false;
            } else {
                branchNameError.value = '';
                isError.value = true;
            }
        };
        
        const addBranch = async () => {
            wait.value = true;
            validate();
            if (!isError.value) {
                wait.value = false;
                return;
            }
            
            store.dispatch(branchActions.create, {
                branchName: newBranchName.value,
                refBranch: refBranch.value
            });

            // sometimes the branch is not immediately available, so we wait for it (only for 30 seconds)
            for (let i = 0; i < 30; i++) {
                await store.dispatch(branchActions.fetch, 1);
                if (branchNames.value.includes(newBranchName.value)) {
                    break;
                }
                await new Promise((resolve) => setTimeout(resolve, 1000));
            }

            wait.value = false;
            closeDialog();
        };
        
        return {
            // State
            newBranchName,
            refBranch,
            modalTitle,
            branchNameError,
            isError,
            wait,
            
            // Computed
            branchNames,
            
            // Methods
            closeDialog,
            validate,
            addBranch,
            
            // i18n
            t
        };
    }
};
</script>

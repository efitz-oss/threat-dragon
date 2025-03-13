<template>
    <Dialog
        v-model:visible="visible"
        class="branch-dialog p-fluid"
        :header="$t('branch.addNew')"
        :modal="true"
    >
        <form @submit.prevent="addBranch">
            <div class="field">
                <label for="branchName">{{ $t('branch.name') }}</label>
                <InputText
                    id="branchName"
                    v-model="newBranchName"
                    :class="{ 'p-invalid': isError === false }"
                    required
                    @input="validate"
                />
                <small v-if="isError === false" class="p-error">{{ branchNameError }}</small>
            </div>
            <div class="field">
                <label for="refBranch">{{ $t('branch.refBranch') }}</label>
                <Dropdown
                    id="refBranch"
                    v-model="refBranch"
                    :options="branchNames"
                    option-label="value"
                    required
                />
            </div>
        </form>
        <template #footer>
            <Button
                :label="$t('branch.cancel')"
                icon="pi pi-times"
                class="p-button-text"
                @click="closeDialog"
            />
            <Button
                :label="$t('branch.add')"
                icon="pi pi-check"
                :loading="wait"
                @click="addBranch"
            />
        </template>
    </Dialog>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useBranchStore } from '@/stores/branch';
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Dropdown from 'primevue/dropdown';
import i18n from '@/i18n/index.js';

const props = defineProps({
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
        required: true,
    },
});

const emit = defineEmits(['close-dialog']);

const visible = ref(true);
const newBranchName = ref('');
const refBranch = ref('');
const branchNameError = ref('');
const isError = ref(null);
const wait = ref(false);

const branchStore = useBranchStore();

const branchNames = computed(() => {
    return props.branches.map((branch) => branch.value || branch);
});

onMounted(() => {
    refBranch.value = branchNames.value.slice(-1)[0];
});

watch(
    () => props.branches,
    (newBranches) => {
        if (newBranches.length > 0) {
            refBranch.value = branchNames.value.slice(-1)[0];
        }
    }
);

const closeDialog = () => {
    visible.value = false;
    emit('close-dialog');
};

const validate = () => {
    if (newBranchName.value === '') {
        branchNameError.value = i18n.global.t('branch.nameRequired');
        isError.value = false;
    } else if (branchNames.value.includes(newBranchName.value)) {
        branchNameError.value = i18n.global.t('branch.nameExists');
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

    await branchStore.createBranch({
        branchName: newBranchName.value,
        refBranch: refBranch.value,
    });

    // sometimes the branch is not immediately available, so we wait for it (only for 30 seconds)
    for (let i = 0; i < 30; i++) {
        await branchStore.fetchBranches(1);
        if (branchNames.value.includes(newBranchName.value)) {
            break;
        }
        await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    wait.value = false;
    closeDialog();
};
</script>

<style lang="scss" scoped>
    .branch-dialog {
        width: 450px;
    }
</style>

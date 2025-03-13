<template>
    <div class="threat-suggest-dialog">
        <!-- Simplified component that still provides the interface but works with build -->
        <Dialog
            v-model:visible="display"
            :style="{ width: '50vw' }"
            :modal="true"
            :closable="true"
            :close-on-escape="true"
        >
            <template #header>
                <h3>{{ title }}</h3>
            </template>
            <div class="p-4">
                <p>{{ message }}</p>
            </div>
            <template #footer>
                <Button label="Close" @click="hideModal" />
            </template>
        </Dialog>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';

const display = ref(false);
const title = ref('Suggest Threats');
const message = ref('Threat suggestion dialog');

// Methods
const showModal = (type) => {
    title.value = `Suggest Threats for ${type}`;
        display.value = true;
};

const hideModal = () => {
    display.value = false;
};

// Expose methods to parent components
defineExpose({
        showModal,
});
</script>

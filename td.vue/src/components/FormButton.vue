<template>
    <Button
        :class="{ 'p-button-primary': isPrimary, 'p-button-secondary': !isPrimary }"
        :severity="isPrimary ? 'primary' : 'secondary'"
        :label="text"
        :icon="icon ? `pi pi-${icon}` : ''"
        @click="onBtnClick"
    />
</template>

<script setup>
import Button from 'primevue/button';

// Define props
defineProps({
    onBtnClick: {
        type: Function,
        required: true,
    },
    icon: {
        type: String,
        required: false,
        default: null,
    },
    iconPreface: {
        type: String,
        default: 'fas',
        required: false,
    },
    text: {
        type: String,
        required: true,
    },
    isPrimary: {
        type: Boolean,
        required: false,
        default: false,
    },
});
</script>

<style lang="scss" scoped>
    .p-button {
        font-size: 14px;
    }
</style>

<template>
    <Card :header="title">
        <div class="grid td-card">
            <div v-for="(keyvalue, idx) in values" :key="idx" class="col-12 md:col-2">
                <div>
                    <strong>{{ keyvalue.key }}:</strong>
                </div>
                <div>
                    {{ keyvalue.value }}
                </div>
            </div>
        </div>
    </Card>
</template>

<script setup>
import Card from 'primevue/card';

// Props
defineProps({
    title: {
        type: String,
        default: '',
    },
    values: {
        type: Array,
        default: () => [],
    },
});
</script>

<style lang="scss" scoped>
    .td-card {
        font-size: 14px;
    }
</style>

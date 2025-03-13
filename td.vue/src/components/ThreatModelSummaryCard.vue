<template>
    <td-key-value-card
        :title="`${titlePrefix ? titlePrefix + ' ' : ''}${model.summary.title}`"
        :values="overviewCardData"
    />
</template>

<script setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useThreatmodelStore } from '@/stores/threatmodel';

import TdKeyValueCard from '@/components/KeyValueCard.vue';

// Define props
defineProps({
    titlePrefix: {
        type: String,
        required: false,
    },
});

// Composables
const { t } = useI18n();
const threatmodelStore = useThreatmodelStore();

// Computed properties
const model = computed(() => threatmodelStore.data);

const overviewCardData = computed(() => {
    const kvs = [];
    kvs.push({ key: t('threatmodel.owner'), value: model.value.summary.owner });
    kvs.push({ key: t('threatmodel.reviewer'), value: model.value.detail.reviewer });
    kvs.push({
        key: t('threatmodel.contributors'),
        value: model.value.detail.contributors.map((x) => x.name).join(', '),
    });
    return kvs;
});
</script>

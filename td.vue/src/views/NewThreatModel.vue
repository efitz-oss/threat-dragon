<template>
    <div />
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import isElectron from 'is-electron';
import { getProviderType } from '@/service/provider/providers.js';
import { useProviderStore } from '@/stores/provider';
import { useThreatmodelStore } from '@/stores/threatmodel';
import { useAppStore } from '@/stores/app';

// Composables
const route = useRoute();
const router = useRouter();
const providerStore = useProviderStore();
const threatmodelStore = useThreatmodelStore();
const appStore = useAppStore();

// Computed
const providerType = computed(() => getProviderType(providerStore.selected));
const version = computed(() => appStore.packageBuildVersion);

// Lifecycle
onMounted(() => {
    threatmodelStore.clear();
    const newTm = {
        version: version.value,
        summary: {
            title: 'New Threat Model',
            owner: '',
            description: '',
            id: 0,
        },
        detail: {
            contributors: [],
            diagrams: [],
            diagramTop: 0,
            reviewer: '',
            threatTop: 0,
        },
    };

    threatmodelStore.setSelected(newTm);
    const params = Object.assign({}, route.params, {
        threatmodel: newTm.summary.title,
    });

    if (isElectron()) {
        // tell the desktop server that the model has changed
        window.electronAPI.modelOpened(newTm.summary.title);
    }

    if (providerType.value === 'local' || providerType.value === 'desktop') {
        router.replace({ name: `${providerType.value}ThreatModelEdit`, params });
    } else {
        router.replace({ name: `${providerType.value}ThreatModelCreate`, params });
    }
});
</script>

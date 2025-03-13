<template>
    <td-selection-page
        :items="threatModels"
        :on-item-click="onThreatmodelClick"
        :empty-state-text="$t('threatmodelSelect.newThreatModel')"
        :on-empty-state-click="newThreatModel"
    >
        {{ $t('threatmodelSelect.select') }}
        <!-- Fixme: The href should get the configured hostname from env -->
        <a :href="`${providerUri}/${repoName}`" target="_blank" rel="noopener noreferrer">{{
            `${repoName}/${branch}`
        }}</a>
        {{ $t('threatmodelSelect.from') }}
        <a id="return-to-branch" href="javascript:void(0)" @click="selectBranchClick">{{
            $t('threatmodelSelect.branch')
        }}</a>
        {{ $t('threatmodelSelect.or') }}
        <a id="return-to-repo" href="javascript:void(0)" @click="selectRepoClick">{{
            $t('threatmodelSelect.repo')
        }}</a>
        {{ $t('threatmodelSelect.or') }}
        <a id="new-threat-model" href="javascript:void(0)" @click="newThreatModel">{{
            $t('threatmodelSelect.newThreatModel')
        }}</a>
    </td-selection-page>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useProviderStore } from '@/stores/provider';
import { useRepoStore } from '@/stores/repository';
import { useBranchStore } from '@/stores/branch';
import { useThreatmodelStore } from '@/stores/threatmodel';
import { getProviderType } from '@/service/provider/providers.js';
import TdSelectionPage from '@/components/SelectionPage.vue';

// Composables
const route = useRoute();
const router = useRouter();
const providerStore = useProviderStore();
const repoStore = useRepoStore();
const branchStore = useBranchStore();
const threatmodelStore = useThreatmodelStore();

// Computed properties
const branch = computed(() => branchStore.selected);
const provider = computed(() => providerStore.selected);
const providerType = computed(() => getProviderType(providerStore.selected));
const providerUri = computed(() => providerStore.providerUri);
const repoName = computed(() => repoStore.selected);
const threatModels = computed(() => threatmodelStore.all);
const selectedModel = computed(() => threatmodelStore.data);

// Methods
const selectBranchClick = () => {
    branchStore.clear();
    router.push({
        name: 'gitBranch',
        params: {
            provider: provider.value,
            repository: repoName.value,
        },
    });
};

const selectRepoClick = () => {
    repoStore.clear();
    router.push({
        name: 'gitRepository',
        params: {
            provider: provider.value,
        },
    });
};

const onThreatmodelClick = async (threatmodel) => {
    await threatmodelStore.fetchModel(threatmodel);
    const params = Object.assign({}, route.params, { threatmodel });
    threatmodelStore.setSelected(selectedModel.value);
    router.push({
        name: `${providerType.value}ThreatModel`,
        params,
    });
};

const newThreatModel = () => {
    threatmodelStore.clear();
    const newTm = {
        version: '2.3.0',
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
    threatmodelStore.createModel(newTm);
    const params = Object.assign({}, route.params, {
        threatmodel: newTm.summary.title,
    });
    router.push({
        name: `${providerType.value}ThreatModelEdit`,
        params,
    });
};

// Lifecycle
onMounted(() => {
    if (provider.value !== route.params.provider) {
        providerStore.selectProvider(route.params.provider);
    }

    if (repoName.value !== route.params.repository) {
        repoStore.selectRepository(route.params.repository);
    }

    if (branch.value !== route.params.branch) {
        branchStore.selectBranch(route.params.branch);
    }

    threatmodelStore.fetchAll();
});
</script>

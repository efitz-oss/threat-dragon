<template>
    <td-selection-page
        :items="threatModels"
        :on-item-click="onThreatmodelClick"
        :empty-state-text="t('threatmodelSelect.newThreatModel')"
        :on-empty-state-click="newThreatModel"
    >
        {{ t('threatmodelSelect.select') }}
        <!-- Fixme: The href should get the configured hostname from env -->
        <a :href="`${providerUri}/${repoName}`" target="_blank" rel="noopener noreferrer">{{
            `${repoName}/${branch}`
        }}</a>
        {{ t('threatmodelSelect.from') }}
        <a id="return-to-branch" href="javascript:void(0)" @click="selectBranchClick">{{
            t('threatmodelSelect.branch')
        }}</a>
        {{ t('threatmodelSelect.or') }}
        <a id="return-to-repo" href="javascript:void(0)" @click="selectRepoClick">{{
            t('threatmodelSelect.repo')
        }}</a>
        {{ t('threatmodelSelect.or') }}
        <a id="new-threat-model" href="javascript:void(0)" @click="newThreatModel">{{
            t('threatmodelSelect.newThreatModel')
        }}</a>
    </td-selection-page>
</template>

<script>
import { computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from '@/i18n';

import branchActions from '@/store/actions/branch.js';
import { getProviderType } from '@/service/provider/providers.js';
import providerActions from '@/store/actions/provider.js';
import repoActions from '@/store/actions/repository.js';
import TdSelectionPage from '@/components/SelectionPage.vue';
import tmActions from '@/store/actions/threatmodel.js';

export default {
    name: 'ThreatModelSelect',
    components: {
        TdSelectionPage
    },
    setup() {
        const store = useStore();
        const route = useRoute();
        const router = useRouter();
        const { t } = useI18n();

        // Computed properties
        const branch = computed(() => store.state.branch.selected);
        const provider = computed(() => store.state.provider.selected);
        const providerType = computed(() => getProviderType(store.state.provider.selected));
        const providerUri = computed(() => store.state.provider.providerUri);
        const repoName = computed(() => store.state.repo.selected);
        const threatModels = computed(() => store.state.threatmodel.all);
        const selectedModel = computed(() => store.state.threatmodel.data);

        onMounted(() => {
            // Provider is now managed via meta.provider in the route configuration
            // and router navigation guard will set it in the store

            if (repoName.value !== route.params.repository) {
                store.dispatch(repoActions.selected, route.params.repository);
            }

            if (branch.value !== route.params.branch) {
                store.dispatch(branchActions.selected, route.params.branch);
            }

            store.dispatch(tmActions.fetchAll);
        });

        // Methods
        const selectBranchClick = () => {
            store.dispatch(branchActions.clear);
            router.push({
                name: 'gitBranch',
                params: { provider: provider.value, repository: repoName.value }
            });
        };

        const selectRepoClick = () => {
            store.dispatch(repoActions.clear);
            router.push({ name: 'gitRepository', params: { provider: provider.value } });
        };

        const onThreatmodelClick = async (threatmodel) => {
            await store.dispatch(tmActions.fetch, threatmodel);
            const params = Object.assign({}, route.params, { threatmodel });
            store.dispatch(tmActions.selected, selectedModel.value);
            router.push({ name: `${providerType.value}ThreatModel`, params });
        };

        const newThreatModel = () => {
            store.dispatch(tmActions.clear);
            const newTm = {
                version: '2.3.0',
                summary: {
                    title: 'New Threat Model',
                    owner: '',
                    description: '',
                    id: 0
                },
                detail: {
                    contributors: [],
                    diagrams: [],
                    diagramTop: 0,
                    reviewer: '',
                    threatTop: 0
                }
            };
            store.dispatch(tmActions.create, newTm);
            const params = Object.assign({}, route.params, {
                threatmodel: newTm.summary.title
            });
            router.push({ name: `${providerType.value}ThreatModelEdit`, params });
        };

        return {
            branch,
            provider,
            providerType,
            providerUri,
            repoName,
            threatModels,
            selectedModel,
            selectBranchClick,
            selectRepoClick,
            onThreatmodelClick,
            newThreatModel,
            t
        };
    }
};
</script>

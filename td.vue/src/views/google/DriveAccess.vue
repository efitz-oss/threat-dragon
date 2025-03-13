<template>
    <td-selection-page
        :items="folders"
        :page="page"
        :page-next="pageNext"
        :page-prev="pagePrev"
        :on-item-click="onFolderClick"
        :on-back-click="navigateBack"
        :paginate="paginate"
        :show-back-item="!!parentId"
        is-google-provider
        :empty-state-text="`${$t('folder.noneFound')}`"
    >
        {{ $t('folder.select') }} {{ $t(`providers.${provider}.displayName`) }}
        {{ $t('folder.from') }}
        {{ $t('threatmodelSelect.or') }}
        <a id="new-threat-model" href="javascript:void(0)" @click="newThreatModel(selected)">{{
            $t('threatmodelSelect.newThreatModel')
        }}</a>
    </td-selection-page>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useProviderStore } from '@/stores/provider';
import { useFolderStore } from '@/stores/folder';
import { useThreatmodelStore } from '@/stores/threatmodel';
import { getProviderType } from '@/service/provider/providers.js';
import TdSelectionPage from '@/components/SelectionPage.vue';

// Composables
const route = useRoute();
const router = useRouter();
const providerStore = useProviderStore();
const folderStore = useFolderStore();
const threatmodelStore = useThreatmodelStore();

// Computed
const provider = computed(() => providerStore.selected);
const providerType = computed(() => getProviderType(providerStore.selected));
const folders = computed(() => folderStore.all);
const selected = computed(() => folderStore.selected);
const page = computed(() => folderStore.page);
const pageNext = computed(() => folderStore.pageNext);
const pagePrev = computed(() => folderStore.pagePrev);
const parentId = computed(() => folderStore.parentId);
const selectedModel = computed(() => threatmodelStore.data);

// Methods
const onFolderClick = async (folder) => {
    const prevfolder = selected.value;
    folderStore.selectFolder(folder);
    if (folder.mimeType == 'application/json') {
        await threatmodelStore.fetchModel(folder.id);
        const params = Object.assign({}, route.params, {
            folder: prevfolder,
            threatmodel: folder.name,
        });
        threatmodelStore.setSelected(selectedModel.value);
        router.push({ name: `${providerType.value}ThreatModel`, params });
    }
};

const paginate = (pageNum) => {
    folderStore.fetch({ page: pageNum });
};

const navigateBack = () => {
    folderStore.navigateBack();
};

const newThreatModel = (folderId) => {
    const params = Object.assign({}, route.params, {
        folder: folderId,
    });

    const routeName = `${providerType.value}${route.query.action === 'create' ? 'NewThreatModel' : 'ThreatModelSelect'}`;
    router.push({ name: routeName, params });
};

// Lifecycle
onMounted(() => {
    if (provider.value !== route.params.provider) {
        providerStore.selectProvider(route.params.provider);
    }

    let pageNum = 1;
    if (route.query.page) {
        pageNum = route.query.page;
    }

    folderStore.fetch({ page: pageNum });
});
</script>

<template>
    <td-selection-page
        :filter="searchQuery"
        :items="repositories"
        :page="page"
        :page-next="pageNext"
        :page-prev="pagePrev"
        :on-item-click="onRepoClick"
        :paginate="paginate"
        :empty-state-text="`${$t('repository.noneFound')} ${$t('providers.' + provider + '.displayName')}`"
        @update:filter="searchQuery = $event"
    >
        {{ $t('repository.select') }} {{ $t(`providers.${provider}.displayName`) }}
        {{ $t('repository.from') }}
    </td-selection-page>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useProviderStore } from '@/stores/provider';
import { useRepoStore } from '@/stores/repository';
import { getProviderType } from '@/service/provider/providers.js';
import TdSelectionPage from '@/components/SelectionPage.vue';

// Composables
const route = useRoute();
const router = useRouter();
const providerStore = useProviderStore();
const repoStore = useRepoStore();

// State
const searchQuery = ref('');
const searchTimeout = ref(null);

// Computed
const provider = computed(() => providerStore.selected);
const providerType = computed(() => getProviderType(providerStore.selected));
const repositories = computed(() => repoStore.all);
const page = computed(() => Number(repoStore.page));
const pageNext = computed(() => repoStore.pageNext);
const pagePrev = computed(() => repoStore.pagePrev);

// Watch
watch(searchQuery, (newQuery) => {
    clearTimeout(searchTimeout.value);
    searchTimeout.value = setTimeout(() => {
        console.log('Suche nach:', newQuery);
        repoStore.fetch({
            page: 1,
            searchQuery: newQuery,
        });
    }, 500);
});

// Methods
const onRepoClick = (repoName) => {
    repoStore.selectRepository(repoName);
    const params = Object.assign({}, route.params, {
        repository: repoName,
    });
    router.push({ name: `${providerType.value}Branch`, params, query: route.query });
};

const paginate = (pageNum) => {
    repoStore.fetch(pageNum, searchQuery.value);
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

    repoStore.fetch(pageNum);
});
</script>

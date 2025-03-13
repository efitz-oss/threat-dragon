<template>
    <td-selection-page
        :items="branches"
        :page="page"
        :page-next="pageNext"
        :page-prev="pagePrev"
        :on-item-click="onBranchClick"
        :paginate="paginate"
    >
        {{ $t('branch.select') }}
        <!-- Fixme: The href should get the configured hostname from env -->
        <a
            id="repo_link"
            :href="`${providerUri}/${repoName}`"
            target="_blank"
            rel="noopener noreferrer"
            >{{ repoName }}</a
        >
        {{ $t('branch.from') }}
        <a id="return-to-repo" href="javascript:void(0)" @click="selectRepoClick">
            {{ $t('branch.chooseRepo') }}
        </a>
        {{ $t('branch.or') }}
        <a id="new-branch" href="javascript:void(0)" @click="toggleNewBranchDialog()">{{
            $t('branch.addNew')
        }}</a>

        <add-branch-modal
            v-if="showNewBranchDialog"
            :branches="branches"
            @close-dialog="toggleNewBranchDialog()"
        />
    </td-selection-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useProviderStore } from '@/stores/provider';
import { useRepoStore } from '@/stores/repository';
import { useBranchStore } from '@/stores/branch';
import { getProviderType } from '@/service/provider/providers.js';
import TdSelectionPage from '@/components/SelectionPage.vue';
import AddBranchModal from '@/components/AddBranchDialog.vue';

// Composables
const route = useRoute();
const router = useRouter();
const providerStore = useProviderStore();
const repoStore = useRepoStore();
const branchStore = useBranchStore();

// State
const showNewBranchDialog = ref(false);

// Computed properties
const branches = computed(() =>
    branchStore.all.map((branch) => {
        if (branch['protected']) {
            return {
                value: branch.name,
                icon: 'lock',
                iconTooltip: 'branch.protectedBranch',
            };
        }
        return branch.name;
    })
);
const provider = computed(() => providerStore.selected);
const providerType = computed(() => getProviderType(providerStore.selected));
const providerUri = computed(() => providerStore.providerUri);
const repoName = computed(() => repoStore.selected);
const page = computed(() => Number(branchStore.page));
const pageNext = computed(() => branchStore.pageNext);
const pagePrev = computed(() => branchStore.pagePrev);

// Methods
const selectRepoClick = () => {
    repoStore.clear();
    router.push({ name: `${providerType.value}Repository` });
};

const onBranchClick = (branch) => {
    branchStore.selectBranch(branch);
    const params = Object.assign({}, route.params, {
        branch,
    });

    const routeName = `${providerType.value}${route.query.action === 'create' ? 'NewThreatModel' : 'ThreatModelSelect'}`;
    router.push({ name: routeName, params });
};

const paginate = (pageNum) => {
    branchStore.fetch(pageNum);
};

const toggleNewBranchDialog = () => {
    showNewBranchDialog.value = !showNewBranchDialog.value;
};

// Lifecycle
onMounted(() => {
    if (provider.value !== route.params.provider) {
        providerStore.selectProvider(route.params.provider);
    }

    if (repoName.value !== route.params.repository) {
        repoStore.selectRepository(route.params.repository);
    }

    branchStore.fetch(1);
});
</script>

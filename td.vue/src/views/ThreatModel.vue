<template>
    <div v-if="!!model && model.summary">
        <div id="title_row" class="row mb-4">
            <div class="col">
                <td-threat-model-summary-card />
            </div>
        </div>

        <!-- Description -->
        <div class="row mb-4">
            <div class="col">
                <div class="card">
                    <div class="card-header">{{ $t('threatmodel.description') }}</div>
                    <div class="card-body">
                        <div class="row tm-card">
                            <div class="col">
                                <p id="tm_description">
                                    {{
                                        model.summary.description || $t('threatmodel.noDescription')
                                    }}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Diagrams -->
        <div class="row mb-4">
            <div v-for="(diagram, idx) in diagrams" :key="idx" class="col-lg-3 tm_diagram">
                <div class="card">
                    <div class="card-header">
                        <h6 class="diagram-header-text">
                            <a href="#" class="diagram-edit" @click.prevent="editDiagram(diagram)">
                                {{ diagram.title }}
                            </a>
                        </h6>
                    </div>
                    <div class="card-body">
                        <a href="#" @click.prevent="editDiagram(diagram)">
                            <img
                                class="m-auto d-block td-diagram-thumb"
                                :src="getThumbnailUrl(diagram)"
                                :alt="diagram.title"
                            />
                        </a>
                        <h6 v-if="diagram.description" class="diagram-description-text">
                            {{ diagram.description }}
                        </h6>
                    </div>
                </div>
            </div>
        </div>

        <div class="row">
            <div class="col text-right">
                <div class="btn-group">
                    <td-form-button
                        id="td-edit-btn"
                        :is-primary="true"
                        :on-btn-click="onEditClick"
                        icon="edit"
                        :text="$t('forms.edit')"
                    />
                    <td-form-button
                        id="td-report-btn"
                        :on-btn-click="onReportClick"
                        icon="file-alt"
                        :text="$t('forms.report')"
                    />
                    <td-form-button
                        id="td-close-btn"
                        :on-btn-click="onCloseClick"
                        icon="times"
                        :text="$t('forms.closeModel')"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useProviderStore } from '@/stores/provider';
import { useThreatmodelStore } from '@/stores/threatmodel';
import { useAppStore } from '@/stores/app';
import { getProviderType } from '@/service/provider/providers.js';
import TdFormButton from '@/components/FormButton.vue';
import TdThreatModelSummaryCard from '@/components/ThreatModelSummaryCard.vue';

// Composables
const route = useRoute();
const router = useRouter();
const providerStore = useProviderStore();
const threatmodelStore = useThreatmodelStore();
const appStore = useAppStore();

// Computed properties
const model = computed(() => threatmodelStore.data);
const providerType = computed(() => getProviderType(providerStore.selected));
const version = computed(() => appStore.packageBuildVersion);
const diagrams = computed(() => {
        if (!model.value || !model.value.detail || !model.value.detail.diagrams) {
            return [];
        }
    return model.value.detail.diagrams;
});

// Methods
const onEditClick = (evt) => {
    evt.preventDefault();
    router.push({ name: `${providerType.value}ThreatModelEdit`, params: route.params });
};

const onReportClick = (evt) => {
    evt.preventDefault();
    router.push({ name: `${providerType.value}Report`, params: route.params });
};

const onCloseClick = (evt) => {
    evt.preventDefault();
    threatmodelStore.clear();
    router.push('/dashboard');
};

const getThumbnailUrl = (diagram) => {
    if (!diagram || !diagram.diagramType) {
        return '../assets/thumbnail.jpg';
    }
    return `../assets/thumbnail.${diagram.diagramType.toLowerCase()}.jpg`;
};

const editDiagram = (diagram) => {
    threatmodelStore.selectDiagram(diagram);
    const path = `${route.path}/edit/${encodeURIComponent(diagram.title)}`;
    router.push(path);
};

// Lifecycle
onMounted(() => {
    // make sure we are compatible with version 1.x and early 2.x
    const threatTop =
            model.value.detail.threatTop === undefined ? 100 : model.value.detail.threatTop;
    const diagramTop =
            model.value.detail.diagramTop === undefined ? 10 : model.value.detail.diagramTop;
    const update = { diagramTop: diagramTop, version: version.value, threatTop: threatTop };
    console.debug(`updates: ${JSON.stringify(update)}`);
    threatmodelStore.updateModel(update);
    // if a diagram has just been closed, the history insists on marking the model as modified
    threatmodelStore.setNotModified();
});
</script>

<style lang="scss" scoped>
    @import '@/styles/primevue-variables.scss';

    .tm-card {
        font-size: 14px;
        white-space: pre-wrap;
    }
    .diagram-header-text a {
        color: $black;
    }

    .diagram-description-text a {
        color: $black;
    }

    .td-diagram-thumb {
        max-width: 200px;
        max-height: 160px;
    }
</style>

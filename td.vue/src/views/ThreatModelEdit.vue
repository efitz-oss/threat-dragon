<template>
    <div class="grid">
        <div class="col-12" v-if="model && model.summary">
            <Card id="parent-card">
                <template #header>
                    <div class="card-header">{{ $t('threatmodel.editing') }}: {{ model.summary.title }}</div>
                </template>
                <template #content>
                    <form @submit="onSubmit" class="p-fluid">
                        <div class="grid">
                            <div class="col-12">
                                <div class="field">
                                    <label for="title">{{ $t('threatmodel.title') }}</label>
                                    <InputText
                                        id="title"
                                        v-model="model.summary.title"
                                        type="text"
                                        required
                                        @update:modelValue="onModifyModel()"
                                    />
                                </div>
                            </div>

                            <div class="col-12 md:col-6">
                                <div class="field">
                                    <label for="owner">{{ $t('threatmodel.owner') }}</label>
                                    <InputText
                                        id="owner"
                                        v-model="model.summary.owner"
                                        type="text"
                                        @update:modelValue="onModifyModel()"
                                    />
                                </div>
                            </div>

                            <div class="col-12 md:col-6">
                                <div class="field">
                                    <label for="reviewer">{{ $t('threatmodel.reviewer') }}</label>
                                    <InputText
                                        id="reviewer"
                                        v-model="model.detail.reviewer"
                                        type="text"
                                        @update:modelValue="onModifyModel()"
                                    />
                                </div>
                            </div>

                            <div class="col-12">
                                <div class="field">
                                    <label for="description">{{ $t('threatmodel.description') }}</label>
                                    <Textarea
                                        id="description"
                                        v-model="model.summary.description"
                                        rows="4"
                                        @update:modelValue="onModifyModel()"
                                    />
                                </div>
                            </div>

                            <div class="col-12">
                                <div class="field">
                                    <label for="contributors">{{ $t('threatmodel.contributors') }}</label>
                                    <Chips
                                        id="contributors"
                                        v-model="contributors"
                                        :placeholder="$t('threatmodel.contributorsPlaceholder')"
                                        separator=",;"
                                        @update:modelValue="onModifyModel()"
                                    />
                                </div>
                            </div>

                            <div class="col-12">
                                <h5>{{ $t('threatmodel.diagram.diagrams') }}</h5>
                            </div>

                            <div 
                                v-for="(diagram, idx) in model.detail.diagrams" 
                                :key="idx" 
                                class="col-12 md:col-8 mb-3"
                            >
                                <div :id="`diagram-group-${idx}`" class="p-inputgroup">
                                    <Button
                                        class="select-diagram-type"
                                        severity="secondary"
                                        :label="model.detail.diagrams[idx].diagramType"
                                        @click="menu.toggle($event)"
                                    />
                                    <Menu :id="`diagram-type-menu-${idx}`" :model="getDiagramMenuItems(idx)" :popup="true" />
                                    
                                    <InputText
                                        v-model="model.detail.diagrams[idx].title"
                                        type="text"
                                        class="td-diagram"
                                    />
                                    <InputText
                                        v-model="model.detail.diagrams[idx].description"
                                        :placeholder="model.detail.diagrams[idx].placeholder"
                                        type="text"
                                        class="td-diagram-description"
                                    />
                                    <Button
                                        severity="secondary"
                                        class="td-remove-diagram"
                                        @click="onRemoveDiagramClick(idx)"
                                    >
                                        <font-awesome-icon icon="times" class="mr-1" />
                                        {{ $t('forms.remove') }}
                                    </Button>
                                </div>
                            </div>

                            <div class="col-12 md:col-6">
                                <a
                                    href="javascript:void(0)"
                                    class="add-diagram-link m-2"
                                    @click="onAddDiagramClick"
                                >
                                    <font-awesome-icon icon="plus" class="mr-1" />
                                    {{ $t('threatmodel.diagram.addNewDiagram') }}
                                </a>
                            </div>

                            <div class="col-12 text-right mt-5">
                                <span class="p-buttonset">
                                    <td-form-button
                                        id="td-save-btn"
                                        :is-primary="true"
                                        :on-btn-click="onSaveClick"
                                        icon="save"
                                        :text="$t('forms.save')"
                                    />
                                    <td-form-button
                                        id="td-reload-btn"
                                        :on-btn-click="onReloadClick"
                                        icon="undo"
                                        :text="$t('forms.reload')"
                                    />
                                    <td-form-button
                                        id="td-close-btn"
                                        :on-btn-click="onCloseClick"
                                        icon="times"
                                        :text="$t('forms.close')"
                                    />
                                </span>
                            </div>
                        </div>
                    </form>
                </template>
            </Card>
        </div>
    </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useProviderStore } from '@/stores/provider';
import { useThreatmodelStore } from '@/stores/threatmodel';
import { useAppStore } from '@/stores/app';
import { getProviderType } from '@/service/provider/providers.js';
import TdFormButton from '@/components/FormButton.vue';

// PrimeVue components
import Card from 'primevue/card';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import Chips from 'primevue/chips';
import Button from 'primevue/button';
import Menu from 'primevue/menu';
import { useConfirm } from 'primevue/useconfirm';
import { useToast } from 'primevue/usetoast';

// Composables
const route = useRoute();
const router = useRouter();
const providerStore = useProviderStore();
const threatmodelStore = useThreatmodelStore();
const appStore = useAppStore();
const confirm = useConfirm();
const toast = useToast();
const menu = ref();

// Computed
const fileHandle = computed(() => threatmodelStore.fileHandle);
const fileName = computed(() => threatmodelStore.fileName);
const model = computed(() => threatmodelStore.data);
const providerType = computed(() => getProviderType(providerStore.selected));
const diagramTop = computed(() => threatmodelStore.data.detail.diagramTop);
const version = computed(() => appStore.packageBuildVersion);
const modelChanged = computed(() => threatmodelStore.modelChanged);

// Contributors is a special case with getter/setter
const contributorsValue = ref(threatmodelStore.contributors);
const contributors = computed({
    get() {
        return threatmodelStore.contributors;
    },
    set(value) {
        threatmodelStore.updateContributors(value);
        contributorsValue.value = value;
    },
});

// Methods
const init = () => {
    threatmodelStore.setNotModified();
};

const onSubmit = () => {
    // noop
};

const onSaveClick = async (evt) => {
    evt.preventDefault();
    if (route.name === 'gitThreatModelCreate' || route.name === 'googleThreatModelCreate') {
        await threatmodelStore.createModel();
    } else {
        await threatmodelStore.saveModel();
    }
    // stop the save button from leaving the threat model edit view
    // router.push({ name: `${providerType.value}ThreatModel`, params: route.params });
};

const onReloadClick = async (evt) => {
    evt.preventDefault();
    await restoreAsync();
};

const onCloseClick = async (evt) => {
    evt.preventDefault();
    if (await restoreAsync()) {
        router.push({ name: `${providerType.value}ThreatModel`, params: route.params });
    }
};

const onAddDiagramClick = (evt) => {
    evt.preventDefault();
    const newDiagram = {
        id: diagramTop.value,
        title: $t('threatmodel.diagram.stride.defaultTitle'),
        diagramType: 'STRIDE',
        placeholder: $t('threatmodel.diagram.stride.defaultDescription'),
        thumbnail: './public/content/images/thumbnail.stride.jpg',
        version: version.value,
        cells: [],
    };
    threatmodelStore.updateModel({ diagramTop: diagramTop.value + 1 });
    model.value.detail.diagrams.push(newDiagram);
    threatmodelStore.setModified();
};

const onDiagramTypeClick = (idx, type) => {
    let defaultTitle;
    let placeholder;
    let thumbnail;
    switch (type) {
    case 'CIA':
        thumbnail = './public/content/images/thumbnail.cia.jpg';
        defaultTitle = $t('threatmodel.diagram.cia.defaultTitle');
        placeholder = $t('threatmodel.diagram.cia.defaultDescription');
        break;

    case 'DIE':
        thumbnail = './public/content/images/thumbnail.die.jpg';
        defaultTitle = $t('threatmodel.diagram.die.defaultTitle');
        placeholder = $t('threatmodel.diagram.die.defaultDescription');
        break;

    case 'LINDDUN':
        thumbnail = './public/content/images/thumbnail.linddun.jpg';
        defaultTitle = $t('threatmodel.diagram.linddun.defaultTitle');
        placeholder = $t('threatmodel.diagram.linddun.defaultDescription');
        break;

    case 'PLOT4ai':
        thumbnail = './public/content/images/thumbnail.plot4ai.jpg';
        defaultTitle = $t('threatmodel.diagram.plot4ai.defaultTitle');
        placeholder = $t('threatmodel.diagram.plot4ai.defaultDescription');
        break;

    case 'STRIDE':
        thumbnail = './public/content/images/thumbnail.stride.jpg';
        defaultTitle = $t('threatmodel.diagram.stride.defaultTitle');
        placeholder = $t('threatmodel.diagram.stride.defaultDescription');
        break;

    default:
        thumbnail = './public/content/images/thumbnail.jpg';
        defaultTitle = $t('threatmodel.diagram.generic.defaultTitle');
        placeholder = $t('threatmodel.diagram.generic.defaultDescription');
        type = $t('threatmodel.diagram.generic.select');
    }
    model.value.detail.diagrams[idx].diagramType = type;
    model.value.detail.diagrams[idx].placeholder = placeholder;
    model.value.detail.diagrams[idx].thumbnail = thumbnail;

    // if the diagram title is still default, then change it to the new default title
    if (
        model.value.detail.diagrams[idx].title === $t('threatmodel.diagram.cia.defaultTitle') ||
            model.value.detail.diagrams[idx].title === $t('threatmodel.diagram.die.defaultTitle') ||
            model.value.detail.diagrams[idx].title ===
                $t('threatmodel.diagram.linddun.defaultTitle') ||
            model.value.detail.diagrams[idx].title ===
                $t('threatmodel.diagram.plot4ai.defaultTitle') ||
            model.value.detail.diagrams[idx].title ===
                $t('threatmodel.diagram.stride.defaultTitle') ||
            model.value.detail.diagrams[idx].title ===
                $t('threatmodel.diagram.generic.defaultTitle')
    ) {
        model.value.detail.diagrams[idx].title = defaultTitle;
    }
    threatmodelStore.setModified();
};

const onRemoveDiagramClick = (idx) => {
    model.value.detail.diagrams.splice(idx, 1);
    threatmodelStore.setModified();
};

const onModifyModel = () => {
    threatmodelStore.setModified();
};

const getDiagramMenuItems = (idx) => {
    return [
        {
            label: $t('threatmodel.diagram.cia.select'),
            command: () => onDiagramTypeClick(idx, 'CIA')
        },
        {
            label: $t('threatmodel.diagram.die.select'),
            command: () => onDiagramTypeClick(idx, 'DIE')
        },
        {
            label: $t('threatmodel.diagram.linddun.select'),
            command: () => onDiagramTypeClick(idx, 'LINDDUN')
        },
        {
            label: $t('threatmodel.diagram.plot4ai.select'),
            command: () => onDiagramTypeClick(idx, 'PLOT4ai')
        },
        {
            label: $t('threatmodel.diagram.stride.select'),
            command: () => onDiagramTypeClick(idx, 'STRIDE')
        },
        {
            label: $t('threatmodel.diagram.generic.select'),
            command: () => onDiagramTypeClick(idx, 'Generic')
        }
    ];
};

const getConfirmModal = () => {
    return new Promise((resolve) => {
        confirm.require({
            message: $t('forms.discardMessage'),
            header: $t('forms.discardTitle'),
            icon: 'pi pi-exclamation-triangle',
            acceptClass: 'p-button-danger',
            acceptLabel: $t('forms.ok'),
            rejectLabel: $t('forms.cancel'),
            accept: () => resolve(true),
            reject: () => resolve(false)
        });
    });
};

const restoreAsync = async () => {
    if (!modelChanged.value || (await getConfirmModal())) {
        await threatmodelStore.closeDiagram();
        threatmodelStore.restoreModel();
        threatmodelStore.setNotModified();
        return true;
    }
    return false;
};

// Lifecycle
onMounted(() => {
    init();
});
</script>

<style lang="scss" scoped>
    @import '@/styles/primevue-variables.scss';

    .add-diagram-link {
        color: $orange;
        font-size: 14px;
    }

    .remove-diagram-btn {
        font-size: 12px;
    }

    .select-diagram-type {
        font-size: 12px;
    }
</style>

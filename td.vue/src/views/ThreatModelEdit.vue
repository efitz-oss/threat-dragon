<template>
    <b-row>
        <b-col v-if="model && model.summary">
            <b-card
                id="parent-card"
                :header="`${$t('threatmodel.editing')}: ${model.summary.title}`"
            >
                <b-form @submit="onSubmit">
                    <b-form-row>
                        <b-col>
                            <b-form-group
                                id="title-group"
                                :label="$t('threatmodel.title') + ' *'"
                                label-for="title"
                                class="required-field"
                            >
                                <b-form-input
                                    id="title"
                                    v-model="model.summary.title"
                                    type="text"
                                    required
                                    @input="onModifyModel()"
                                />
                            </b-form-group>
                        </b-col>
                    </b-form-row>
                    <b-form-row>
                        <b-col md="6">
                            <b-form-group
                                id="owner-group"
                                :label="$t('threatmodel.owner')"
                                label-for="owner"
                            >
                                <b-form-input
                                    id="owner"
                                    v-model="model.summary.owner"
                                    type="text"
                                    @input="onModifyModel()"
                                />
                            </b-form-group>
                        </b-col>
                        <b-col md="6">
                            <b-form-group
                                id="reviewer-group"
                                :label="$t('threatmodel.reviewer')"
                                label-for="reviewer"
                            >
                                <b-form-input
                                    id="reviewer"
                                    v-model="model.detail.reviewer"
                                    type="text"
                                    @input="onModifyModel()"
                                />
                            </b-form-group>
                        </b-col>
                    </b-form-row>
                    <b-form-row>
                        <b-col>
                            <b-form-group
                                id="description-group"
                                :label="$t('threatmodel.description')"
                                label-for="description"
                            >
                                <td-safe-form-textarea
                                    id="description"
                                    v-model="model.summary.description"
                                    type="text"
                                    rows="3"
                                    @input="onModifyModel()"
                                />
                            </b-form-group>
                        </b-col>
                    </b-form-row>
                    <b-form-row>
                        <b-col>
                            <b-form-group
                                id="contributors-group"
                                :label="$t('threatmodel.contributors')"
                                label-for="contributors"
                            >
                                <b-form-tags
                                    id="contributors"
                                    v-model="contributors"
                                    :placeholder="$t('threatmodel.contributorsPlaceholder')"
                                    variant="primary"
                                    separator=",;"
                                    tag-class="mx-2"
                                    @input="onModifyModel()"
                                />
                            </b-form-group>
                        </b-col>
                    </b-form-row>
                    <b-form-row>
                        <b-col>
                            <h5>{{ $t('threatmodel.diagram.diagrams') }}</h5>
                        </b-col>
                    </b-form-row>
                    <b-form-row>
                        <b-col v-for="(diagram, idx) in model.detail.diagrams" :key="idx" md="8">
                            <div class="diagram-inputs">
                                <b-dropdown
                                    variant="secondary"
                                    class="select-diagram-type"
                                    :text="model.detail.diagrams[idx].diagramType"
                                >
                                    <b-dropdown-item-button
                                        @click="onDiagramTypeClick(idx, 'CIA')"
                                    >
                                        {{ $t('threatmodel.diagram.cia.select') }}
                                    </b-dropdown-item-button>
                                    <b-dropdown-item-button
                                        @click="onDiagramTypeClick(idx, 'DIE')"
                                    >
                                        {{ $t('threatmodel.diagram.die.select') }}
                                    </b-dropdown-item-button>
                                    <b-dropdown-item-button
                                        @click="onDiagramTypeClick(idx, 'LINDDUN')"
                                    >
                                        {{ $t('threatmodel.diagram.linddun.select') }}
                                    </b-dropdown-item-button>
                                    <b-dropdown-item-button
                                        @click="onDiagramTypeClick(idx, 'PLOT4ai')"
                                    >
                                        {{ $t('threatmodel.diagram.plot4ai.select') }}
                                    </b-dropdown-item-button>
                                    <b-dropdown-item-button
                                        @click="onDiagramTypeClick(idx, 'STRIDE')"
                                    >
                                        {{ $t('threatmodel.diagram.stride.select') }}
                                    </b-dropdown-item-button>
                                    <b-dropdown-item-button
                                        @click="onDiagramTypeClick(idx, 'Generic')"
                                    >
                                        {{ $t('threatmodel.diagram.generic.select') }}
                                    </b-dropdown-item-button>
                                </b-dropdown>
                                <b-form-input
                                    v-model="model.detail.diagrams[idx].title"
                                    type="text"
                                    class="diagram-title"
                                    placeholder="Diagram title"
                                />
                                <b-form-input
                                    v-model="model.detail.diagrams[idx].description"
                                    :placeholder="model.detail.diagrams[idx].placeholder"
                                    type="text"
                                    class="diagram-description"
                                />
                                <b-button
                                    variant="secondary"
                                    class="remove-diagram-btn"
                                    @click="onRemoveDiagramClick(idx)"
                                >
                                    <font-awesome-icon icon="times" />
                                    {{ $t('forms.remove') }}
                                </b-button>
                            </div>
                        </b-col>
                    </b-form-row>
                    <b-form-row>
                        <b-col md="6">
                            <a
                                href="javascript:void(0)"
                                class="add-diagram-link m-2"
                                @click="onAddDiagramClick"
                            >
                                <font-awesome-icon icon="plus" />
                                {{ $t('threatmodel.diagram.addNewDiagram') }}
                            </a>
                        </b-col>
                    </b-form-row>

                    <b-form-row>
                        <b-col class="text-right mt-5">
                            <BButtonGroup>
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
                            </BButtonGroup>
                        </b-col>
                    </b-form-row>
                    <small class="text-muted mt-3">* {{ $t('forms.requiredField') }}</small>
                </b-form>
            </b-card>
        </b-col>
    </b-row>
</template>

<script>
import { mapState } from 'vuex';
import { getProviderType } from '@/service/provider/providers.js';
import TdFormButton from '@/components/FormButton.vue';
import TdSafeFormTextarea from '@/components/TdFormTextareaWrapper.vue';
import tmActions from '@/store/actions/threatmodel.js';
export default {
    name: 'ThreatModelEdit',
    components: {
        TdFormButton,
        TdSafeFormTextarea
    },
    computed: {
        ...mapState({
            fileHandle: (state) => state.threatmodel.fileHandle,
            fileName: (state) => state.threatmodel.fileName,
            fileId: (state) => state.threatmodel.fileId,
            model: (state) => state.threatmodel.data,
            providerType: (state) => getProviderType(state.provider.selected),
            diagramTop: (state) => state.threatmodel.data.detail.diagramTop,
            version: (state) => state.packageBuildVersion
        }),
        contributors: {
            get() {
                return this.$store.getters.contributors;
            },
            set(contributors) {
                this.$store.dispatch(tmActions.contributorsUpdated, contributors);
            }
        }
    },
    async mounted() {
        this.init();
        // If fileId is passed in route params, store it in the threatmodel state
        if (this.$route && this.$route.params && this.$route.params.fileId) {
            this.$store.dispatch(tmActions.update, { fileId: this.$route.params.fileId });
            console.debug('File ID stored from route params:', this.$route.params.fileId);
        }
        
        // For Google Drive provider, check that we have model data
        if (this.providerType === 'google' && (!this.model || !this.model.summary)) {
            console.debug('Google provider detected but missing model data, attempting to load from fileId:', this.fileId);
            
            // If we have a fileId but no model data, try to fetch the model data
            if (this.fileId) {
                try {
                    // Try to directly fetch the model data using the stored fileId
                    console.debug('Attempting to fetch model data from Google Drive fileId:', this.fileId);
                    await this.$store.dispatch(tmActions.fetch, this.fileId);
                    console.debug('Model data loaded successfully from fileId');
                } catch (error) {
                    console.error('Failed to fetch model data from fileId:', error);
                }
            }
        }
    },
    methods: {
        init() {
            this.$store.dispatch(tmActions.notModified);
        },
        onSubmit() {
            // noop
        },
        async onSaveClick(evt) {
            evt.preventDefault();
            if (
                this.$route.name === 'gitThreatModelCreate' ||
                    this.$route.name === 'googleThreatModelCreate'
            ) {
                await this.$store.dispatch(tmActions.create);
            } else {
                await this.$store.dispatch(tmActions.saveModel);
            }
        },
        async onReloadClick(evt) {
            evt.preventDefault();
            await this.restoreAsync();
        },
        async onCloseClick(evt) {
            evt.preventDefault();
            if (await this.restoreAsync()) {
                this.$router.push({
                    name: `${this.providerType}ThreatModel`,
                    params: this.$route.params
                });
            }
        },
        onAddDiagramClick(evt) {
            evt.preventDefault();
            const newDiagram = {
                id: this.diagramTop,
                title: this.$t('threatmodel.diagram.stride.defaultTitle'),
                diagramType: 'STRIDE',
                placeholder: this.$t('threatmodel.diagram.stride.defaultDescription'),
                thumbnail: './public/content/images/thumbnail.stride.jpg',
                version: this.version,
                cells: []
            };
            this.$store.dispatch(tmActions.update, { diagramTop: this.diagramTop + 1 });
            this.model.detail.diagrams.push(newDiagram);
            this.$store.dispatch(tmActions.modified);
        },
        onDiagramTypeClick(idx, type) {
            let defaultTitle;
            let placeholder;
            let thumbnail;
            switch (type) {
            case 'CIA':
                thumbnail = './public/content/images/thumbnail.cia.jpg';
                defaultTitle = this.$t('threatmodel.diagram.cia.defaultTitle');
                placeholder = this.$t('threatmodel.diagram.cia.defaultDescription');
                break;
            case 'DIE':
                thumbnail = './public/content/images/thumbnail.die.jpg';
                defaultTitle = this.$t('threatmodel.diagram.die.defaultTitle');
                placeholder = this.$t('threatmodel.diagram.die.defaultDescription');
                break;
            case 'LINDDUN':
                thumbnail = './public/content/images/thumbnail.linddun.jpg';
                defaultTitle = this.$t('threatmodel.diagram.linddun.defaultTitle');
                placeholder = this.$t('threatmodel.diagram.linddun.defaultDescription');
                break;
            case 'PLOT4ai':
                thumbnail = './public/content/images/thumbnail.plot4ai.jpg';
                defaultTitle = this.$t('threatmodel.diagram.plot4ai.defaultTitle');
                placeholder = this.$t('threatmodel.diagram.plot4ai.defaultDescription');
                break;
            case 'STRIDE':
                thumbnail = './public/content/images/thumbnail.stride.jpg';
                defaultTitle = this.$t('threatmodel.diagram.stride.defaultTitle');
                placeholder = this.$t('threatmodel.diagram.stride.defaultDescription');
                break;
            default:
                thumbnail = './public/content/images/thumbnail.jpg';
                defaultTitle = this.$t('threatmodel.diagram.generic.defaultTitle');
                placeholder = this.$t('threatmodel.diagram.generic.defaultDescription');
                type = this.$t('threatmodel.diagram.generic.select');
            }
            this.model.detail.diagrams[idx].diagramType = type;
            this.model.detail.diagrams[idx].placeholder = placeholder;
            this.model.detail.diagrams[idx].thumbnail = thumbnail;
            if (
                this.model.detail.diagrams[idx].title ===
                        this.$t('threatmodel.diagram.cia.defaultTitle') ||
                    this.model.detail.diagrams[idx].title ===
                        this.$t('threatmodel.diagram.die.defaultTitle') ||
                    this.model.detail.diagrams[idx].title ===
                        this.$t('threatmodel.diagram.linddun.defaultTitle') ||
                    this.model.detail.diagrams[idx].title ===
                        this.$t('threatmodel.diagram.plot4ai.defaultTitle') ||
                    this.model.detail.diagrams[idx].title ===
                        this.$t('threatmodel.diagram.stride.defaultTitle') ||
                    this.model.detail.diagrams[idx].title ===
                        this.$t('threatmodel.diagram.generic.defaultTitle')
            ) {
                this.model.detail.diagrams[idx].title = defaultTitle;
            }
            this.$store.dispatch(tmActions.modified);
        },
        onRemoveDiagramClick(idx) {
            this.model.detail.diagrams.splice(idx, 1);
            this.$store.dispatch(tmActions.modified);
        },
        onModifyModel() {
            this.$store.dispatch(tmActions.modified);
        },
        async restoreAsync() {
            if (!this.$store.getters.modelChanged || (await this.getConfirmModal())) {
                await this.$store.dispatch(tmActions.diagramClosed);
                this.$store.dispatch(tmActions.restore);
                this.$store.dispatch(tmActions.notModified);
                return true;
            }
            return false;
        },
        getConfirmModal() {
            // Import the showConfirmDialog function directly here to avoid circular dependencies
            return import('@/utils/modal-helper.js').then(({ showConfirmDialog }) => {
                return showConfirmDialog(this, {
                    title: this.$t('forms.discardTitle'),
                    message: this.$t('forms.discardMessage'),
                    okTitle: this.$t('forms.ok'),
                    cancelTitle: this.$t('forms.cancel'),
                    okVariant: 'danger',
                    hideHeaderClose: true,
                    centered: true
                });
            });
        }
    }
};
</script>
<style lang="scss" scoped>
    .add-diagram-link {
        color: var(--orange);
        font-size: 14px;
    }
    .remove-diagram-btn {
        font-size: 12px;
    }
    .select-diagram-type {
        font-size: 12px;
    }
    .required-field label {
        font-weight: 600;
    }
    .form-group {
        margin-bottom: 2.5rem;  /* Increased from 1.5rem to 2.5rem */
    }
    
    .form-group label {
        margin-top: 1rem;
    }
    .diagram-inputs {
        display: flex;
        align-items: flex-start;
        margin-bottom: 1rem;
    }
    
    .diagram-inputs > * {
        margin-right: 5px;
        height: 38px; /* Standardize height of all elements */
    }
    
    .diagram-inputs > *:last-child {
        margin-right: 0;
    }
    
    .select-diagram-type {
        flex: 0 0 auto;
        min-width: 110px;
    }
    
    .diagram-title {
        flex: 1 1 auto;
    }
    
    .diagram-description {
        flex: 2 1 auto;
    }
    
    .remove-diagram-btn {
        flex: 0 0 auto;
    }
</style>

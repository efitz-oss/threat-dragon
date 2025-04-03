<template>
    <b-container>
        <b-row class="mt-3 mb-3">
            <b-col>
                <h1>{{ $t('threatmodel.new.title') }}</h1>
                <p class="lead">{{ $t('threatmodel.new.description') }}</p>
            </b-col>
        </b-row>
        <b-row>
            <b-col lg="8" offset-lg="2">
                <b-form @submit.prevent="saveModel">
                    <b-form-group :label="$t('threatmodel.title')" label-for="threat-model-title">
                        <b-form-input
                            id="threat-model-title"
                            v-model="threatModel.summary.title"
                            required
                            :placeholder="$t('threatmodel.placeholder.title')"
                        ></b-form-input>
                    </b-form-group>

                    <b-form-group :label="$t('threatmodel.owner')" label-for="threat-model-owner">
                        <b-form-input
                            id="threat-model-owner"
                            v-model="threatModel.summary.owner"
                            :placeholder="$t('threatmodel.placeholder.owner')"
                        ></b-form-input>
                    </b-form-group>

                    <b-form-group
                        :label="$t('threatmodel.description')"
                        label-for="threat-model-description"
                    >
                        <b-form-textarea
                            id="threat-model-description"
                            v-model="threatModel.summary.description"
                            rows="3"
                            :placeholder="$t('threatmodel.placeholder.description')"
                        ></b-form-textarea>
                    </b-form-group>

                    <b-form-group
                        :label="$t('threatmodel.reviewer')"
                        label-for="threat-model-reviewer"
                    >
                        <b-form-input
                            id="threat-model-reviewer"
                            v-model="threatModel.detail.reviewer"
                            :placeholder="$t('threatmodel.placeholder.reviewer')"
                        ></b-form-input>
                    </b-form-group>

                    <b-button type="submit" variant="primary" class="mt-3">
                        {{ $t('threatmodel.buttons.save') }}
                    </b-button>
                </b-form>
            </b-col>
        </b-row>
    </b-container>
</template>

<script>
import { mapState } from 'vuex';

import isElectron from 'is-electron';
import { getProviderType } from '@/service/provider/providers.js';
import tmActions from '@/store/actions/threatmodel.js';

export default {
    name: 'NewThreatModel',
    data() {
        return {
            threatModel: {
                summary: {
                    title: '',
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
            }
        };
    },
    computed: mapState({
        providerType: (state) => getProviderType(state.provider.selected),
        version: (state) => state.packageBuildVersion
    }),
    mounted() {
        this.$store.dispatch(tmActions.clear);
        this.threatModel.version = this.version;
    },
    methods: {
        saveModel() {
            // Store the threat model in Vuex
            this.$store.dispatch(tmActions.selected, this.threatModel);

            const params = Object.assign({}, this.$route.params, {
                threatmodel: this.threatModel.summary.title
            });

            if (isElectron()) {
                // tell the desktop server that the model has changed
                window.electronAPI.modelOpened(this.threatModel.summary.title);
            }

            // Route based on provider type
            if (this.providerType === 'local' || this.providerType === 'desktop') {
                this.$router.push({ name: `${this.providerType}ThreatModelEdit`, params });
            } else if (this.providerType === 'google') {
                // For Google provider, first go to DriveAccess to select save location
                this.$router.push({
                    name: `${this.providerType}SaveModel`,
                    params: {
                        ...this.$route.params,
                        threatModel: this.threatModel
                    }
                });
            } else {
                // Other Git providers
                this.$router.push({ name: `${this.providerType}ThreatModelCreate`, params });
            }
        }
    }
};
</script>

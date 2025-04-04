<template>
    <b-container fluid>
        <b-row>
            <b-col>
                <div class="jumbotron text-center">
                    <h4>
                        {{ $t('demo.select') }}
                    </h4>
                </div>
            </b-col>
        </b-row>
        <b-row>
            <b-col md="6" offset="3">
                <b-list-group>
                    <b-list-group-item
                        v-for="(model, idx) in models"
                        :key="idx"
                        href="javascript:void(0)"
                        :data-model-name="model.name"
                        @click="onModelClick(model)"
                    >
                        {{ model.name }}
                    </b-list-group-item>
                </b-list-group>
            </b-col>
        </b-row>
    </b-container>
</template>

<script>
import demo from '@/service/demo/index.js';
import isElectron from 'is-electron';
import tmActions from '@/store/actions/threatmodel.js';

export default {
    name: 'SelectDemoModel',
    data() {
        return {
            models: demo.models
        };
    },
    mounted() {
        this.$store.dispatch(tmActions.clear);
        this.$store.dispatch(tmActions.fetchAll);
    },
    methods: {
        onModelClick(model) {
            this.$store.dispatch(tmActions.selected, model.model);
            if (isElectron()) {
                // tell any electron server that the model has changed
                window.electronAPI.modelOpened(model.name);
            }
            // Store the current auth provider for use later
            const currentProvider = this.$route.params.provider;
            
            // If we're coming from Google login, use google provider type with proper parameters
            if (currentProvider === 'google') {
                const params = Object.assign({}, this.$route.params, { 
                    threatmodel: model.name,
                    provider: 'google', 
                    folder: 'demo'  // Use demo as the folder name for Google Drive demo models
                });
                this.$router.push({ name: 'googleThreatModel', params });
            } else {
                // Otherwise use the local provider (for desktop/local workflows)
                const params = Object.assign({}, this.$route.params, { 
                    threatmodel: model.name,
                    provider: 'local'
                });
                this.$router.push({ name: 'localThreatModel', params });
            }
        }
    }
};
</script>

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
            // Store the current auth provider for reference (prefixed with _ as it's unused)
            const _currentProvider = this.$route.params.provider;
            
            // Always use local provider for demo models, regardless of login method
            // This is because demo models are local static files, not stored in Google Drive
            const params = {
                threatmodel: model.name
            };
            
            console.debug('Navigating to demo model:', model.name);

            // First try to navigate by name, but if that fails, use path as fallback
            try {
                // We deliberately avoid preserving provider from route.params
                // to prevent routing errors with Google Drive routes
                this.$router.push({ name: 'localThreatModel', params });
            } catch (err) {
                console.error('Error navigating by route name, falling back to path:', err);
                // Fallback to direct path navigation to avoid route naming issues
                this.$router.push(`/models/${model.name}`);
            }
        }
    }
};
</script>

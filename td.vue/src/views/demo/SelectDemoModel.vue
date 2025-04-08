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
            // 1. First explicitly clear provider state when selecting demo model
            // This prevents routing conflict with previous provider (e.g., Google Drive)
            this.$store.dispatch('PROVIDER_CLEAR');
            console.debug('Cleared provider state');
            
            // 2. Select the local provider explicitly
            this.$store.dispatch('PROVIDER_SELECTED', 'local');
            console.debug('Selected local provider');
            
            // 3. Select the threat model
            this.$store.dispatch(tmActions.selected, model.model);
            console.debug('Selected threat model data');
            
            if (isElectron()) {
                // tell any electron server that the model has changed
                window.electronAPI.modelOpened(model.name);
            }
            
            // Always use local provider for demo models, regardless of login method
            // This is because demo models are local static files, not stored in Google Drive
            const params = {
                threatmodel: model.name
            };
            
            console.debug('Navigating to demo model:', model.name);

            // First try to navigate by name, but if that fails, use path as fallback
            try {
                // We deliberately use the local route name and simplified params
                // to prevent routing errors with other providers
                this.$router.push({ 
                    name: 'localThreatModel', 
                    params,
                    replace: true // Use replace to avoid adding to history
                });
            } catch (err) {
                console.error('Error navigating by route name, falling back to path:', err);
                // Fallback to direct path navigation to avoid route naming issues
                this.$router.push(`/models/${model.name}`);
            }
        }
    }
};
</script>

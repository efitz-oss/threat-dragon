<template>
    <b-container fluid>
        <b-row>
            <b-col>
                <b-jumbotron class="text-center">
                    <h4>
                        {{ $t('demo.select') }}
                    </h4>
                </b-jumbotron>
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

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useThreatmodelStore } from '@/stores/threatmodel';
import demo from '@/service/demo/index.js';
import isElectron from 'is-electron';

// Composables
const route = useRoute();
const router = useRouter();
const threatmodelStore = useThreatmodelStore();

// State
const models = ref(demo.models);

// Methods
const onModelClick = (model) => {
    threatmodelStore.setSelected(model.model);
    if (isElectron()) {
        // tell any electron server that the model has changed
        window.electronAPI.modelOpened(model.name);
    }
    const params = Object.assign({}, route.params, { threatmodel: model.name });
    router.push({ name: 'localThreatModel', params });
};

// Lifecycle
onMounted(() => {
    threatmodelStore.clear();
    threatmodelStore.fetchAll();
});
</script>

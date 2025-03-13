<template>
    <b-btn-group>
        <td-form-button
            :on-btn-click="deleteSelected"
            icon="trash"
            :title="$t('threatmodel.buttons.delete')"
            text=""
        />

        <td-form-button
            v-b-modal.shortcuts
            :on-btn-click="noOp"
            icon="keyboard"
            :title="$t('threatmodel.buttons.shortcuts')"
            text=""
        />

        <td-form-button
            :on-btn-click="undo"
            icon="undo"
            :title="$t('threatmodel.buttons.undo')"
            text=""
        />

        <td-form-button
            :on-btn-click="redo"
            icon="redo"
            :title="$t('threatmodel.buttons.redo')"
            text=""
        />

        <td-form-button
            :on-btn-click="zoomIn"
            icon="search-plus"
            :title="$t('threatmodel.buttons.zoomIn')"
            text=""
        />

        <td-form-button
            :on-btn-click="zoomOut"
            icon="search-minus"
            :title="$t('threatmodel.buttons.zoomOut')"
            text=""
        />

        <td-form-button
            :on-btn-click="toggleGrid"
            icon="th"
            :title="$t('threatmodel.buttons.toggleGrid')"
            text=""
        />

        <b-dropdown id="export-graph-btn" right :text="$t('forms.export')">
            <b-dropdown-item id="export-graph-png" @click="exportPNG"> PNG </b-dropdown-item>
            <b-dropdown-item id="export-graph-jpeg" @click="exportJPEG"> JPEG </b-dropdown-item>
            <b-dropdown-item id="export-graph-svg" @click="exportSVG"> SVG </b-dropdown-item>
        </b-dropdown>

        <td-form-button :on-btn-click="closeDiagram" icon="times" :text="$t('forms.close')" />

        <td-form-button
            :is-primary="true"
            :on-btn-click="save"
            icon="save"
            :text="$t('forms.save')"
        />
    </b-btn-group>
</template>

<script setup>
import { ref, computed } from 'vue';
import TdFormButton from '@/components/FormButton.vue';
import { useThreatmodelStore } from '@/stores/threatmodel';

// Props
const props = defineProps({
    graph: {
        type: Object,
        required: true,
    },
});

// Emits
const emit = defineEmits(['saved', 'closed']);

// Store
const threatmodelStore = useThreatmodelStore();

// State
const gridShowing = ref(true);

// Computed
const diagram = computed(() => threatmodelStore.selectedDiagram);

// Methods
const save = () => {
    emit('saved');
};

const closeDiagram = async () => {
    emit('closed');
};

const noOp = () => {
    return;
};

const undo = () => {
    if (props.graph.getPlugin('history').canUndo()) {
        props.graph.getPlugin('history').undo();
    }
};

const redo = () => {
    if (props.graph.getPlugin('history').canRedo()) {
        props.graph.getPlugin('history').redo();
    }
};

const zoomIn = () => {
    if (props.graph.zoom() < 1.0) {
        props.graph.zoom(0.1);
    } else {
        props.graph.zoom(0.2);
    }
    console.debug('zoom to ' + props.graph.zoom());
};

const zoomOut = () => {
    if (props.graph.zoom() < 1.0) {
        props.graph.zoom(-0.1);
    } else {
        props.graph.zoom(-0.2);
    }
    console.debug('zoom to ' + props.graph.zoom());
};

const deleteSelected = () => {
    props.graph.removeCells(props.graph.getSelectedCells());
};

const toggleGrid = () => {
    if (gridShowing.value) {
        props.graph.hideGrid();
        gridShowing.value = false;
    } else {
        props.graph.showGrid();
        gridShowing.value = true;
    }
};

const exportPNG = () => {
    props.graph.exportPNG(`${diagram.value.title}.png`, {
        padding: 50,
    });
};

const exportJPEG = () => {
    props.graph.exportJPEG(`${diagram.value.title}.jpeg`, {
        padding: 50,
    });
};

const exportSVG = () => {
    props.graph.exportSVG(`${diagram.value.title}.svg`);
};
</script>

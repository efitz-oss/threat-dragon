<template>
    <div class="p-buttonset">
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

        <Dropdown
            v-model="selectedExportFormat"
            :options="exportFormats"
            option-label="name"
            placeholder="Export"
            class="export-dropdown"
            @change="handleExport"
        />

        <td-form-button :on-btn-click="closeDiagram" icon="times" :text="$t('forms.close')" />

        <td-form-button
            :is-primary="true"
            :on-btn-click="save"
            icon="save"
            :text="$t('forms.save')"
        />
    </div>
</template>

<script>
import { mapState } from 'vuex';
import { ref } from 'vue';

import TdFormButton from '@/components/FormButton.primevue.vue';

export default {
    name: 'TdGraphButtons',
    components: {
        TdFormButton,
    },
    setup() {
        const selectedExportFormat = ref(null);
        const exportFormats = ref([
            { name: 'PNG', value: 'png' },
            { name: 'JPEG', value: 'jpeg' },
            { name: 'SVG', value: 'svg' },
        ]);

        return {
            selectedExportFormat,
            exportFormats,
        };
    },
    computed: mapState({
        diagram: (state) => state.threatmodel.selectedDiagram,
    }),
    data() {
        return {
            gridShowing: true,
        };
    },
    props: {
        graph: {
            required: true,
        },
    },
    methods: {
        save() {
            this.$emit('saved');
        },
        async closeDiagram() {
            this.$emit('closed');
        },
        noOp() {
            return;
        },
        undo() {
            if (this.graph.getPlugin('history').canUndo()) {
                this.graph.getPlugin('history').undo();
            }
        },
        redo() {
            if (this.graph.getPlugin('history').canRedo()) {
                this.graph.getPlugin('history').redo();
            }
        },
        zoomIn() {
            if (this.graph.zoom() < 1.0) {
                this.graph.zoom(0.1);
            } else {
                this.graph.zoom(0.2);
            }
            console.debug('zoom to ' + this.graph.zoom());
        },
        zoomOut() {
            if (this.graph.zoom() < 1.0) {
                this.graph.zoom(-0.1);
            } else {
                this.graph.zoom(-0.2);
            }
            console.debug('zoom to ' + this.graph.zoom());
        },
        deleteSelected() {
            this.graph.removeCells(this.graph.getSelectedCells());
        },
        toggleGrid() {
            if (this.gridShowing) {
                this.graph.hideGrid();
                this.gridShowing = false;
            } else {
                this.graph.showGrid();
                this.gridShowing = true;
            }
        },
        handleExport() {
            if (this.selectedExportFormat) {
                const format = this.selectedExportFormat.value;
                if (format === 'png') {
                    this.exportPNG();
                } else if (format === 'jpeg') {
                    this.exportJPEG();
                } else if (format === 'svg') {
                    this.exportSVG();
                }
                // Reset selected value after export
                this.selectedExportFormat = null;
            }
        },
        exportPNG() {
            this.graph.exportPNG(`${this.diagram.title}.png`, {
                padding: 50,
            });
        },
        exportJPEG() {
            this.graph.exportJPEG(`${this.diagram.title}.jpeg`, {
                padding: 50,
            });
        },
        exportSVG() {
            this.graph.exportSVG(`${this.diagram.title}.svg`);
        },
    },
};
</script>

<style lang="scss" scoped>
    .p-buttonset {
        display: flex;
        align-items: center;

        .export-dropdown {
            margin: 0 0.5rem;
        }
    }
</style>

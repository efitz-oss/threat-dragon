<template>
    <BButtonGroup>
        <td-form-button
            :on-btn-click="deleteSelected"
            icon="trash"
            :title="t('threatmodel.buttons.delete')"
            text=""
        />

        <td-form-button
            :on-btn-click="showShortcuts"
            icon="keyboard"
            :title="t('threatmodel.buttons.shortcuts')"
            text=""
        />

        <td-form-button
            :on-btn-click="undo"
            icon="undo"
            :title="t('threatmodel.buttons.undo')"
            text=""
        />

        <td-form-button
            :on-btn-click="redo"
            icon="redo"
            :title="t('threatmodel.buttons.redo')"
            text=""
        />

        <td-form-button
            :on-btn-click="zoomIn"
            icon="search-plus"
            :title="t('threatmodel.buttons.zoomIn')"
            text=""
        />

        <td-form-button
            :on-btn-click="zoomOut"
            icon="search-minus"
            :title="t('threatmodel.buttons.zoomOut')"
            text=""
        />

        <td-form-button
            :on-btn-click="toggleGrid"
            icon="th"
            :title="t('threatmodel.buttons.toggleGrid')"
            text=""
        />

        <b-dropdown id="export-graph-btn" right :text="t('forms.export')">
            <b-dropdown-item id="export-graph-png" @click="exportPNG"> PNG </b-dropdown-item>
            <b-dropdown-item id="export-graph-jpeg" @click="exportJPEG"> JPEG </b-dropdown-item>
            <b-dropdown-item id="export-graph-svg" @click="exportSVG"> SVG </b-dropdown-item>
        </b-dropdown>

        <td-form-button :on-btn-click="closeDiagram" icon="times" :text="t('forms.close')" />

        <td-form-button
            :is-primary="true"
            :on-btn-click="save"
            icon="save"
            :text="t('forms.save')"
        />
    </BButtonGroup>
</template>

<script>
import { mapState } from 'vuex';
import { useI18n } from '@/i18n/index.js';
import TdFormButton from '@/components/FormButton.vue';

export default {
    name: 'TdGraphButtons',
    components: {
        TdFormButton
    },
    setup() {
        // Use the composition API for i18n
        const { t } = useI18n();

        return { t };
    },
    computed: mapState({
        diagram: (state) => state.threatmodel.selectedDiagram
    }),
    data() {
        return {
            gridShowing: true
        };
    },
    props: {
        graph: {
            required: true
        }
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
        showShortcuts() {
            this.$root.$emit('bv::show::modal', 'shortcuts');
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
        exportPNG() {
            this.graph.exportPNG(`${this.diagram.title}.png`, {
                padding: 50
            });
        },
        exportJPEG() {
            this.graph.exportJPEG(`${this.diagram.title}.jpeg`, {
                padding: 50
            });
        },
        exportSVG() {
            this.graph.exportSVG(`${this.diagram.title}.svg`);
        }
    }
};
</script>

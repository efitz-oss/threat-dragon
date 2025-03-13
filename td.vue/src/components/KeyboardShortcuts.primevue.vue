<template>
    <Dialog
        v-model:visible="visible"
        :style="{ width: '50vw' }"
        :modal="true"
        header="Keyboard Shortcuts"
    >
        <DataTable :value="shortcuts" striped-rows class="p-datatable-sm">
            <Column field="shortcut" header="Shortcut" />
            <Column field="action" header="Action" />
        </DataTable>

        <template #footer>
            <div class="p-d-flex p-jc-end">
                <Button label="OK" icon="pi pi-check" autofocus @click="closeDialog" />
            </div>
        </template>
    </Dialog>
</template>

<script>
import { ref } from 'vue';

export default {
    name: 'TdKeyboardShortcuts',
    setup() {
        const visible = ref(false);

        return { visible };
    },
    data() {
        return {
            shortcuts: [
                {
                    shortcut: this.$t('threatmodel.shortcuts.copy.shortcut'),
                    action: this.$t('threatmodel.shortcuts.copy.action'),
                },
                {
                    shortcut: this.$t('threatmodel.shortcuts.paste.shortcut'),
                    action: this.$t('threatmodel.shortcuts.paste.action'),
                },
                {
                    shortcut: this.$t('threatmodel.shortcuts.undo.shortcut'),
                    action: this.$t('threatmodel.shortcuts.undo.action'),
                },
                {
                    shortcut: this.$t('threatmodel.shortcuts.redo.shortcut'),
                    action: this.$t('threatmodel.shortcuts.redo.action'),
                },
                {
                    shortcut: this.$t('threatmodel.shortcuts.delete.shortcut'),
                    action: this.$t('threatmodel.shortcuts.delete.action'),
                },
                {
                    shortcut: this.$t('threatmodel.shortcuts.pan.shortcut'),
                    action: this.$t('threatmodel.shortcuts.pan.action'),
                },
                {
                    shortcut: this.$t('threatmodel.shortcuts.multiSelect.shortcut'),
                    action: this.$t('threatmodel.shortcuts.multiSelect.action'),
                },
                {
                    shortcut: this.$t('threatmodel.shortcuts.zoom.shortcut'),
                    action: this.$t('threatmodel.shortcuts.zoom.action'),
                },
                {
                    shortcut: this.$t('threatmodel.shortcuts.save.shortcut'),
                    action: this.$t('threatmodel.shortcuts.save.action'),
                },
            ],
        };
    },
    mounted() {
        // Expose method to external components
        this.$el.showDialog = this.showDialog;
    },
    methods: {
        closeDialog() {
            this.visible = false;
        },
        showDialog() {
            this.visible = true;
        },
    },
};
</script>

<style lang="scss" scoped>
    :deep(.p-dialog-header) {
        background-color: var(--primary-color);
        color: var(--primary-color-text);
    }
</style>

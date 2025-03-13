<template>
    <Dialog
        id="shortcuts"
        :header="t('threatmodel.shortcuts.title')"
        v-model:visible="visible"
        :modal="true"
        :style="{width: '50vw'}"
        :maximizable="true"
    >
        <DataTable :value="shortcuts" stripedRows>
            <Column field="shortcut" header="Shortcut"></Column>
            <Column field="action" header="Action"></Column>
        </DataTable>
        <template #footer>
            <Button label="OK" icon="pi pi-check" @click="visible = false" autofocus />
        </template>
    </Dialog>
</template>

<script setup>
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import Dialog from 'primevue/dialog';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';

const { t } = useI18n();
const visible = ref(false);

const shortcuts = ref([
    {
        shortcut: t('threatmodel.shortcuts.copy.shortcut'),
        action: t('threatmodel.shortcuts.copy.action'),
    },
    {
        shortcut: t('threatmodel.shortcuts.paste.shortcut'),
        action: t('threatmodel.shortcuts.paste.action'),
    },
    {
        shortcut: t('threatmodel.shortcuts.undo.shortcut'),
        action: t('threatmodel.shortcuts.undo.action'),
    },
    {
        shortcut: t('threatmodel.shortcuts.redo.shortcut'),
        action: t('threatmodel.shortcuts.redo.action'),
    },
    {
        shortcut: t('threatmodel.shortcuts.delete.shortcut'),
        action: t('threatmodel.shortcuts.delete.action'),
    },
    {
        shortcut: t('threatmodel.shortcuts.pan.shortcut'),
        action: t('threatmodel.shortcuts.pan.action'),
    },
    {
        shortcut: t('threatmodel.shortcuts.multiSelect.shortcut'),
        action: t('threatmodel.shortcuts.multiSelect.action'),
    },
    {
        shortcut: t('threatmodel.shortcuts.zoom.shortcut'),
        action: t('threatmodel.shortcuts.zoom.action'),
    },
    {
        shortcut: t('threatmodel.shortcuts.save.shortcut'),
        action: t('threatmodel.shortcuts.save.action'),
    },
]);

// Method to open the dialog
const open = () => {
    visible.value = true;
};

// Expose the open method to parent components
defineExpose({
    open
});
</script>

<style scoped>
.p-datatable .p-datatable-thead > tr > th {
    background-color: var(--primary-color);
    color: var(--primary-color-text);
    font-weight: 600;
}
</style>

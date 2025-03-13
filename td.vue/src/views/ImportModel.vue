<template>
    <div>
        <div class="grid">
            <div class="col-12">
                <div class="surface-0 text-center p-5 mb-4 border-round shadow-2">
                    <h4>{{ $t('forms.open') }} / {{ $t('dashboard.actions.importExisting') }}</h4>
                </div>
            </div>
        </div>
        <div class="grid justify-content-center">
            <div class="col-12 md:col-8">
                <form class="p-fluid">
                    <div class="field" @drop.prevent="onDropFile" @dragenter.prevent @dragover.prevent>
                        <Textarea
                            id="json-input"
                            v-model="tmJson"
                            :placeholder="prompt"
                            rows="16"
                            class="w-full"
                        />
                    </div>
                </form>
            </div>
        </div>
        <div class="grid justify-content-center">
            <div class="col-12 md:col-4 text-left">
                <span class="p-buttonset">
                    <td-form-button
                        id="td-open-btn"
                        :on-btn-click="onOpenClick"
                        icon="folder-open"
                        :text="$t('forms.open')"
                    />
                </span>
            </div>
            <div class="col-12 md:col-4 text-right">
                <span class="p-buttonset">
                    <td-form-button
                        id="td-import-btn"
                        :is-primary="true"
                        :on-btn-click="onImportClick"
                        icon="file-import"
                        :text="$t('forms.import')"
                    />
                </span>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import isElectron from 'is-electron';
import { getProviderType } from '@/service/provider/providers.js';
import openThreatModel from '@/service/otm/openThreatModel.js';
import { useProviderStore } from '@/stores/provider';
import { useThreatmodelStore } from '@/stores/threatmodel';
import TdFormButton from '@/components/FormButton.vue';
import { isValidSchema } from '@/service/schema/ajv';
import Textarea from 'primevue/textarea';

// Composables
const route = useRoute();
const router = useRouter();
const toast = useToast();
const providerStore = useProviderStore();
const threatmodelStore = useThreatmodelStore();

// State
const tmJson = ref('');

// Computed
const providerType = computed(() => getProviderType(providerStore.selected));
const prompt = computed(
    () => '{ ' + $t('threatmodel.dragAndDrop') + $t('threatmodel.jsonPaste') + ' ... }'
);

// only search for text files
const pickerFileOptions = {
    types: [
        {
            description: 'Threat models',
            accept: {
                'application/json': ['.json'],
            },
        },
    ],
    multiple: false,
};

// Methods
const onDropFile = async (event) => {
    if (event.dataTransfer.files.length === 1) {
        const file = event.dataTransfer.files[0];
        if (file.name.endsWith('.json')) {
            try {
                const text = await file.text();
                tmJson.value = text;
                threatmodelStore.updateModel({ fileName: file.name });
                onImportClick(file.name);
            } catch (e) {
                toast.add({ severity: 'error', summary: e });
            }
        } else {
            toast.add({ severity: 'error', summary: $t('threatmodel.errors.onlyJsonAllowed') });
        }
    } else {
        toast.add({ severity: 'error', summary: $t('threatmodel.errors.dropSingleFileOnly') });
    }
};

const onOpenClick = async () => {
    if ('showOpenFilePicker' in window) {
        // Chrome and Edge browsers return an array of file handles
        try {
            const [handle] = await window.showOpenFilePicker(pickerFileOptions);
            const file = await handle.getFile();
            if (file.name.endsWith('.json')) {
                tmJson.value = await file.text();
                threatmodelStore.updateModel({ fileName: file.name });
                onImportClick(file.name);
            } else {
                toast.add({
                    severity: 'error',
                    summary: $t('threatmodel.errors.onlyJsonAllowed'),
                });
            }
        } catch (e) {
            // any error is most likely due to the picker being cancelled, which is benign so just warn
            toast.add({ severity: 'warn', summary: $t('threatmodel.errors.open') });
            console.warn(e);
        }
    } else {
        toast.add({
            severity: 'error',
            summary:
                    'File picker is not yet supported on this browser: use Paste or Drag and Drop',
        });
    }
};

const onImportClick = (fileName) => {
    let jsonModel;
    // check for JSON syntax errors, schema errors come later
    try {
        jsonModel = JSON.parse(tmJson.value);
    } catch (e) {
        toast.add({ severity: 'error', summary: $t('threatmodel.errors.invalidJson') });
        console.error(e);
        return;
    }

    // check for schema errors
    if (!isValidSchema(jsonModel)) {
        toast.add({ severity: 'warn', summary: $t('threatmodel.errors.invalidJson') });
    }

    // Identify if threat model is in OTM format and if so, convert OTM to dragon format
    if (Object.hasOwn(jsonModel, 'otmVersion')) {
        jsonModel = openThreatModel.convertOTMtoTD(jsonModel);
    }

    // save the threat model in the store
    threatmodelStore.setSelected(jsonModel);

    if (isElectron()) {
        // tell the desktop server that the model has changed
        window.electronAPI.modelOpened(fileName);
    }

    let params;
    // this will deliberately fail if the threat model does not have a title in the summary
    try {
        params = Object.assign({}, route.params, {
            threatmodel: jsonModel.summary.title,
        });
    } catch (e) {
        toast.add({
            severity: 'error',
            summary: $t('threatmodel.errors.invalidJson') + ' : ' + e.message,
        });
        console.error(e);
        return;
    }

    // Use replace instead of push to enable proper back button behavior
    router.replace({ name: `${providerType.value}ThreatModel`, params });
};
</script>

import { createApp, reactive } from 'vue';
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';

import App from './App.vue';
import router from './router/index.js';
import i18n from './i18n/index.js';
import { providerNames } from './service/provider/providers.js';

import openThreatModel from './service/otm/openThreatModel.js';
import { isValidOTM, isValidSchema } from './service/schema/ajv';

// Import Pinia stores (to replace Vuex stores)
import { useAuthStore } from './stores/auth';
import { useProviderStore } from './stores/provider';
import { useThreatModelStore } from './stores/threatmodel';
import { useAppStore } from './stores/app';

// Import PrimeVue components and styles
import PrimeVue from 'primevue/config';
import ToastService from 'primevue/toastservice';
import ConfirmationService from 'primevue/confirmationservice';
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';
import 'primevue/resources/themes/lara-light-blue/theme.css';
import 'primevue/resources/primevue.min.css';
import 'primeicons/primeicons.css';

// Import FontAwesome
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';

// Add FontAwesome icons
library.add(fas, fab);

// Create the Pinia store
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

// Create the app
const app = createApp(App);

// Register FontAwesome component
app.component('FontAwesomeIcon', FontAwesomeIcon);

// Use plugins
app.use(PrimeVue, { ripple: true });
app.use(ToastService);
app.use(ConfirmationService);
app.use(pinia);
app.use(router);
app.use(i18n);

// Register components needed for confirmation dialogs
app.component('Dialog', Dialog);
app.component('Button', Button);

// Mount the app
app.mount('#app');

// Create stores
const appStore = useAppStore();
const authStore = useAuthStore();
const providerStore = useProviderStore();
const threatModelStore = useThreatModelStore();

// Create a reactive app state object
const appState = reactive({
    confirmationDialog: null,
});

// Helper function to show a confirmation dialog
const getConfirmModal = () => {
    return new Promise((resolve) => {
        appState.confirmationDialog = {
            message: i18n.global.t('forms.discardMessage'),
            title: i18n.global.t('forms.discardTitle'),
            okText: i18n.global.t('forms.ok'),
            cancelText: i18n.global.t('forms.cancel'),
            onConfirm: () => {
                resolve(true);
                appState.confirmationDialog = null;
            },
            onCancel: () => {
                resolve(false);
                appState.confirmationDialog = null;
            },
        };
    });
};

const localAuth = () => {
    providerStore.selectProvider(providerNames.desktop);
    authStore.setLocal();
};

// request from electron to renderer to close the application
window.electronAPI.onCloseAppRequest(async (_event) => {
    console.debug('Close application request');
    if (!threatModelStore.modelChanged || (await getConfirmModal())) {
        console.debug('Closing application');
        // send request back to electron server to close the application
        window.electronAPI.appClose();
    }
});

// request from electron to renderer to close the model
window.electronAPI.onCloseModelRequest(async (_event, fileName) => {
    console.debug(`Close model request for file name: ${fileName}`);
    if (!threatModelStore.modelChanged || (await getConfirmModal())) {
        console.debug('Closing model and diagram');
        threatModelStore.diagramClosed();
        localAuth();
        router.push({ name: 'MainDashboard' }).catch((error) => {
            if (error.name != 'NavigationDuplicated') {
                throw error;
            }
        });
        // store clear action sends modelClosed notification back to electron server
        threatModelStore.clear();
    }
});

// request from electron to renderer to start a new model
window.electronAPI.onNewModelRequest(async (_event, fileName) => {
    console.debug(`New model request with file name: ${fileName}`);
    if (!threatModelStore.modelChanged || (await getConfirmModal())) {
        console.debug('Opening new model');
        threatModelStore.diagramClosed();
        threatModelStore.update({ fileName: fileName });
        localAuth();
        router.push({ name: `${providerNames.desktop}NewThreatModel` });
        // send modelOpened notification of new model back to electron server
        window.electronAPI.modelOpened(fileName);
    }
});

// provide renderer with model contents from electron
window.electronAPI.onOpenModel((_event, fileName, jsonModel) => {
    console.debug(`Open model with file name: ${fileName}`);
    let params;
    // check for schema errors
    if (!isValidSchema(jsonModel)) {
        console.warn('Invalid threat model');
    } else if (isValidOTM(jsonModel)) {
        // if threat model is in OTM format then convert OTM to dragon format
        jsonModel = openThreatModel.convertOTMtoTD(jsonModel);
    }

    // this will fail if the threat model does not have a title in the summary
    try {
        params = Object.assign({}, router.currentRoute.value.params, {
            threatmodel: jsonModel.summary.title,
        });
    } catch (e) {
        appStore.showErrorToast(`${i18n.global.t('threatmodel.errors.invalidJson')}: ${e.message}`);
        router.push({ name: 'HomePage' }).catch((error) => {
            if (error.name != 'NavigationDuplicated') {
                throw error;
            }
        });
        return;
    }
    threatModelStore.update({ fileName: fileName });
    threatModelStore.selectModel(jsonModel);
    localAuth();
    router.push({ name: `${providerNames.desktop}ThreatModel`, params }).catch((error) => {
        if (error.name != 'NavigationDuplicated') {
            throw error;
        }
    });
});

// request from electron to renderer to provide new model contents
window.electronAPI.onOpenModelRequest(async (_event, fileName) => {
    console.debug(`Open request for model file name: ${fileName}`);
    if (!threatModelStore.modelChanged || (await getConfirmModal())) {
        console.debug('Confirm model can be opened');
        window.electronAPI.modelOpenConfirmed(fileName);
    }
});

// request from electron to renderer to print the model report
window.electronAPI.onPrintModelRequest(async (_event, format) => {
    console.debug(`Print report request for model using format: ${format}`);
    if (!threatModelStore.modelChanged || (await getConfirmModal())) {
        console.debug(`Printing model as ${format}`);
        threatModelStore.diagramClosed();
        threatModelStore.restore();
        threatModelStore.setNotModified();
        localAuth();
        router.push({ name: `${providerNames.desktop}Report` }).catch((error) => {
            if (error.name != 'NavigationDuplicated') {
                throw error;
            }
        });
        // send modelPrint notification back to electron server along with format
        window.electronAPI.modelPrint(format);
    }
});

// request from electron to renderer to provide the model data so that it can be saved
window.electronAPI.onSaveModelRequest((_event, fileName) => {
    console.debug(`Save model request for file name: ${fileName}`);
    threatModelStore.applyDiagram();
    threatModelStore.saveModel();
});

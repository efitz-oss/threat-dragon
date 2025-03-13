import { createApp } from 'vue';
import App from './App.test.vue';
import PrimeVue from 'primevue/config';

// Import PrimeVue styles
import 'primevue/resources/themes/lara-light-blue/theme.css';
import 'primevue/resources/primevue.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';

// Import our variables and custom styles
import './styles/primevue-variables.scss';

// Import FontAwesome icons
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faCheck, faEdit, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';

// Create the app instance
const app = createApp(App);

// Configure PrimeVue
app.use(PrimeVue, {
    ripple: true,
    inputStyle: 'filled',
});

// Register specific PrimeVue components
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import Panel from 'primevue/panel';
import Card from 'primevue/card';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';

app.component('Button', Button);
app.component('Dialog', Dialog);
app.component('Panel', Panel);
app.component('Card', Card);
app.component('DataTable', DataTable);
app.component('Column', Column);

// Configure FontAwesome
library.add(faCheck, faEdit, faTrash, faPlus);
app.component('FontAwesomeIcon', FontAwesomeIcon);

// Mount the app
app.mount('#app');

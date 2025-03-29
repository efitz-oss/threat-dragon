import {
    BOverlay, BContainer, BNavbarToggle, BImg, BNavbarBrand, BCollapse,
    BNavbarNav, BNavItem, BNavbar, BNavText, BTooltip, BDropdownItem,
    BDropdown, BCol, BRow, BButton, BButtonGroup, BForm, BFormGroup,
    BFormInput, BFormTextarea, BListGroup, BListGroupItem, BCard, BFormCheckbox, BTableSimple, BThead, BTbody, BTr, BTh, BTd,
    BModal, BTable, BBadge, BCardText
} from 'bootstrap-vue-next';

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue-next/dist/bootstrap-vue-next.css';

const components = {
    BOverlay, BContainer, BNavbarToggle, BImg, BNavbarBrand, BCollapse,
    BNavbarNav, BNavItem, BNavbar, BNavText, BTooltip, BDropdownItem,
    BDropdown, BCol, BRow, BButton, BButtonGroup, BForm, BFormGroup,
    BFormInput, BFormTextarea, BListGroup, BListGroupItem, BCard, BFormCheckbox, BTableSimple, BThead, BTbody, BTr, BTh, BTd,
    BModal, BTable, BBadge, BCardText
};

// This is a bootstrap-vue-next plugin that registers all required
// bootstrap-vue-next components globally for use in Vue 3
export default {
    install(app) {
        Object.entries(components).forEach(([name, component]) => {
            app.component(name, component);
        });
    },
};
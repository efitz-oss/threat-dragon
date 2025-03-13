// Optimized FontAwesome icon imports
// This file selectively imports only the icons we need instead of full icon sets

import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

// Import only the specific icons we need from solid
import {
    faQuestionCircle,
    faSignOutAlt,
    faGift,
    faPlus,
    faSave,
    faEdit,
    faTrash,
    faExclamationTriangle,
    faCheck,
    faTimes,
    faFileDownload,
    faFileUpload,
    faFileImport,
    faFolder,
    faHome,
    faCloudDownloadAlt,
    faList,
    faExclamationCircle,
    faInfoCircle,
    faArrowLeft,
    faArrowRight,
} from '@fortawesome/free-solid-svg-icons';

// Import only the specific icons we need from brands
import {
    faGithub,
    faGitlab,
    faBitbucket,
    faGoogle,
    faWindows,
} from '@fortawesome/free-brands-svg-icons';

// Add the specific icons to the library
library.add(
    // Solid icons
    faQuestionCircle,
    faSignOutAlt,
    faGift,
    faPlus,
    faSave,
    faEdit,
    faTrash,
    faExclamationTriangle,
    faCheck,
    faTimes,
    faFileDownload,
    faFileUpload,
    faFileImport,
    faFolder,
    faHome,
    faCloudDownloadAlt,
    faList,
    faExclamationCircle,
    faInfoCircle,
    faArrowLeft,
    faArrowRight,
    // Brand icons
    faGithub,
    faGitlab,
    faBitbucket,
    faGoogle,
    faWindows
);

export { FontAwesomeIcon };

// Export a function to register the FontAwesomeIcon component
export function registerFontAwesome(app) {
    app.component('FontAwesomeIcon', FontAwesomeIcon);
}

// Export the specific icons for direct use
export const icons = {
    // Solid
    questionCircle: faQuestionCircle,
    signOutAlt: faSignOutAlt,
    gift: faGift,
    plus: faPlus,
    save: faSave,
    edit: faEdit,
    trash: faTrash,
    exclamationTriangle: faExclamationTriangle,
    check: faCheck,
    times: faTimes,
    fileDownload: faFileDownload,
    fileUpload: faFileUpload,
    fileImport: faFileImport,
    folder: faFolder,
    home: faHome,
    cloudDownloadAlt: faCloudDownloadAlt,
    list: faList,
    exclamationCircle: faExclamationCircle,
    infoCircle: faInfoCircle,
    arrowLeft: faArrowLeft,
    arrowRight: faArrowRight,

    // Brands
    github: faGithub,
    gitlab: faGitlab,
    bitbucket: faBitbucket,
    google: faGoogle,
    windows: faWindows,
};

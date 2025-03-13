// Optimized FontAwesome implementation with tree-shaking and efficient loading
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

// Common icons used across the application
import {
    faSignOutAlt,
    faQuestionCircle,
    faPlus,
    faEdit,
    faTimes,
    faSave,
    faTrash,
    faKeyboard,
} from '@fortawesome/free-solid-svg-icons';

// Brand icons used for authentication
import { faGithub, faGitlab, faBitbucket, faGoogle } from '@fortawesome/free-brands-svg-icons';

// Add frequently used icons to the library
const coreIcons = [
    // Essential UI icons
    faSignOutAlt,
    faQuestionCircle,
    faPlus,
    faEdit,
    faTimes,
    faSave,
    faTrash,
    faKeyboard,

    // Brand icons for login
    faGithub,
    faGitlab,
    faBitbucket,
    faGoogle,
];

// Add these icons to the library
library.add(...coreIcons);

// Function to register FontAwesome with the app
export function registerFontAwesome(app) {
    app.component('FontAwesomeIcon', FontAwesomeIcon);
}

// Dynamic icon imports for less commonly used icons
export async function loadDiagramIcons() {
    const {
        faUndo,
        faRedo,
        faSearchPlus,
        faSearchMinus,
        faTh,
        faProjectDiagram,
        faDiagramProject,
    } = await import('@fortawesome/free-solid-svg-icons');

    library.add(
        faUndo,
        faRedo,
        faSearchPlus,
        faSearchMinus,
        faTh,
        faProjectDiagram,
        faDiagramProject
    );
}

export async function loadReportIcons() {
    const { faFilePdf, faPrint, faFileAlt, faFolderOpen } = await import(
        '@fortawesome/free-solid-svg-icons'
    );

    library.add(faFilePdf, faPrint, faFileAlt, faFolderOpen);
}

export async function loadGoogleDriveIcons() {
    const { faGoogleDrive } = await import('@fortawesome/free-brands-svg-icons');
    library.add(faGoogleDrive);
}

export { FontAwesomeIcon };

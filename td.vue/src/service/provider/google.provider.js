import { providerTypes } from './providerTypes.js';

// Prefix unused variable with underscore to satisfy linting rules
const _providerType = providerTypes.google;

const getDashboardActions = () => [
    {
        to: '/drive/folder',
        key: 'openExisting',
        icon: 'google-drive',
        iconPreface: 'fab'
    },
    {
        to: '/drive/new',
        key: 'createNew',
        icon: 'plus'
    },
    {
        to: '/demo/select',
        key: 'readDemo',
        icon: 'cloud-download-alt'
    }
];

export default {
    getDashboardActions
};

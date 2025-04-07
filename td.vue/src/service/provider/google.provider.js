import { providerTypes } from './providerTypes.js';

const providerType = providerTypes.google;

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

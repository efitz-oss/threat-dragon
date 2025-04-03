import { providerTypes } from '@/service/provider/providerTypes';

const providerType = providerTypes.google;

export const googleRoutes = [
    {
        path: `/${providerType}/:provider/folder`,
        name: `${providerType}Folder`,
        component: () =>
            import(/* webpackChunkName: "folder-access" */ '../views/google/DriveAccess.vue')
    },
    {
        path: `/${providerType}/:provider/new`,
        name: `${providerType}New`,
        component: () =>
            import(/* webpackChunkName: "new-threatmodel" */ '../views/NewThreatModel.vue')
    },
    {
        path: `/${providerType}/:provider/save`,
        name: `${providerType}SaveModel`,
        component: () =>
            import(/* webpackChunkName: "folder-access" */ '../views/google/DriveAccess.vue'),
        props: (route) => {
            // Convert the threatModel object from route params to a proper object
            const threatModel = route.params && route.params.threatModel;
            
            return { 
                mode: 'save', 
                threatModel 
            };
        }
    },
    {
        path: `/${providerType}/:provider/:folder/:threatmodel`,
        name: `${providerType}ThreatModel`,
        component: () => import(/* webpackChunkName: "threatmodel" */ '../views/ThreatModel.vue')
    },
    {
        path: `/${providerType}/:provider/:folder/new`,
        name: `${providerType}NewThreatModel`,
        component: () =>
            import(/* webpackChunkName: "new-threatmodel" */ '../views/NewThreatModel.vue')
    },
    {
        path: `/${providerType}/:provider/:folder/:threatmodel/create`,
        name: `${providerType}ThreatModelCreate`,
        component: () =>
            import(/* webpackChunkName: "threatmodel-edit" */ '../views/ThreatModelEdit.vue')
    },
    {
        path: `/${providerType}/:provider/:folder/:threatmodel/edit/:fileId?`,
        name: `${providerType}ThreatModelEdit`,
        component: () =>
            import(/* webpackChunkName: "threatmodel-edit" */ '../views/ThreatModelEdit.vue'),
        props: true
    },
    {
        path: `/${providerType}/:provider/:folder/:threatmodel/edit/:diagram`,
        name: `${providerType}DiagramEdit`,
        component: () => import(/* webpackChunkName: "diagram-edit" */ '../views/DiagramEdit.vue')
    },
    {
        path: `/${providerType}/:provider/:folder/:threatmodel/report`,
        name: `${providerType}Report`,
        component: () => import(/* webpackChunkName: "report-model" */ '../views/ReportModel.vue')
    }
];

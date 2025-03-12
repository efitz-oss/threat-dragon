import { Env } from './Env.js';

/**
 * Environment configuration for Threat Dragon application
 */
export class ThreatDragonEnv extends Env {
    constructor() {
        super('ThreatDragon');
    }

    get prefix() {
        return '';
    }

    // if any  of the defaults are changed then ensure docs are updated in development/environment.md
    // if the default SERVER_API_PORT is changed then ensure the CI pipeline still works
    get properties() {
        // Use SERVER_API_PORT if defined, otherwise fallback to PORT, then to default 3000
        const serverPort = process.env.SERVER_API_PORT ?? process.env.PORT ?? 3000;

        return [
            { key: 'NODE_ENV', required: false, defaultValue: 'production' },
            { key: 'SERVER_API_PORT', required: false, defaultValue: serverPort },
            { key: 'LOG_MAX_FILE_SIZE', required: false, defaultValue: 24 },
            { key: 'LOG_LEVEL', required: false, defaultValue: 'warn' },
            { key: 'SERVER_API_PROTOCOL', required: false, defaultValue: 'https' },
            { key: 'REPO_ROOT_DIRECTORY', required: false, defaultValue: 'ThreatDragonModels' },
            { key: 'REPO_USE_SEARCH', required: false, defaultValue: false },
            { key: 'REPO_SEARCH_QUERY', required: false },
        ];
    }
}

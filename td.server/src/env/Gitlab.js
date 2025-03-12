import { Env } from './Env.js';

/**
 * Environment configuration for GitLab integration
 */
export class GitlabEnv extends Env {
    constructor() {
        super('Gitlab');
    }

    get prefix() {
        return 'GITLAB_';
    }

    // Note that the actual env var will be prepended with GITLAB_
    get properties() {
        return [
            { key: 'CLIENT_ID', required: false },
            { key: 'CLIENT_SECRET', required: false },
            { key: 'SCOPE', required: false, defaultValue: 'read_user read_repository' },
            { key: 'HOST', required: false },
            { key: 'REDIRECT_URI', required: false },
            { key: 'REPO_ROOT_DIRECTORY', required: false },
        ];
    }
}

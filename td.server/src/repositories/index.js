import bitbucketrepo from './bitbucketrepo.js';
import githubrepo from './githubrepo.js';
import gitlabrepo from './gitlabrepo.js';
import googledrive from './googledrive.js';

/**
 * An immutable object containing all
 * providers
 * @type {Object}
 */
export const all = Object.freeze({
    githubrepo,
    gitlabrepo,
    bitbucketrepo,
    googledrive,
});

/**
 * Current repository provider selection
 * @type {string}
 */
let selection = 'bitbucketrepo';

/**
 * Gets the currently selected repository provider
 * @returns {Object} The selected repository provider
 */
export function getProvider() {
    return getSpecificProvider(selection);
}

/**
 * Sets the current repository provider selection
 * @param {string} name - The provider name to select
 */
export function setProvider(name) {
    selection = name;
}

/**
 * Gets a specific repository provider by name
 * @param {String} name - The provider name
 * @throw {Error} If the provider does not exist or is not configured
 * @returns {Object} The requested repository provider
 */
export function getSpecificProvider(name) {
    const lowerName = (name || '').toLowerCase();
    const provider = all[lowerName];
    if (!provider) {
        throw new Error(`Unknown provider: ${name}`);
    }
    //
    // if (!provider.isConfigured()) {
    //     throw new Error(`Provider ${name} is not configured. See docs/development/environment.md for more info`);
    // }

    return provider;
}

export { getProvider as get, setProvider as set, getSpecificProvider as getSpecific };

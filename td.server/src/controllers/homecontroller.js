import { getLogger } from '../helpers/logger.helper.js';
import path from 'path';
import { fileURLToPath } from 'url';

import { upDir } from '../helpers/path.helper.js';

const logger = getLogger('controllers/homecontroller.js');

/**
 * Setup dirname equivalent for ESM
 */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * The path to the index.html file
 * @type {String}
 */
const indexHtmlPath = path.join(__dirname, upDir, upDir, upDir, 'td.vue', 'dist', 'index.html');

/**
 * Serves the index.html page for the SPA
 * @param {Object} req
 * @param {Object} res
 * @returns {Object}
 */
const index = (req, res) => {
    logger.debug(`API index request, sendFile ${indexHtmlPath}`);
    res.sendFile(indexHtmlPath);
};

export default {
    index,
};

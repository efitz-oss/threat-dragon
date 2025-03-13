import { create } from './app.js';

/**
 * Creates a new server instance
 * @returns {Promise<express.Application>} Express application
 */
export async function createServer() {
    return create();
}

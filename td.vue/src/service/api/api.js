import clientFactory from '../httpClient.js';

/**
 * Does a GET request to the given resource
 * Will apply bearer token authorization if a token is provided
 * @param {String} url
 * @returns Promise
 */
const getAsync = async (url, query) => {
    try {
        const client = clientFactory.get();
        const res = await client.get(url, { params: query });
        return res.data;
    } catch (error) {
        console.error(`GET request to ${url} failed:`, error.message);
        throw error;
    }
};

/**
 * Does a POST request to the given resource
 * Will add the optional body if provided
 * Will apply bearer token authorization if a token is provided
 * @param {String} url
 * @param {Object?} body
 */
const postAsync = async (url, body) => {
    // Debug logging for POST requests
    console.log(`Making POST request to: ${url}`);

    try {
        const client = clientFactory.get();
        console.log('HTTP client created');

        const res = await client.post(url, body);
        console.log(`POST request to ${url} succeeded with status: ${res.status}`);

        return res.data;
    } catch (error) {
        console.error(`POST request to ${url} failed:`, error.message);
        throw error;
    }
};

/**
 * Does a PUT request to the given resource
 * Will add the body provided
 * Will apply the current bearer token as an auth header
 * @param {String} url
 * @param {Object} body
 */
const putAsync = async (url, body) => {
    try {
        const client = clientFactory.get();
        const res = await client.put(url, body);
        return res.data;
    } catch (error) {
        console.error(`PUT request to ${url} failed:`, error.message);
        throw error;
    }
};

export default {
    getAsync,
    postAsync,
    putAsync
};

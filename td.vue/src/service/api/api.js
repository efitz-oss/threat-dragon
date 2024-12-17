import clientFactory from '../httpClient.js';

/**
 * Does a GET request to the given resource
 * Will apply bearer token authorization if a token is provided
 * @param {String} url
 * @returns Promise
 */
const getAsync = async (url, query = {}) => {
    try {
        console.log("the issue could be here .....11..yoo + URL", url);
        console.log("Query Parameters:.......", query);

        if (!query) {
            console.warn("Query is undefined or null.........");
        }
        console.log("Query object:.........", query);

        // Make the API call
        const res = await clientFactory.get().get(url, { params: query });
        console.log("----------------------");

        // Log the entire response object to inspect its structure
        console.log("Full Response Object:", res);

        // Access the data directly from the response
        const responseDATA = res.data; // No need to use await here
        console.log("Response from API responseDATA:", responseDATA);

        return responseDATA; // Return the data
    } catch (error) {
        console.log("the issue could be here .....11..error");
        console.error('Error in getAsync:', error.message);
        // Log the entire error object for more context
        console.error('Full Error Object:', error);
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
    const res = await clientFactory.get().post(url, body);
    return res.data;
};

/**
 * Does a PUT request to the given resource
 * Will add the body provided
 * Will apply the current bearer token as an auth header
 * @param {String} url
 * @param {Object} body
 */
const putAsync = async (url, body) => {
    const res = await clientFactory.get().put(url, body);
    return res.data;
};

export default {
    getAsync,
    postAsync,
    putAsync
};

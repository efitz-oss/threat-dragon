import errors from './errors.js';

/**
 * Wraps a function to be sent using a standardized JSON format
 * This catches errors and logs them using the logger
 * @param {Function} fn
 * @param {*} req
 * @param {*} res
 * @param {*} logger
 * @returns {*}
 */
const sendResponse = (fn, req, res, logger) => {
    try {
        const respObj = {
            status: 200,
            data: fn()
        };
        console.log ( "there is the respObj guys in the----- respObjc",respObj)
        return res.status(200).json(respObj);
    } catch (e) {
        // logger.error(e);
        console.log ( "there is the error guys in the----- sendResponseAsync", e?.message)
        console.log ( "there is the error guys")
        return errors.serverError('Internal Server Error..................', res, logger);
    }
};

/**
 * Wraps an async function (promise) to be sent using a standardized JSON format
 * This catches errors and logs them using the logger
 * @param {function(): Promise<{localEnabled: boolean, githubEnabled, bitbucketEnabled}>} asyncFn
 * @param {*} req
 * @param {*} res
 * @param {*} logger
 * @returns {*}
 */
const sendResponseAsync = async (asyncFn, req, res, logger) => {
    try {
        const data = await asyncFn();
        console.log ( "there is the data against --- sendResponseAsync", data)
        return res.status(200).json({
            status: 200,
            data
        });
    } catch (e) {
        // logger.error(e);
        console.log ( "there is the error guys in the----- sendResponseAsync", e?.message)
        return errors.serverError('Internal Server Error..............', res, logger);
    }
};

export default {
    sendResponse,
    sendResponseAsync
};

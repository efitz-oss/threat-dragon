import crypto from 'crypto';

/**
 * Gets random bytes for the given length as a promise
 * using crypto.randomBytes
 * @param {Number} size
 * @returns {Promise<Buffer>}
 */
export function randomBytes(size) {
    return new Promise((resolve, reject) => {
        crypto.randomBytes(size, (err, buffer) => {
            if (err) {
                return reject(err);
            }
            return resolve(buffer);
        });
    });
}

const bcrypt = require('bcrypt');
/**
 * Basically hash a password.
 * @param {string} str 
 */
const create = str => {
    return new Promise((resolve, reject) => {
        bcrypt.hash(str, 10).then(hash => {
            resolve(hash);
        }).catch(() => {
            reject(new Error("hash.error"));
        })
    })
}

module.exports = {
    create  : create,
    compare : bcrypt.compare
}

const bcrypt = require('bcrypt');

const create = (str) => {
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

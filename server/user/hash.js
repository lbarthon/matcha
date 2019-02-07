const bcrypt = require('bcrypt');

function create(str) {
    return new Promise((resolve, reject) => {
        bcrypt.hash(str, 10).then(hash => {
            resolve(hash);
        }).catch(err => {
            reject(new Error("Eror hashing the user password!"));
        })
    })
}

module.exports = {
    create  : create,
    compare : bcrypt.compare
}

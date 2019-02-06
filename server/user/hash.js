const bcrypt = require('bcrypt');

function create(str) {
    return new Promise((resolve, reject) => {
        bcrypt.hash(str, 10, (err, hash) => {
            if (err) reject(err);
            else resolve(hash);
        });
    })
}

module.exports = {
    create : create
}

var hash = require('./hash.js');
var emitter = require('../emitter.js');
var conn = null;

emitter.on('dbConnectEvent', (new_conn, err) => {
    if (!err) conn = new_conn;
});

function login(infos) {
    return new Promise((resolve, reject) => {
        if (infos.name == '') {
            reject(new Error("Username can't be null!"));
        } else if (infos.password == '') {
            reject(new Error("Password can't be null!"));
        } else {
            conn.query("SELECT pwd FROM users WHERE username=?",
                [infos.name], (err, results) => {
                if (err) {
                    reject(new Error("Error querying database."));
                } else {
                    if (results.length != 0) {
                        hash.compare(infos.password, results[0].pwd)
                        .then(res => {
                            if (!res) {
                                reject(new Error("Passwords does not match!"));
                            } else {
                                resolve();
                            }
                        })
                        .catch(() => {
                            reject(new Error("Error verifying the password."))
                        });
                    } else {
                        reject(new Error("User not found."));
                    }
                }
            })
        }
    });
}

module.exports = {
    login : login
}

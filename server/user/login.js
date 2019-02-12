const hash = require('./hash');
const utils = require('./utils');
const emitter = require('../emitter');
var conn = null;

emitter.on('dbConnectEvent', (new_conn, err) => {
    if (!err) conn = new_conn;
});

const login = (infos) => {
    utils.areInfosClean(infos, 'users');
    return new Promise((resolve, reject) => {
        if (conn) {
            if (infos.username == '') {
                reject(new Error("Username can't be null!"));
            } else if (infos.pwd == '') {
                reject(new Error("Password can't be null!"));
            } else {
                conn.query("SELECT id,pwd FROM users WHERE username=?",
                    [infos.username], (err, results) => {
                    if (err) {
                        reject(new Error("Error querying database."));
                    } else {
                        if (results.length != 0) {
                            hash.compare(infos.pwd, results[0].pwd)
                            .then(res => {
                                if (!res) {
                                    reject(new Error("Passwords does not match!"));
                                } else {
                                    resolve([infos.username, results[0].id]);
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
        } else {
            reject(new Error("Sql connection undefined!"));
        }
    });
}

module.exports = {
    login : login
}

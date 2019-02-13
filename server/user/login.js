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
                reject(new Error("error_null_username"));
            } else if (infos.pwd == '') {
                reject(new Error("error_null_password"));
            } else {
                conn.query("SELECT id,pwd FROM users WHERE username=?",
                    [infos.username], (err, results) => {
                    if (err) {
                        reject(new Error("error_sql_query"));
                    } else {
                        if (results.length != 0) {
                            hash.compare(infos.pwd, results[0].pwd)
                            .then(res => {
                                if (!res) {
                                    reject(new Error("login_password_diff"));
                                } else {
                                    resolve([infos.username, results[0].id]);
                                }
                            })
                            .catch(() => {
                                reject(new Error("hash_error"))
                            });
                        } else {
                            reject(new Error("error_unknown_user"));
                        }
                    }
                })
            }
        } else {
            reject(new Error("error_sql_undefined"));
        }
    });
}

module.exports = {
    login : login
}

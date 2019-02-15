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
                reject(new Error("register.alert.username_null"));
            } else if (infos.pwd == '') {
                reject(new Error("register.alert.password_null"));
            } else {
                conn.query("SELECT id,pwd FROM users WHERE username=?",
                    [infos.username], (err, results) => {
                    if (err) {
                        reject(new Error("sql.alert.query"));
                    } else {
                        if (results.length != 0) {
                            hash.compare(infos.pwd, results[0].pwd)
                            .then(res => {
                                if (!res) {
                                    reject(new Error("login.alert.password_diff"));
                                } else {
                                    resolve([infos.username, results[0].id]);
                                }
                            })
                            .catch(() => {
                                reject(new Error("hash_error"))
                            });
                        } else {
                            reject(new Error("login.alert.user_unknow"));
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

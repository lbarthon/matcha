const hash = require('./hash');
const utils = require('./utils');
const emitter = require('../emitter');
var conn = null;

emitter.on('dbConnectEvent', (new_conn, err) => {
    if (!err) conn = new_conn;
});
/**
 * Function that logins an user.
 * @param {*} req 
 */
const login = req => {
    var infos = req.body;
    utils.areInfosClean(infos, 'users');
    return new Promise((resolve, reject) => {
        if (conn) {
            utils.isLogged(req)
            .then(() => {
                reject(new Error("login.alert.already_logged"));
            }).catch(() => {
                if (infos.username == '') {
                    reject(new Error("register.alert.username_null"));
                } else if (infos.pwd == '') {
                    reject(new Error("register.alert.password_null"));
                } else {
                    conn.query("SELECT id, pwd, confirmed, perm_level, banned FROM users WHERE username=?",
                        [infos.username], (err, results) => {
                        if (err) {
                            reject(new Error("sql.alert.query"));
                        } else {
                            if (results.length != 0) {
                                hash.compare(infos.pwd, results[0].pwd)
                                .then(res => {
                                    if (!res) {
                                        reject(new Error("login.alert.password_diff"));
                                    } else if (results[0].banned == 1) {
                                        reject(new Error("login.alert.user_banned"));
                                    } else if (results[0].confirmed == 0) {
                                        reject(new Error("login.alert.not_confirmed"));
                                    } else {
                                        resolve([infos.username, results[0].id, results[0].perm_level]);
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
            });
        } else {
            reject(new Error("sql.alert.undefined"));
        }
    });
}

module.exports = login;
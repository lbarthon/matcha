const emitter = require('../emitter');
const utils = require('./utils');
const hash = require('./hash');
var conn = null;

emitter.on('dbConnectEvent', (new_conn, err) => {
    if (!err) conn = new_conn;
});

const updateCol = (col, value, uid) => {
    return new Promise((resolve, reject) => {
        if (col == "pwd" && !value.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[\d])(?=.*[^\w])(?=.{8,})/)) {
            reject(new Error("register.alert.password_regex"));
        } else if (col == "email" && !value.match(/[\w]+\@[\w]+\.[\.\w]+/i)) {
            reject(new Error("register.alert.email_invalid"));
        }
        if (col == "pwd") {
            hash.create(value).then(hashed => {
                conn.query("UPDATE users SET ? WHERE id=?", [{[col]: hashed}, uid], (err) => {
                    if (err) reject(new Error("sql.alert.query"));
                    else resolve();
                });
            }).catch(reject);
        } else if (col != "repassword") {
            conn.query("UPDATE users SET ? WHERE id=?", [{[col]: value}, uid], (err) => {
                if (err) reject(new Error("sql.alert.query"));
                else resolve();
            });
        }
    });
}

const checks = (filtered, uid) => {
    return new Promise(async (resolve, reject) => {
        if (filtered['email'] != undefined) {
            await utils.getIdFromEmail(filtered['email']).then(id => {
                if (id != uid) {
                    reject(new Error("register.alert.email_took"));
                }
            }).catch(() => {});
        }
        if (filtered['username'] != undefined) {
            await utils.getIdFromUsername(filtered['username']).then(id => {
                if (id != uid) {
                    reject(new Error("register.alert.username_took"));
                }
            }).catch(() => {});
        }
        if (filtered['pwd'] != filtered['repassword']) {
            reject(new Error("register.alert.password_diff"));
        } else {
            resolve();
        }
    })
};

const update = (req, uid) => {
    return new Promise((resolve, reject) => {
        if (conn) {
            var infos = req.body;
            var filtered = [];
            for (let key in infos) {
                if (infos[key] != null && infos[key] != '') {
                    filtered[key] = infos[key];
                }
            }
            checks(filtered, uid)
            .then(() => {
                utils.areInfosClean(filtered, 'users')
                .then(good => {
                    var promises = good.map(key => {
                        return updateCol(key ,filtered[key], uid);
                    });
                    req.session.username = filtered['username'];
                    Promise.all(promises)
                    .then(resolve)
                    .catch(reject);
                }).catch(() => {});
            })
            .catch(reject);
        } else {
            reject(new Error("sql.alert.undefined"));
        }
    });
}

module.exports = {
    update : update
}

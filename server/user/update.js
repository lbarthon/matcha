const emitter = require('../emitter');
const utils = require('./utils');
var conn = null;

emitter.on('dbConnectEvent', (new_conn, err) => {
    if (!err) conn = new_conn;
});

const updateCol = (col, value, uid) => {
    return new Promise((resolve, reject) => {
        if (key == "pwd") {
            hash.create(infos.password).then(hashed => {
                conn.query("UPDATE users SET ?=? WHERE id=?", [col, hashed, uid], (err) => {
                    if (err) reject(new Error("sql.alert.query"));
                    else resolve();
                });
            }).catch(reject);
        } else {
            conn.query("UPDATE users SET ?=? WHERE id=?", [col, value, uid], (err) => {
                if (err) reject(new Error("sql.alert.query"));
                else resolve();
            });
        }
    });
}

const update = (infos, uid) => {
    return new Promise((resolve, reject) => {
        if (conn) {
            var good = utils.areInfosClean(infos, 'users');
            var filtered = [];
            for (let key in infos) {
                if (infos[key] != null && infos[key] != '') {
                    filtered[key] = infos[key];
                }
            }
            var promises = good.map(key => { return updateCol(key ,filtered[key], uid); })
            Promise.all(promises)
            .then(resolve)
            .catch(reject);
        } else {
            reject(new Error("sql.alert.undefined"));
        }
    });
}

module.exports = {
    update : update
}

const emitter = require('../emitter');
const utils = require('./utils');
var conn = null;

emitter.on('dbConnectEvent', (new_conn, err) => {
    if (!err) conn = new_conn;
});

const updateCol = (col, value) => {
    conn.query("UPDATE users SET ?=? WHERE id=?", [col, value], (err) => {
        if (err) console.error(err);
    });
}

const update = infos => {
    return new Promise((resolve, reject) => {
        if (conn) {
            var good = utils.areInfosClean(infos, 'users');
            var filtered = [];
            for (let key in infos) {
                if (infos[key] != null && infos[key] != '') {
                    filtered[key] = infos[key];
                }
            }
            for (let key in good) {
                updateCol(key ,filtered[key]);
            }
        } else {
            reject(new Error("Sql connection undefined!"));
        }
    });
}

module.exports = {
    update : update
}

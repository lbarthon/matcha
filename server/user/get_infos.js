const emitter = require('../emitter');
const utils = require('./utils');
var conn = null;

emitter.on('dbConnectEvent', (new_conn, err) => {
    if (!err) conn = new_conn;
});
/**
 * Returns infos from the user whose id is in param.
 * @param {int} id
 */
const get_infos = (id, visiter = undefined) => {
    return new Promise((resolve, reject) => {
        if (conn) {
            if (id == undefined || id == '' || isNaN(id)) {
                reject(new Error("alert.wrong_id"));
            } else {
                // L'utilisateur peut voir son profil dans tous les cas.
                // On met donc visiter à undefined pour que la promise ci-dessous resolve.
                if (visiter == id) visiter = undefined;
                utils.isComplete(visiter)
                .then(() => {
                    conn.query("SELECT * FROM users WHERE id=?", [id], (err, result) => {
                        if (err) {
                            reject(new Error("sql.alert.query"));
                        } else if (result.length > 0) {
                            if (result[0].banned == 1) {
                                reject(new Error("user.alert.is_banned"));
                            } else {
                                delete result[0].pwd;
                                resolve(result[0]);
                            }
                        } else {
                            reject(new Error("user.alert.notfound"));
                        }
                    });
                })
                .catch(reject);
            }
        } else {
            reject(new Error("sql.alert.undefined"));
        }
    });
}

module.exports = get_infos;

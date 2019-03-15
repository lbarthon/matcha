const emitter = require('../emitter');
var conn = null;

emitter.on('dbConnectEvent', (new_conn, err) => {
    if (!err) conn = new_conn;
});

const get_infos = (req) => {
    return get_infos_id(req.session.uid);
}
/**
 * Returns infos from the user whose id is in param.
 * @param {int} id
 */
const get_infos_id = (id, visiter) => {
    return new Promise((resolve, reject) => {
        if (conn) {
            if (id == undefined || id == '' || isNaN(id)) {
                reject(new Error("alert.wrong_id"));
            } else {
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
            }
        } else {
            reject(new Error("sql.alert.undefined"));
        }
    });
}

module.exports = {
    get_infos    : get_infos,
    get_infos_id : get_infos_id
}

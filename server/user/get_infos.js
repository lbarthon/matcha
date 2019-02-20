const utils = require('./utils');
const emitter = require('../emitter');
var conn = null;

emitter.on('dbConnectEvent', (new_conn, err) => {
    if (!err) conn = new_conn;
});

const get_infos = (req) => {
    return new Promise((resolve, reject) => {
        if (conn) {
            utils.isLogged(req)
            .then(() => {
                var uid = req.session.uid;
                conn.query("SELECT * FROM users WHERE id=?", [uid], (err, result) => {
                    if (err) {
                        reject(new Error("sql.alert.query"));
                    } else {
                        resolve(result[0]);
                    }
                });
            })
            .catch(() => {
                reject(new Error("error_user_not_logged"))
            });
        } else {
            reject(new Error("error_sql_undefined"));
        }
    });
}

const get_infos_id = (id) => {
    return new Promise((resolve, reject) => {
        if (conn) {
            conn.query("SELECT * FROM users WHERE id=?", [id], (err, result) => {
                if (err) {
                    reject(new Error("sql.alert.query"));
                } else if (result.length > 0) {
                    resolve(result[0]);
                } else {
                    reject(new Error("error_user_not_found"));
                }
            });
        } else {
            reject(new Error("error_sql_undefined"));
        }
    });
}

module.exports = {
    get_infos    : get_infos,
    get_infos_id : get_infos_id
}

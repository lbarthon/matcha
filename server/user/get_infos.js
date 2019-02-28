const utils = require('./utils');
const emitter = require('../emitter');
var conn = null;

emitter.on('dbConnectEvent', (new_conn, err) => {
    if (!err) conn = new_conn;
});

const get_infos = (req) => {
    return get_infos_id(req.session.uid);
}

const get_infos_id = (id) => {
    return new Promise((resolve, reject) => {
        if (conn) {
            conn.query("SELECT * FROM users WHERE id=?", [id], (err, result) => {
                if (err) {
                    reject(new Error("sql.alert.query"));
                } else if (result.length > 0) {
                    delete result[0].pwd
                    resolve(result[0]);
                } else {
                    reject(new Error("error_user_not_found"));
                }
            });
        } else {
            reject(new Error("sql.alert.undefined"));
        }
    });
}

module.exports = {
    get_infos    : get_infos,
    get_infos_id : get_infos_id
}

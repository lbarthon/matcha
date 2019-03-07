const hash = require('./hash');
const utils = require('./utils');
const emitter = require('../emitter');
var conn = null;

emitter.on('dbConnectEvent', (new_conn, err) => {
    if (!err) conn = new_conn;
});
/**
 * Function that confirms an user's account.
 * @param {*} req 
 */
const confirm = infos => {
    return new Promise((resolve, reject) => {
        if (conn) {
            conn.query("UPDATE users SET confirmed=1, conf_link=NULL WHERE conf_link=?", [infos.link], (err, results) => {
                if (err) {
                    reject(new Error("sql.alert.query"));
                } else if (results.affectedRows == 1) {
                    resolve();
                } else {
                    reject(new Error("confirm_link_invalid"));
                }
            })
        } else {
            reject(new Error("sql.alert.undefined"));
        }
    });
}

module.exports = confirm;

const hash = require('./hash');
const utils = require('./utils');
const emitter = require('../emitter');
var conn = null;

emitter.on('dbConnectEvent', (new_conn, err) => {
    if (!err) conn = new_conn;
});
/**
 * Function that resets an user's password.
 * @param {*} req
 */
const resetpw = req => {
    var infos = req.body;
    return new Promise((resolve, reject) => {
        if (conn) {
            if (!String(infos.password).match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[\d])(?=.*[^\w])(?=.{8,})/)) {
                reject(new Error("register.alert.password_regex"));
            } else if (infos.password != infos.repassword) {
                reject(new Error("register.alert.password_diff"));
            } else {
                hash.create(infos.password)
                .then(hashed => {
                    conn.query("UPDATE users \
                    INNER JOIN resetpw ON users.id = resetpw.user_id \
                    SET users.pwd=? WHERE resetpw.link=?", [hashed, infos.link], (err, results) => {
                        if (err) {
                            reject(new Error("sql.alert.query"));
                        } else if (results.affectedRows == 0) {
                            reject(new Error("confirm.alert.link_invalid"));
                        } else {
                            conn.query("DELETE FROM resetpw WHERE link=?", [infos.link], err => {
                                if (err) {
                                    reject(new Error("sql.alert.query"));
                                } else {
                                    resolve();
                                }
                            });
                        }
                    });
                }).catch(reject);
            }
        } else {
            reject(new Error("sql.alert.undefined"));
        }
    });
}

module.exports = resetpw;

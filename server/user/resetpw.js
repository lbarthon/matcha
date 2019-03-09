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
    var uid = req.session.uid
    return new Promise((resolve, reject) => {
        if (conn) {
            conn.query("DELETE FROM resetpw WHERE link=? AND user_id=?", [infos.link, uid], (err, results) => {
                if (err) {
                    reject(new Error("sql.alert.query"));
                } else if (results.affectedRows == 1) {
                    if (!String(infos.pwd).match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[\d])(?=.*[^\w])(?=.{8,})/)) {
                        reject(new Error("register.alert.password_regex"));
                    } else {
                        hash.create(infos.pwd).then(hashed => {
                            conn.query("UPDATE users SET pwd=? WHERE id=?", [hashed, uid], err => {
                                if (err) {
                                    reject(new Error("sql.alert.query"));
                                } else {
                                    resolve();
                                }
                            })
                        }).catch(reject);
                    }
                } else {
                    reject(new Error("confirm_link_invalid"));
                }
            })
        } else {
            reject(new Error("sql.alert.undefined"));
        }
    });
}

module.exports = resetpw;

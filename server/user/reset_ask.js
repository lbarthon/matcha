const emitter = require('../emitter');
const utils = require('./utils');
const randomstring = require('randomstring');
var conn = null;

emitter.on('dbConnectEvent', (new_conn, err) => {
    if (!err) conn = new_conn;
});
/**
 * Function that sends a mail to reset user's password.
 * @param {*} req
 */
const reset_ask = req => {
    return new Promise((resolve, reject) => {
        if (conn) {
            var infos = req.body;
            if (!String(infos.email).match(/[\w]+\@[\w]+\.[\.\w]+/i)) {
                reject(new Error("register.alert.email_invalid"));
            } else {
                utils.getIdFromEmail(infos.email)
                .then(uid => {
                    var str = randomstring.generate(80);
                    var date = Date.now();
                    conn.query("INSERT INTO resetpw (date, link, user_id) VALUES (?,?,?)",
                            [date, str, uid], (err) => {
                        if (err) {
                            reject(new Error("sql.alert.query"));
                        } else {
                            // TODO -- SEND MAILS
                            resolve();
                        }
                    })
                })
                .catch(reject);
            }

        } else {
            reject(new Error("sql.alert.undefined"));
        }
    });
}

module.exports = reset_ask;

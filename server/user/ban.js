const emitter = require('../emitter');
const utils = require('./utils');
var conn = null;

emitter.on('dbConnectEvent', (new_conn, err) => {
    if (!err) conn = new_conn;
});
/**
 * Ban the user whose id is in params.
 * @param {*} req 
 */
const ban = req => {
    let uid = req.session.uid;
    let id = req.body.id;
    return new Promise((resolve, reject) => {
        if (conn) {
            if (id == undefined || id == '' || isNaN(id)) {
                reject(new Error("alert.wrong_id"));
            } else {
                utils.isAdmin(req)
                .then(() => {
                    conn.query("UPDATE users SET banned=1 WHERE ?", [{id: id}], (err, results) => {
                        if (err) {
                            reject(new Error("sql.alert.query"));
                        } else if (results.affectedRows == 1) {
                            resolve(true);
                        } else {
                            resolve(false);
                        }
                    })
                })
                .catch(() => reject(new Error("alert.not_admin")));
            }
        } else {
            reject(new Error("sql.alert.undefined"));
        }
    });
}

module.exports = ban;

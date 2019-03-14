const emitter = require('../emitter');
var conn = null;

emitter.on('dbConnectEvent', (new_conn, err) => {
    if (!err) conn = new_conn;
});
/**
 * Ban the user whose id is in params.
 * @param {*} req 
 */
const ban = req => {
    let id = req.body.id;
    return new Promise((resolve, reject) => {
        if (conn) {
            if (id == undefined || id == '' || isNaN(id)) {
                reject(new Error("error_wrong_id"));
            } else {
                conn.query("UPDATE users SET banned=1 WHERE ?", [{id: id}], (err, results) => {
                    if (err) {
                        reject(new Error("sql.alert.query"));
                    } else if (results.affectedRows == 1) {
                        resolve(true);
                    } else {
                        resolve(false);
                    }
                })
            }
        } else {
            reject(new Error("sql.alert.undefined"));
        }
    });
}

module.exports = ban;

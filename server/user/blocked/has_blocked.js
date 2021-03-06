const emitter = require('../../emitter');
var conn = null;

emitter.on('dbConnectEvent', (new_conn, err) => {
    if (!err) conn = new_conn;
});
/**
 * Returns true or false if uid has blocked target.
 * @param {int} uid 
 * @param {int} target 
 */
const has_blocked = (uid, target) => {
    return new Promise((resolve, reject) => {
        if (conn) {
            if (target == undefined || target == '' || isNaN(target)) {
                reject(new Error("error_wrong_id"));
            } else {
                conn.query("SELECT * FROM blocked WHERE ? AND ?",
                        [{user_id: uid}, {target_id: target}], (err, results) => {
                    if (err) {
                        reject(new Error("sql.alert.query"));
                    } else if (results.length > 0) {
                        resolve(true);
                    } else {
                        resolve(false);
                    }
                });
            }
        } else {
            reject(new Error("sql.alert.undefined"));
        }
    });
}

module.exports = has_blocked;

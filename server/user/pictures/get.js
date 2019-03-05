const emitter = require('../../emitter');
var conn = null;

emitter.on('dbConnectEvent', (new_conn, err) => {
    if (!err) conn = new_conn;
});

/**
 * Returns all uid's pictures.
 * @param {int} uid 
 */
const get = uid => {
    return new Promise((resolve, reject) => {
        if (conn) {
            if (uid == undefined || uid == '' || isNaN(uid)) {
                reject(new Error("error_wrong_id"));
            } else {
                conn.query("SELECT id, main, user_id, picture FROM pictures WHERE user_id=?",
                        [uid], (err, results) => {
                    if (err) {
                        reject(new Error("sql.alert.query"));
                    } else {
                        resolve(results);
                    }
                });
            }
        } else {
            reject(new Error("sql.alert.undefined"));
        }
    });
}

module.exports = {
    get : get
}

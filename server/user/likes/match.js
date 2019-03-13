const emitter = require('../../emitter');
var conn = null;

emitter.on('dbConnectEvent', (new_conn, err) => {
    if (!err) conn = new_conn;
});

const match = (uid, target) => {
    return new Promise((resolve, reject) => {
        if (conn) {
            if (target == undefined || target == '' || isNaN(target)) {
                reject(new Error("error_wrong_id"));
            } else {
                conn.query("SELECT * FROM likes WHERE (? AND ?) OR (? AND ?)",
                        [{user_id: uid}, {target_id: target}, {user_id: target}, {target_id: uid}], (err, results) => {
                    if (err) {
                        reject(new Error("sql.alert.query"));
                    } else if (results.length == 2) {
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

module.exports = match;

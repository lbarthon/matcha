const emitter = require('../../emitter');
var conn = null;

emitter.on('dbConnectEvent', (new_conn, err) => {
    if (!err) conn = new_conn;
});

const has_like = (uid, target) => {
    return new Promise((resolve, reject) => {
        if (conn) {
            conn.query("SELECT * FROM likes WHERE ? AND ?", [{user_id: uid}, {target_id: target}], (err, results) => {
                if (err) {
                    reject(new Error("sql.alert.query"));
                } else if (results.length > 0) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            });
        } else {
            reject(new Error("sql.alert.undefined"));
        }
    });
}

module.exports = has_like;

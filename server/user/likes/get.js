const emitter = require('../../emitter');
var conn = null;

emitter.on('dbConnectEvent', (new_conn, err) => {
    if (!err) conn = new_conn;
});

const get = (uid) => {
    return new Promise((resolve, reject) => {
        if (conn) {
            conn.query("SELECT COUNT(*) AS count FROM likes WHERE ?", [{target_id: uid}], (err, results) => {
                if (err) {
                    reject(new Error("sql.alert.query"));
                } else {
                    resolve(results[0]['count']);
                }
            });
        } else {
            reject(new Error("sql.alert.undefined"));
        }
    });
}

module.exports = get;

const emitter = require('../../emitter');
var conn = null;

emitter.on('dbConnectEvent', (new_conn, err) => {
    if (!err) conn = new_conn;
});

const get = (uid) => {
    return new Promise((resolve, reject) => {
        if (conn) {
            conn.query("SELECT * FROM pictures WHERE user_id=?",
                    [uid], (err, results) => {
                if (err) {
                    reject(new Error("sql.alert.query"));
                } else if (results.length > 0) {
                    resolve(results);
                } else {
                    reject(new Error("error_no_picture"));
                }
            });
        } else {
            reject(new Error("sql.alert.undefined"));
        }
    });
}

module.exports = {
    get : get
}

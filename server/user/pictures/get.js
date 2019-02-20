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
                    reject(new Error("picture.error.select"));
                } else if (result.length > 0) {
                    resolve(results);
                } else {
                    reject(new Error("error_user_not_found"));
                }
            });
        } else {
            reject(new Error("error_sql_undefined"));
        }
    });
}

module.exports = {
    get : get
}

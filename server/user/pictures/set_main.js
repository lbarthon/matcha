const emitter = require('../../emitter');
var conn = null;

emitter.on('dbConnectEvent', (new_conn, err) => {
    if (!err) conn = new_conn;
});

const set_main = (infos, uid) => {
    return new Promise((resolve, reject) => {
        if (conn) {
            conn.query("UPDATE pictures SET main=1 WHERE id=? AND user_id=?",
                    [infos.id, uid], (err, result) => {
                if (err) {
                    reject(new Error("error.sql.query"));
                } else if (result.affectedRows == 1) {
                    resolve();
                } else {
                    reject(new Error("picture.set_main.error"));
                }
            })
        } else {
            reject(new Error("error.sql.undefined"));
        }
    });
}

module.exports = {
    set_main : set_main
}

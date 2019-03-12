const emitter = require('../../emitter');
var conn = null;

emitter.on('dbConnectEvent', (new_conn, err) => {
    if (!err) conn = new_conn;
});

const leave = (roomId, uid) => {
    return new Promise((resolve, reject) => {
        if (conn) {
            conn.query('UPDATE chat_rooms SET `display` = 0 WHERE id = ? AND (id_user1 = ? OR id_user2 = ?)', [roomId, uid, uid], (err, results) => {
                if (err) {
                    reject(new Error("sql.alert.query"));
                } else {
                    resolve(true);
                }
            });
        } else {
            reject(new Error("sql.alert.undefined"));
        }
    });
}

module.exports = leave;

const emitter = require('../../emitter');
var conn = null;

emitter.on('dbConnectEvent', (new_conn, err) => {
    if (!err) conn = new_conn;
});

const get = (roomId, uid) => {
    return new Promise((resolve, reject) => {
        if (conn) {
            conn.query('UPDATE chat_messages SET read = 1 WHERE id_room = ? AND id_from <> ?',
            [roomId, uid], (err, results) => {
                if (err) {
                  console.log(err);
                    reject(new Error("sql.alert.query"));
                } else {
                    resolve(results);
                }
          });
        } else {
            reject(new Error("sql.alert.undefined"));
        }
    });
}

module.exports = get;

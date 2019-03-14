const emitter = require('../../emitter');
const notify = require('../../user/notification/notify');
var conn = null;

emitter.on('dbConnectEvent', (new_conn, err) => {
    if (!err) conn = new_conn;
});

const create = (roomId, message, uid, toId) => {
    return new Promise((resolve, reject) => {
        if (conn) {
            conn.query('SELECT * FROM chat_rooms WHERE id = ? AND ((id_user1 = ? AND id_user2 = ?) OR (id_user1 = ? AND id_user2 = ?)) AND display = 1',
            [roomId, uid, toId, toId, uid], (err, results) => {
                if (results.length != 1) {
                    reject(new Error('chat.alert.message'));
                } else {
                    conn.query('INSERT INTO chat_messages (id_room, message, id_from) values (?,?,?)',
                    [roomId, message, uid], (err, results) => {
                        if (err) {
                            reject(new Error("sql.alert.query"));
                        } else {
                            notify('message', uid, toId);
                            resolve();
                        }
                    });
                }
            });
        } else {
            reject(new Error("sql.alert.undefined"));
        }
    });
}

module.exports = create;

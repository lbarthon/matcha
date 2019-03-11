const emitter = require('../../emitter');
const notify = require('../../user/notification/notify');
var conn = null;

emitter.on('dbConnectEvent', (new_conn, err) => {
    if (!err) conn = new_conn;
});

const create = (roomId, message, uid, toId) => {
    return new Promise((resolve, reject) => {
        //todo verif
        if (conn) {
            conn.query('INSERT INTO chat_messages (id_room, message, id_from) values (?,?,?)', [roomId, message, uid], (err, results) => {
                if (err) {
                    reject(new Error("sql.alert.query"));
                } else {
                    notify('message', uid, toId);
                    resolve();
                }
            });
        } else {
            reject(new Error("sql.alert.undefined"));
        }
    });
}

module.exports = create;

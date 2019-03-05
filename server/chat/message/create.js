const emitter = require('../../emitter');
var conn = null;

emitter.on('dbConnectEvent', (new_conn, err) => {
    if (!err) conn = new_conn;
});

const create = (roomId, message, uid) => {
    return new Promise((resolve, reject) => {
        //todo verif
        console.log(roomId)
        if (conn) {
            conn.query('INSERT INTO chat_messages (id_room, message, id_from) values (?,?,?)', [roomId, message, uid], (err, results) => {
              if (err) {
                  reject(new Error("sql.alert.query"));
              } else {
                  resolve();
              }
            });
        } else {
            reject(new Error("sql.alert.undefined"));
        }
    });
}

module.exports = create;

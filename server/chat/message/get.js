const emitter = require('../../emitter');
var conn = null;

emitter.on('dbConnectEvent', (new_conn, err) => {
    if (!err) conn = new_conn;
});

const get = (id, uid) => {
    return new Promise((resolve, reject) => {
        if (conn) {
          conn.query('SELECT chat_messages.* \
          FROM chat_messages \
          INNER JOIN chat_rooms ON chat_messages.id_room = chat_rooms.id \
          WHERE ? AND (? OR ?)',
          [{'chat_messages.id_room': id }, {'chat_rooms.id_user1': uid}, {'chat_rooms.id_user2': uid}], (err, results) => {
            console.log(results);
              if (err) {
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

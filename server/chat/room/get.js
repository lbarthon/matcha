const emitter = require('../../emitter');
const { get_infos_id } = require('../../user/get_infos');
var conn = null;

emitter.on('dbConnectEvent', (new_conn, err) => {
    if (!err) conn = new_conn;
});

const get = id => {
    return new Promise((resolve, reject) => {
        if (conn) {
            conn.query('SELECT chat_rooms.*, user1.username AS user1, user1pic.picture AS user1pic, \
              user2.username AS user2, user2pic.picture AS user2pic FROM chat_rooms \
              INNER JOIN users AS user1 ON chat_rooms.id_user1 = user1.id \
              INNER JOIN users AS user2 ON chat_rooms.id_user2 = user2.id \
              LEFT JOIN pictures AS user1pic ON user1.id = user1pic.user_id AND user1pic.main = 1 \
              LEFT JOIN pictures AS user2pic ON user2.id = user2pic.user_id AND user2pic.main = 1 \
              WHERE ? OR ?',
              [{'chat_rooms.id_user1': id}, {'chat_rooms.id_user2': id}], (err, results) => {
                if (err)
                    reject(new Error("sql.alert.query"));
                else {
                    console.log(results);
                    resolve(results);
                }
            });
        } else {
            reject(new Error("sql.alert.undefined"));
        }
    });
}

module.exports = get;

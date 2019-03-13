const emitter = require('../../emitter');
const io = require('../../io').get();
var conn = null;

emitter.on('dbConnectEvent', (new_conn, err) => {
    if (!err) conn = new_conn;
});
/**
 * Send a notification of type to the user.
 * @param {int} reciever
 * @param {int} sender
 * @param {string} type
 */
const notify = (type, sender, reciever) => {
    const types = ['message', 'like', 'visit', 'match', 'unmatch'];
    if (conn) {
      if (!types.includes(type))
        return;
      conn.query('SELECT * FROM users WHERE id = ? OR id = ? LIMIT 2', [reciever, sender], (err, results) => {
        if (err) return err;
        if (results.length == 2) {
          conn.query('INSERT INTO notifications (to_id, from_id, type) VALUES (?, ?, ?)', [reciever, sender, type], (err) => {
            if (err) return err;
            io.sockets.in(reciever).emit('new_notification');
            if (type == 'match') {
              conn.query('SELECT * FROM chat_rooms WHERE (id_user1 = ? AND id_user2 = ?) OR (id_user1 = ? AND id_user2 = ?)',
              [reciever, sender, sender, reciever], (err, results) => {
                console.log(results);
                if (results.length == 0)
                  conn.query('INSERT INTO chat_rooms (id_user1, id_user2) VALUES (?, ?)', [reciever, sender]);
                else if (results[0].display == 0)
                  conn.query('UPDATE chat_rooms SET display = 1 WHERE id = ?', [results[0].id]);
              });
            }
          });
        }
      });
    } else {
        return 'sql.alert.undefined';
    }
}

module.exports = notify;

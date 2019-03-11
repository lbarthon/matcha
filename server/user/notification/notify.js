const emitter = require('../../emitter');
var conn = null;
const io = require('../../io').get();

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
      conn.query('SELECT * FROM users WHERE id = ? OR id = 2 LIMIT 2', [reciever, sender], (err, results_1) => {
        if (results_1.length == 2) {
          conn.query('INSERT INTO notifications (to_id, from_id, type) VALUES (?, ?, ?)', [reciever, sender, type], (err) => {
            if (err)
              console.log(err);
            else {
              io.sockets.in(reciever).emit('new_notification');
            }
          });
        }
      });
    }
}

module.exports = notify;

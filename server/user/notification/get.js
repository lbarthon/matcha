const emitter = require('../../emitter');
var conn = null;

emitter.on('dbConnectEvent', (new_conn, err) => {
    if (!err) conn = new_conn;
});

const get = (uid, callback) => {
    if (conn) {
        conn.query('SELECT notifications.*, users.username AS username \
        FROM notifications \
        INNER JOIN `users` ON users.id = notifications.from_id \
        WHERE notifications.to_id = ?', [uid], (err, results) => {
            if (err)
                err = 'sql.alert.query';
            return callback(err, results);
        })
    }
}

module.exports = get;

const emitter = require('../../emitter');
var conn = null;

emitter.on('dbConnectEvent', (new_conn, err) => {
    if (!err) conn = new_conn;
});
/**
 * Gets all user's notifications.
 * @param {int} uid 
 * @param {function} callback 
 */
const get = (uid, callback) => {
    if (conn) {
        conn.query('SELECT notifications.*, users.username AS username \
        FROM notifications \
        INNER JOIN `users` ON users.id = notifications.from_id \
        WHERE notifications.to_id = ? ORDER BY create_time DESC', [uid], (err, results) => {
            if (err)
                err = 'sql.alert.query';
            return callback(err, results);
        })
    } else {
        callback('sql.alert.undefined');
    }
}

module.exports = get;

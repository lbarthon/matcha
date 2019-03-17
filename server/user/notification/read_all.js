const emitter = require('../../emitter');
var conn = null;

emitter.on('dbConnectEvent', (new_conn, err) => {
    if (!err) conn = new_conn;
});
/**
 * Marks a notification as read.
 * @param {int} uid
 * @param {function} callback
 */
const readAll = (uid, callback) => {
    if (conn) {
        conn.query('UPDATE `notifications` SET `read` = 1 WHERE `to_id` = ?', [uid], (err, results) => {
            if (err)
                err = 'sql.alert.query';
            return callback(err, results);
        });
    } else {
        callback('sql.alert.undefined');
    }
}

module.exports = readAll;

const emitter = require('../../emitter');
var conn = null;

emitter.on('dbConnectEvent', (new_conn, err) => {
    if (!err) conn = new_conn;
});

const read = (uid, notifId, callback) => {
    if (conn) {
        conn.query('UPDATE `notifications` SET `read` = 1 WHERE `id` = ? AND `to_id` = ? LIMIT 1', [notifId, uid], (err, results) => {
            if (err)
                err = 'sql.alert.query';
            return callback(err, results);
        })
    } else {
        callback('sql.alert.undefined');
    }
}

module.exports = read;

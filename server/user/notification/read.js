const emitter = require('../../emitter');
var conn = null;

emitter.on('dbConnectEvent', (new_conn, err) => {
    if (!err) conn = new_conn;
});

const read = (uid, callback) => {
    if (conn) {
        conn.query('UPDATE `notifications` SET `read` = 1 WHERE `to_id` = ?', [uid], (err, results) => {
            if (err)
                err = 'sql.alert.query';
            return callback(err, results);
        })
    }
}

module.exports = read;

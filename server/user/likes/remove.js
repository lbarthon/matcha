const emitter = require('../../emitter');
var conn = null;

emitter.on('dbConnectEvent', (new_conn, err) => {
    if (!err) conn = new_conn;
});

const remove = req => {
    var infos = req.body;
    return new Promise((resolve, reject) => {
        if (conn) {
            conn.query("DELETE FROM likes WHERE ? AND ?", [{target_id: infos.target}, {user_id: req.session.uid}], (err, results) => {
                if (err) {
                    reject(new Error("sql.alert.query"));
                } else if (results.affectedRows == 1) {
                    resolve();
                } else {
                    reject(new Error("likes.remove.absent"));
                }
            });
        } else {
            reject(new Error("sql.alert.undefined"));
        }
    });
}

module.exports = remove;

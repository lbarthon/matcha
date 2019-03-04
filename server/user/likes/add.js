const emitter = require('../../emitter');
var conn = null;

emitter.on('dbConnectEvent', (new_conn, err) => {
    if (!err) conn = new_conn;
});

const add = req => {
    var infos = req.body;
    return new Promise((resolve, reject) => {
        if (conn) {
            conn.query("SELECT * FROM likes WHERE ? AND ?", [{target_id: infos.target}, {user_id: req.session.uid}], (err, results) => {
                if (err) {
                    reject(new Error("sql.alert.query"));
                } else if (results.length > 0) {
                    reject(new Error("likes.add.present"));
                } else {
                    conn.query("INSERT INTO likes (user_id, target_id) VALUES (?,?)", [infos.target, req.session.uid], err => {
                        if (err) {
                            reject(new Error("sql.alert.query"));
                        } else {
                            resolve();
                        }
                    })
                }
            });
        } else {
            reject(new Error("sql.alert.undefined"));
        }
    });
}

module.exports = add;

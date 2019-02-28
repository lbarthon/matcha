const emitter = require('../emitter');
var conn = null;

emitter.on('dbConnectEvent', (new_conn, err) => {
    if (!err) conn = new_conn;
});

const remove = req => {
    return new Promise((resolve, reject) => {
        if (conn) {
            var uid = req.session.uid;
            var tag = req.body.tag;
            if (tag == undefined || tag == '') {
                reject(new Error("tag.remove.undefined"));
            } else {
                conn.query("SELECT tag FROM tags WHERE ? AND ?", [{user_id: uid}, {tag: tag}], (err, results) => {
                    if (err) {
                        reject(new Error("sql.alert.query"));
                    } else if (results.length == 0) {
                        reject(new Error("tag.remove.not_set"));
                    } else {
                        conn.query("DELETE FROM tags WHERE ? AND ?", [{user_id: uid}, {tag: tag}], err => {
                            if (err) {
                                reject(new Error("sql.alert.query"));
                            } else {
                                resolve();
                            }
                        });
                    }
                });
            }
        } else {
            reject(new Error("sql.alert.undefined"));
        }
    });
}

module.exports = remove;

const emitter = require('../emitter');
var conn = null;

emitter.on('dbConnectEvent', (new_conn, err) => {
    if (!err) conn = new_conn;
});

const add = req => {
    return new Promise((resolve, reject) => {
        if (conn) {
            var uid = req.session.uid;
            var tag = req.body.tag;
            if (tag == undefined || tag == '') {
                reject(new Error("tag.add.undefined"));
            } else {
                conn.query("SELECT tag FROM tags WHERE ? AND ?", [{user_id: uid}, {tag: tag}], (err, results) => {
                    if (err) {
                        reject(new Error("sql.alert.query"));
                    } else if (results.length > 0) {
                        reject(new Error("tag.add.already_set"));
                    } else {
                        conn.query("INSERT INTO tags (tag, user_id) VALUES (?,?)", [tag, uid], err => {
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

module.exports = add;

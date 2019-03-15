const emitter = require('../emitter');
var conn = null;

emitter.on('dbConnectEvent', (new_conn, err) => {
    if (!err) conn = new_conn;
});
/**
 * Adds array of tags in param.
 * @param {*} toAdd 
 */
const add = toAdd => {
    return new Promise((resolve, reject) => {
        if (toAdd.length > 0) {
            conn.query("INSERT INTO tags (tag, user_id) VALUES ?", [toAdd], err => {
                if (err) reject();
                else resolve();
            });
        } else {
            resolve();
        }
    });
}
/**
 * Remove array of tags in param.
 * @param {*} toRemove 
 */
const remove = toRemove => {
    return new Promise((resolve, reject) => {
        if (toRemove.length > 0) {
            conn.query("DELETE FROM tags WHERE (tag, user_id) IN (?)", [toRemove], err => {
                if (err) reject();
                else resolve();
            });
        } else {
            resolve();
        }
    });
}
/**
 * Updates user's tags.
 * @param {*} req 
 */
const update = req => {
    return new Promise((resolve, reject) => {
        if (conn) {
            var uid = req.session.uid;
            var tags = req.body.tags;
            if (uid == undefined || uid == '' || isNaN(uid)) {
                reject(new Error("alert.wrong_id"));
            } else if (tags == undefined || tags.length == 0) {
                reject(new Error("tag.update.undefined"));
            } else {
                conn.query("SELECT tag FROM tags WHERE ?", [{user_id: uid}], (err, results) => {
                    if (err) {
                        reject(new Error("sql.alert.query"));
                    } else {
                        var mapped = results.map(value => {
                            return value.tag;
                        });
                        var toAdd = [];
                        var toRemove = mapped;
                        for (var index = 0; index < tags.length; index++) {
                            if (toRemove.includes(tags[index].tag)) {
                                toRemove.splice(toRemove.indexOf(tags[index].tag), 1);
                            } else {
                                toAdd.push(tags[index].tag);
                            }
                        }
                        toAdd = toAdd.map(value => {
                            return [ value, uid ];
                        });
                        toRemove = toRemove.map(value => {
                            return [ value, uid ];
                        });
                        add(toAdd)
                        .then(() => {
                            remove(toRemove)
                            .then(() => {
                                resolve();
                            })
                            .catch(() => {
                                reject(new Error("sql.alert.query"));
                            })
                        }).catch(() => {
                            reject(new Error("sql.alert.query"));
                        });
                    }
                });
            }
        } else {
            reject(new Error("sql.alert.undefined"));
        }
    });
}

module.exports = update;

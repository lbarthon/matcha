const emitter = require('../../emitter');
var conn = null;

emitter.on('dbConnectEvent', (new_conn, err) => {
    if (!err) conn = new_conn;
});

/**
 * Function that adds a like.
 * Informations taken :
 * req.body.target -> User to like
 * @param {*} req 
 */
const add = req => {
    var infos = req.body;
    return new Promise((resolve, reject) => {
        if (conn) {
            if (infos.target == undefined || infos.target == '' || isNaN(infos.target)) {
                reject(new Error("error_wrong_id"));
            } else {
                conn.query("SELECT * FROM likes WHERE ? AND ?",
                        [{target_id: infos.target}, {user_id: req.session.uid}], (err, results) => {
                    if (err) {
                        reject(new Error("sql.alert.query"));
                    } else if (results.length > 0) {
                        reject(new Error("likes.add.present"));
                    } else {
                        conn.query("INSERT INTO likes (target_id, user_id) VALUES (?,?)", [infos.target, req.session.uid], err => {
                            if (err) {
                                reject(new Error("sql.alert.query"));
                            } else {
                                resolve();
                            }
                        })
                    }
                });
            }
        } else {
            reject(new Error("sql.alert.undefined"));
        }
    });
}

module.exports = add;

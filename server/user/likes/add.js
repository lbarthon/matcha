const emitter = require('../../emitter');
const notify = require('../notification/notify');
const utils = require('../utils');
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
    var uid = req.session.uid;
    return new Promise((resolve, reject) => {
        if (conn) {
            if (infos.target == undefined || infos.target == '' || isNaN(infos.target)) {
                reject(new Error("alert.wrong_id"));
            } else if (infos.target == uid) {
                reject(new Error("likes.add.yourself"));
            } else {
                utils.isComplete(uid)
                .then(() => {
                    conn.query("SELECT * FROM likes WHERE ? AND ?",
                    [{target_id: infos.target}, {user_id: uid}], (err, results) => {
                        if (err) {
                            reject(new Error("sql.alert.query"));
                        } else if (results.length > 0) {
                            reject(new Error("likes.add.present"));
                        } else {
                            conn.query("INSERT INTO likes (target_id, user_id) VALUES (?,?)", [infos.target, uid], err => {
                                if (err) {
                                    reject(new Error("sql.alert.query"));
                                } else {
                                    conn.query("SELECT * FROM likes WHERE ? AND ?", [{user_id: infos.target}, {target_id: uid}], (err, results) => {
                                        if (err) {
                                            reject(new Error("sql.alert.query"));
                                        } else if (results.length == 1) {
                                            notify('match', uid, infos.target, true);
                                            notify('match', infos.target, uid);
                                            resolve();
                                        } else {
                                            notify('like', uid, infos.target);
                                            resolve();
                                        }
                                    })
                                }
                            })
                        }
                    });
                })
                .catch(reject);
            }
        } else {
            reject(new Error("sql.alert.undefined"));
        }
    });
}

module.exports = add;

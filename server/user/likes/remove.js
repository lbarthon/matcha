const emitter = require('../../emitter');
const notify = require('../notification/notify');
var conn = null;

emitter.on('dbConnectEvent', (new_conn, err) => {
    if (!err) conn = new_conn;
});
/**
 * Removes a like from an user.
 * Informations taken :
 * req.body.target -> User you want to dislike
 * @param {*} req
 */
const remove = req => {
    var infos = req.body;
    var uid = req.session.uid;
    return new Promise((resolve, reject) => {
        if (conn) {
            if (infos.target == undefined || infos.target == '' || isNaN(infos.target)) {
                reject(new Error("error_wrong_id"));
            } else {
                conn.query("DELETE FROM likes WHERE ? AND ?", [{user_id: uid}, {target_id: infos.target}], (err, results) => {
                    if (err) {
                        reject(new Error("sql.alert.query"));
                    } else if (results.affectedRows == 1) {
                        conn.query("SELECT * FROM likes WHERE ? AND ?", [{user_id: infos.target}, {target_id: uid}], (err, results) => {
                            if (err) {
                                reject(new Error("sql.alert.query"));
                            } else {
                                if (results.length == 1) {
                                    notify('unmatch', uid, infos.target);
                                }
                                resolve();
                            }
                        });
                    } else {
                        reject(new Error("likes.remove.absent"));
                    }
                });
            }
        } else {
            reject(new Error("sql.alert.undefined"));
        }
    });
}

module.exports = remove;

const emitter = require('../../emitter');
var conn = null;

emitter.on('dbConnectEvent', (new_conn, err) => {
    if (!err) conn = new_conn;
});
/**
 * Sets a picture as main picture
 * @param {*} infos
 * @param {int} uid
 */
const set_main = (infos, uid) => {
    return new Promise((resolve, reject) => {
        if (conn) {
            if (infos.id == undefined || infos.id == '' || isNaN(infos.id)) {
                reject(new Error("alert.wrong_id"));
            } else {
                conn.query("UPDATE pictures SET main=0 WHERE user_id=?", [uid], err => {
                    if (err) {
                        reject(new Error("sql.alert.query"));
                    } else {
                        conn.query("UPDATE pictures SET main=1 WHERE id=? AND user_id=?",
                                [infos.id, uid], (err, result) => {
                            if (err) {
                                reject(new Error("sql.alert.query"));
                            } else if (result.affectedRows == 1) {
                                resolve();
                            } else {
                                reject(new Error("upload.alert.set_main"));
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

module.exports = {
    set_main : set_main
}

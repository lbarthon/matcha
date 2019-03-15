const emitter = require('../../emitter');
const notify = require('../notification/notify');
var conn = null;

emitter.on('dbConnectEvent', (new_conn, err) => {
    if (!err) conn = new_conn;
});

/**
 * Unbloque from an user.
 * Informations taken :
 * req.body.target -> User you want to unbloquer
 * @param {*} req
 */
const remove = req => {
    var infos = req.body;
    var uid = req.session.uid;
    return new Promise((resolve, reject) => {
        if (conn) {
            if (infos.target == undefined || infos.target == '' || isNaN(infos.target)) {
                reject(new Error("alert.wrong_id"));
            } else {
                conn.query("DELETE FROM blocked WHERE ? AND ?", [{user_id: uid}, {target_id: infos.target}], (err, results) => {
                    if (err) {
                        reject(new Error("sql.alert.query"));
                    } else if (results.affectedRows == 1) {
                        resolve();
                    } else {
                        reject(new Error("blocked.remove.absent"));
                    }
                });
            }
        } else {
            reject(new Error("sql.alert.undefined"));
        }
    });
}

module.exports = remove;

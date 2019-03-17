const emitter = require('../../emitter');
var conn = null;

emitter.on('dbConnectEvent', (new_conn, err) => {
    if (!err) conn = new_conn;
});
/**
 * Returns picture name from it's id.
 * Also checks that it belongs to uid.
 * @param {int} id
 * @param {int} uid
 */
const getPicNameFromId = (id, uid) => {
    return new Promise((resolve, reject) => {
        if (conn) {
            if (id == undefined || id == '' || isNaN(id)) {
                reject(new Error("alert.wrong_id"));
            } else {
                conn.query("SELECT user_id, picture AS name FROM pictures WHERE id=?",
                    [id], (err, result) => {
                    if (err) {
                        reject(new Error("sql.alert.query"));
                    } else if (result.length == 1) {
                        if (result[0]['user_id'] != uid) {
                            reject(new Error("upload.alert.wrong_user"));
                        } else {
                            resolve(result[0]['name']);
                        }
                    } else {
                        reject(new Error("picture.error.get_name"));
                    }
                });
            }
        } else {
            reject(new Error("sql.alert.undefined"));
        }
    });
}

module.exports = {
    getPicNameFromId : getPicNameFromId
}

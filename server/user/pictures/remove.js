const emitter = require('../../emitter');
const fs = require('fs');
var conn = null;
const utils = require('./utils');

emitter.on('dbConnectEvent', (new_conn, err) => {
    if (!err) conn = new_conn;
});

/**
 * Removes one of uid's pictures.
 * @param {*} infos
 * @param {int} uid
 */
const remove = (infos, uid) => {
    return new Promise((resolve, reject) => {
        if (conn) {
            utils.getPicNameFromId(infos.id, uid)
            .then(name => {
                    conn.query("DELETE FROM pictures WHERE id=? AND user_id=? AND main=0",
                            [infos.id, uid], (err, result) => {
                        if (err) {
                            reject(new Error("sql.alert.query"));
                        } else if (result.affectedRows == 0) {
                            reject(new Error("upload.alert.remove_main"));
                        } else {
                            fs.unlink('./public/pictures/user/' + name, (err) => {
                              if (err) {
                                reject(new Error("upload.alert.remove"))
                              } else {
                                resolve();
                              }
                            });
                        }
                    });
            })
            .catch(reject);
        } else {
            reject(new Error("sql.alert.undefined"));
        }
    });
}

module.exports = {
    remove : remove
}

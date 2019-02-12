const emitter = require('../../emitter');
const fs = require('fs');
var conn = null;

emitter.on('dbConnectEvent', (new_conn, err) => {
    if (!err) conn = new_conn;
});

const remove = (infos, uid) => {
    return new Promise((resolve, reject) => {
        if (conn) {
            // TODO -- CHECK COMMENT QUE TU ME SEND LE NAME OU ID DE LA PHOTO
            fs.unlink('../../../public/pictures/users/' + name, err => {
                if (err) {
                    reject(new Error("picture.error.remove"))
                } else {
                    conn.query("DELETE FROM pictures WHERE id=? AND user_id=?",
                            [id, uid], (err, result) => {
                        if (err) {
                            reject(new Error("picture.error.remove"));
                        } else if (result.affectedRows == 0) {
                            reject(new Error("picture.error.remove.none"));
                        } else {
                            resolve();
                        }
                    });
                }
            });
        } else {
            reject(new Error("error.sql.undefined"));
        }
    });
}

module.exports = {
    remove : remove
}

const emitter = require('../../emitter');
const { get_infos_id } = require('../../user/get_infos');
var conn = null;

emitter.on('dbConnectEvent', (new_conn, err) => {
    if (!err) conn = new_conn;
});

const get = id => {
    return new Promise((resolve, reject) => {
        if (conn) {
            conn.query('SELECT * FROM chat_rooms WHERE id_user1 = ? OR id_user2 = ?', [uid, uid], (result, err) => {
                if (err)
                    reject(new Error("sql.alert.query"));
                else {
                    for (let i in result) {
                        get_infos_id(result[i].id_user1).then(res => {
                            result[i].user1 = res;
                        }).catch(err => { reject(err); });
                        get_infos_id(result[i].id_user2).then(res => {
                            result[i].user2 = res;
                        }).catch(err => { reject(err); });
                    }
                    resolve(result);
                }
            });
        } else {
            reject(new Error("sql.alert.undefined"));
        }
    });
}

module.exports = get;

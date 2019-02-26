const emitter = require('../emitter');
var conn = null;

emitter.on('dbConnectEvent', (new_conn, err) => {
    if (!err) conn = new_conn;
});

const getPicNameFromId = id => {
    return new Promise((resolve, reject) => {
        if (conn) {
            conn.query("SELECT picture AS name FROM pictures WHERE id=?",
                    [id], (err, result) => {
                if (err) {
                    reject(new Error("sql.alert.query"));
                } else if (result.length == 1) {
                    resolve(result[0]['name']);
                } else {
                    reject(new Error("picture.error.get_name"));
                }
            });
        } else {
            reject(new Error("sql.alert.undefined"));
        }
    });
}

module.exports = {
    getPicNameFromId : getPicNameFromId
}

const emitter = require('../../emitter');
var conn = null;

emitter.on('dbConnectEvent', (new_conn, err) => {
    if (!err) conn = new_conn;
});

const get = message => {
    return new Promise((resolve, reject) => {
        if (conn) {

        } else {
            reject(new Error("sql.alert.undefined"));
        }
    });
}

module.exports = get;

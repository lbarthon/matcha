var emitter = require('../emitter.js');
var conn = null;

emitter.on('dbConnectEvent', (new_conn, err) => {
    if (!err) conn = new_conn;
});

var getIdFromUsername = username => {
    return new Promise((resolve, reject) => {
        if (conn) {
            conn.query("SELECT id FROM users WHERE username=?", [username], (err, results) => {
                if (err) {
                    reject(new Error("Error querying database."));
                } else {
                    if (results.length == 0) {
                        reject(new Error("User not found"));
                    } else {
                        resolve(results[0].id);
                    }
                }
            });
        } else {
            reject(new Error("Sql connection undefined!"));
        }
    })
}

module.exports = {
    getIdFromUsername : getIdFromUsername
}

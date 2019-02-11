const emitter = require('../emitter');
var conn = null;

emitter.on('dbConnectEvent', (new_conn, err) => {
    if (!err) conn = new_conn;
});

const getIdFromUsername = username => {
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

const getIdFromEmail = email => {
    return new Promise((resolve, reject) => {
        if (conn) {
            conn.query("SELECT id FROM users WHERE email=?", [email], (err, results) => {
                if (err) {
                    reject(new Error("Error querying database."));
                } else {
                    if (results.length == 0) {
                        reject(new Error("Email not found"));
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
    getIdFromUsername : getIdFromUsername,
    getIdFromEmail    : getIdFromEmail
}

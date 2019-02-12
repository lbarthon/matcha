const emitter = require('../emitter');
const db_infos = require('../database');
const prod = (process.env.PROD == "true" || false);
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
    });
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
    });
}

const isLogged = req => {
    return new Promise((resolve, reject) => {
        if (req.session.username != undefined && req.session.uid != undefined) {
            getIdFromUsername(req.session.username)
            .then(id => {
                if (req.session.uid == id) {
                    resolve(req.session.username);
                } else {
                    reject();
                }
            })
            .catch(() => reject());
        } else {
            reject();
        }
    });
}

const getTableColumns = table => {
    return new Promise((resolve, reject) => {
        if (conn) {
            conn.query("SELECT column_name FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA=? AND TABLE_NAME=?",
                    [db_infos.db_name, table], (err, results) => {
                if (err) {
                    reject(new Error("Error querying database."));
                } else {
                    if (results.length == 0) {
                        reject(new Error("Unknown table."));
                    } else {
                        resolve(results);
                    }
                }
            });
        } else {
            reject(new Error("Sql connection undefined!"));
        }
    });
}

const areInfosClean = (infos, table) => {
    if (prod) return;
    getTableColumns(table)
    .then((ret) => {
        ret = JSON.parse(JSON.stringify(ret));
        for (let key in ret) {
            ret[key] = ret[key].column_name;
        }
        var good_vals = [];
        var logged = 0;
        for (let key in infos) {
            if (!ret.includes(key)) {
                if (logged < 3) {
                    console.log("Unknown database value for", key, ". This might be normal.");
                }
                logged++;
            } else {
                good_vals.push(key);
            }
        }
        if (logged > 3) {
            console.log("(", logged - 3, "more )")
        }
    }).catch(console.error)
}

module.exports = {
    getIdFromUsername : getIdFromUsername,
    getIdFromEmail    : getIdFromEmail,
    isLogged          : isLogged,
    getTableColumns   : getTableColumns,
    areInfosClean     : areInfosClean
}

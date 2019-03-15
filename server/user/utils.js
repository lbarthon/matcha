const randomstring = require('randomstring');
const emitter = require('../emitter');
const db_infos = require('../database');
const prod = (process.env.PROD == "true" || false);
var conn = null;

emitter.on('dbConnectEvent', (new_conn, err) => {
    if (!err) conn = new_conn;
});
/**
 * Returns uid of the username in param.
 * @param {string} username
 */
const getIdFromUsername = username => {
    return new Promise((resolve, reject) => {
        if (conn) {
            conn.query("SELECT id, banned FROM users WHERE username=?", [username], (err, results) => {
                if (err) {
                    reject(new Error("sql.alert.query"));
                } else {
                    if (results.length == 0) {
                        reject(new Error("login.alert.user_unknow"));
                    } else if (results[0].banned == 1) {
                        reject(new Error("login.alert.user_banned"));
                    } else {
                        resolve(results[0].id);
                    }
                }
            });
        } else {
            reject(new Error("sql.alert.undefined"));
        }
    });
}
/**
 * Returns uid of the email in param.
 * @param {email} email
 */
const getIdFromEmail = email => {
    return new Promise((resolve, reject) => {
        if (conn) {
            conn.query("SELECT id, banned FROM users WHERE email=?", [email], (err, results) => {
                if (err) {
                    reject(new Error("sql.alert.query"));
                } else {
                    if (results.length == 0) {
                        reject(new Error("alert.email_unknow"));
                    } else if (results[0].banned == 1) {
                        reject(new Error("login.alert.user_banned"));
                    } else {
                        resolve(results[0].id);
                    }
                }
            });
        } else {
            reject(new Error("sql.alert.undefined"));
        }
    });
}
/**
 * Resolves if the user is logged, rejects otherwise.
 * @param {*} req
 */
const isLogged = (req, regen = false) => {
    return new Promise((resolve, reject) => {
        if (regen && req.session.csrf === undefined) {
            req.session.csrf = randomstring.generate(50);
            req.session.save();
        }
        if (req.session.username != undefined && req.session.uid != undefined) {
            getIdFromUsername(req.session.username)
            .then(id => {
                if (req.session.uid == id) {
                    resolve(req.session);
                } else {
                    reject(req.session);
                }
            })
            .catch(() => reject(req.session));
        } else {
            reject(req.session);
        }
    });
}
/**
 * Resolves if the user is admin, rejects otherwise.
 * @param {*} req
 */
const isAdmin = req => {
    return new Promise((resolve, reject) => {
        isLogged(req)
        .then(session => {
            conn.query("SELECT perm_level FROM users WHERE ?", [{id: session.uid}], (err, results) => {
                if (err) {
                    reject();
                } else if (results.length == 1) {
                    resolve();
                } else {
                    reject();
                }
            });
        })
        .catch(() => reject())
    });
}
/**
 * Returns all the columns of the table in param.
 * @param {string} table
 */
const getTableColumns = table => {
    return new Promise((resolve, reject) => {
        if (conn) {
            conn.query("SELECT column_name FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA=? AND TABLE_NAME=?",
                    [db_infos.db_name, table], (err, results) => {
                if (err) {
                    reject(new Error("sql.alert.query"));
                } else {
                    if (results.length == 0) {
                        reject(new Error("sql.alert.table_undefined"));
                    } else {
                        resolve(results);
                    }
                }
            });
        } else {
            reject(new Error("sql.alert.undefined"));
        }
    });
}
/**
 * Weird function that filter infos returning only good keys in it, in order to update those.
 * Alerts weird values that aren't in database if prod = false;
 * @param {req.body} infos
 * @param {string} table
 */
const areInfosClean = (infos, table) => {
    return new Promise((resolve, reject) => {
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
                    if (!prod && logged < 3) {
                        console.log("Unknown database value for", key, ". This might be normal.");
                    }
                    logged++;
                } else {
                    good_vals.push(key);
                }
            }
            if (!prod && logged > 3) {
                console.log("(", logged - 3, "more )")
            }
            resolve(good_vals);
        }).catch(reject);
    });
}
/**
 * Updates last_seen value for the specified uid.
 * @param {int} uid
 */
const setLastLogged = (uid) => {
    if (conn && uid) {
        var date = new Date();
        var timestamp = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
        conn.query("UPDATE users SET last_seen=? WHERE id=?", [timestamp, uid]);
    }
}
/**
 * Returns age of a birthdate in params.
 * @param {dd/mm/yyyy} birthdate 
 */
const getAge = (birthdate) => {
    let now = new Date();
    let split = birthdate.split("/");
    let years = now.getFullYear() - split[2];
    if (split[1] >= now.getMonth() + 1) {
        if (split[1] == now.getMonth() + 1) {
            if (split[0] > now.getDate()) {
                years--;
            }
        } else {
            years--;
        }
    }
    return years;
}

module.exports = {
    getIdFromUsername : getIdFromUsername,
    getIdFromEmail    : getIdFromEmail,
    isLogged          : isLogged,
    isAdmin           : isAdmin,
    getTableColumns   : getTableColumns,
    areInfosClean     : areInfosClean,
    setLastLogged     : setLastLogged,
    getAge            : getAge
}

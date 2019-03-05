const emitter = require('../../emitter');
const userUtils = require('../utils');
var conn = null;

emitter.on('dbConnectEvent', (new_conn, err) => {
    if (!err) conn = new_conn;
});

/**
 * Returns all reports if user is admin
 * @param {*} req 
 */
const get = req => {
    return new Promise((resolve, reject) => {
        userUtils.isAdmin(req)
        .then(() => {
            conn.query("SELECT report FROM reports", (err, results) => {
                if (err) {
                    reject(new Error("sql.alert.query"));
                } else {
                    resolve(results);
                }
            });
        })
        .catch(() => reject(new Error("error_not_admin")));
    });
}

module.exports = get;

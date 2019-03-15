const emitter = require('../../emitter');
const userUtils = require('../utils');
var conn = null;

emitter.on('dbConnectEvent', (new_conn, err) => {
    if (!err) conn = new_conn;
});
/**
 * Take report id in req.body.id
 * @param {*} req
 */
const del = req => {
    var infos = req.body;
    return new Promise((resolve, reject) => {
        userUtils.isAdmin(req)
        .then(() => {
            conn.query("DELETE FROM reports WHERE ?", [{id: infos.id}], (err) => {
                if (err) {
                    reject(new Error("sql.alert.query"));
                } else {
                    resolve();
                }
            });
        })
        .catch(() => reject(new Error("alert.not_admin")));
    });
}

module.exports = del;

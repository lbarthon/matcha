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
            conn.query("SELECT reports.id, reports.report, reports.create_time, \
                    reports.user_id AS reporter_id, user.username AS reporter, \
                    reports.target_id AS reported_id, target.username AS reported \
                    FROM reports \
                    INNER JOIN users AS user ON reports.user_id = user.id \
                    INNER JOIN users AS target ON reports.target_id = target.id \
                    ORDER BY id DESC", (err, results) => {
                if (err) {
                    reject(new Error("sql.alert.query"));
                } else {
                    resolve(results);
                }
            });
        })
        .catch(() => reject(new Error("alert.not_admin")));
    });
}

module.exports = get;
